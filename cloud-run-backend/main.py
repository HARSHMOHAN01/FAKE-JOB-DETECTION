import os
import json
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import aiplatform
from google.cloud import bigquery
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "fake-job-detection-481906")
REGION = os.getenv("GCP_REGION", "us-central1")
ENDPOINT_ID = os.getenv("VERTEX_ENDPOINT_ID", "")
BIGQUERY_DATASET = os.getenv("BIGQUERY_DATASET", "fake_job_detection_ds")
BIGQUERY_TABLE = os.getenv("BIGQUERY_TABLE", "predictions")

aiplatform.init(project=PROJECT_ID, location=REGION)
bq_client = bigquery.Client(project=PROJECT_ID)


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()}), 200


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.json
        job_description = data.get("jobDescription", "").strip()

        if not job_description or len(job_description) < 10:
            return (
                jsonify(
                    {
                        "error": "Invalid input",
                        "details": "Job description must be at least 10 characters",
                    }
                ),
                400,
            )

        start_time = time.time()

        endpoint = aiplatform.Endpoint(ENDPOINT_ID)
        instances = [{"content": job_description}]
        predictions = endpoint.predict(instances=instances)

        processing_time = int((time.time() - start_time) * 1000)

        prediction_values = predictions.predictions[0]["predictions"]
        confidence = float(max(prediction_values)) * 100

        result = {
            "isFake": confidence > 50,
            "confidence": int(confidence),
            "riskLevel": determine_risk_level(confidence),
            "redFlags": extract_red_flags(job_description),
            "modelVersion": "v1.0",
            "processingTime": processing_time,
        }

        try:
            log_prediction_to_bigquery(job_description, result)
        except Exception as e:
            logger.error(f"Failed to log to BigQuery: {str(e)}")

        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": "Invalid JSON", "details": str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return (
            jsonify(
                {
                    "error": "Prediction failed",
                    "details": f"Internal server error: {str(e)}",
                }
            ),
            500,
        )


def determine_risk_level(confidence: float) -> str:
    if confidence < 40:
        return "low"
    elif confidence < 70:
        return "medium"
    return "high"


def extract_red_flags(text: str) -> list:
    suspicious_keywords = [
        "easy money",
        "work from home",
        "no experience",
        "guaranteed income",
        "pay upfront",
        "wire transfer",
        "send money",
        "processing fee",
        "training fee",
        "pay us",
        "western union",
        "gift card",
        "bitcoin",
        "cryptocurrency",
    ]

    flags = []
    text_lower = text.lower()

    for keyword in suspicious_keywords:
        if keyword in text_lower:
            flags.append(f"Contains suspicious phrase: '{keyword}'")

    if len(text) < 100:
        flags.append("Job description is unusually short")

    if "company" not in text_lower and "organization" not in text_lower:
        flags.append("No company information provided")

    if text.count("!") > 5:
        flags.append("Excessive punctuation usage")

    return flags[:5]


def log_prediction_to_bigquery(job_description: str, prediction: dict):
    table_id = f"{PROJECT_ID}.{BIGQUERY_DATASET}.{BIGQUERY_TABLE}"

    row = {
        "id": f"{int(time.time() * 1000)}",
        "job_description": job_description[:10000],
        "is_fake": prediction["isFake"],
        "confidence": prediction["confidence"],
        "risk_level": prediction["riskLevel"],
        "red_flags": prediction["redFlags"],
        "model_version": prediction["modelVersion"],
        "processing_time": prediction["processingTime"],
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    errors = bq_client.insert_rows_json(table_id, [row])
    if errors:
        logger.error(f"BigQuery insert errors: {errors}")
        raise Exception(f"Failed to insert row: {errors}")

    logger.info(f"Logged prediction to BigQuery for confidence: {prediction['confidence']}%")


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found", "details": "Endpoint does not exist"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Server error", "details": str(error)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False)
