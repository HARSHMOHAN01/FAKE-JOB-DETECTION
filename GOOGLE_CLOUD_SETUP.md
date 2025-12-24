# Google Cloud Setup Guide - Fake Job Detection

## Project Information
- **Project ID**: fake-job-detection-481906
- **Project Number**: 781226369708
- **Region**: us-central1 (recommended)

---

## Prerequisites Setup

### 1. Install Google Cloud SDK
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### 2. Authenticate with Google Cloud
```bash
gcloud auth application-default login
gcloud config set project fake-job-detection-481906
```

---

## Step 1: Set Up BigQuery

### Create Dataset
```bash
bq mk --dataset \
  --description "Fake Job Detection dataset" \
  --location=US \
  fake_job_detection_ds
```

### Create Predictions Table
```bash
bq mk --table \
  fake_job_detection_ds.predictions \
  schema.json
```

Create `schema.json`:
```json
[
  {"name": "id", "type": "STRING", "mode": "REQUIRED"},
  {"name": "job_description", "type": "STRING", "mode": "REQUIRED"},
  {"name": "is_fake", "type": "BOOLEAN", "mode": "REQUIRED"},
  {"name": "confidence", "type": "FLOAT64", "mode": "REQUIRED"},
  {"name": "risk_level", "type": "STRING", "mode": "REQUIRED"},
  {"name": "red_flags", "type": "STRING", "mode": "REPEATED"},
  {"name": "model_version", "type": "STRING"},
  {"name": "processing_time", "type": "INT64"},
  {"name": "created_at", "type": "TIMESTAMP", "mode": "REQUIRED"}
]
```

---

## Step 2: Deploy ML Model to Vertex AI

### Train and Deploy Model
1. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai)
2. Navigate to **Training** > **Create New Training Pipeline**
3. Select **Text classification** for your job description model
4. Upload your training data to Cloud Storage
5. Configure training parameters
6. Deploy model to Vertex AI Endpoint

### Get Endpoint URL
After deployment, copy the endpoint URL:
```
https://REGION-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/REGION/endpoints/ENDPOINT_ID
```

---

## Step 3: Deploy Cloud Run API

### Create Backend Service
Create `main.py` for your Cloud Run service:

```python
from flask import Flask, request, jsonify
from google.cloud import aiplatform
import json
import time

app = Flask(__name__)

PROJECT_ID = "fake-job-detection-481906"
ENDPOINT_ID = "YOUR_ENDPOINT_ID"
REGION = "us-central1"

aiplatform.init(project=PROJECT_ID, location=REGION)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        job_description = data.get('jobDescription')

        if not job_description:
            return jsonify({"error": "Missing jobDescription"}), 400

        start_time = time.time()

        endpoint = aiplatform.Endpoint(ENDPOINT_ID)
        instances = [{"content": job_description}]
        predictions = endpoint.predict(instances=instances)

        processing_time = int((time.time() - start_time) * 1000)

        result = {
            "isFake": predictions.predictions[0]["predictions"][1] > 0.5,
            "confidence": int(max(predictions.predictions[0]["predictions"]) * 100),
            "riskLevel": determine_risk_level(predictions.predictions[0]["predictions"]),
            "redFlags": extract_red_flags(job_description),
            "modelVersion": "v1.0",
            "processingTime": processing_time
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e), "details": str(e)}), 500

def determine_risk_level(predictions):
    confidence = max(predictions)
    if confidence < 0.4:
        return "low"
    elif confidence < 0.7:
        return "medium"
    return "high"

def extract_red_flags(text):
    keywords = [
        "easy money", "work from home", "no experience",
        "guaranteed income", "pay upfront", "processing fee"
    ]
    flags = []
    for keyword in keywords:
        if keyword.lower() in text.lower():
            flags.append(f"Contains suspicious phrase: '{keyword}'")
    return flags

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

### Create requirements.txt
```
Flask==2.3.0
google-cloud-aiplatform==1.25.0
```

### Deploy to Cloud Run
```bash
gcloud run deploy fake-job-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 300
```

Get the Cloud Run URL from the output.

---

## Step 4: Configure Firebase

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (link to existing GCP project: `fake-job-detection-481906`)
3. Enable Firestore Database
4. Set security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /predictions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Get Firebase Credentials
1. Go to Project Settings
2. Click "Service Accounts"
3. Copy Web API Key
4. Copy Project ID and API Key

---

## Step 5: Update Environment Variables

Update your `.env` file with actual values:

```env
VITE_GCP_PROJECT_ID=fake-job-detection-481906
VITE_GCP_PROJECT_NUMBER=781226369708

# Cloud Run - Get this from deployment
VITE_CLOUD_RUN_ENDPOINT=https://fake-job-api-xxxxx.run.app

# Vertex AI - Get this from endpoint console
VITE_VERTEX_AI_ENDPOINT=https://us-central1-aiplatform.googleapis.com/v1/projects/fake-job-detection-481906/locations/us-central1/endpoints/YOUR_ENDPOINT_ID

# Firebase
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_API_KEY=your-firebase-api-key

# Supabase (already configured)
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

---

## Step 6: Enable APIs

Enable required APIs in Google Cloud:

```bash
gcloud services enable \
  aiplatform.googleapis.com \
  run.googleapis.com \
  bigquery.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com
```

---

## Step 7: Set Up IAM Permissions

### Create Service Account
```bash
gcloud iam service-accounts create fake-job-detection \
  --display-name="Fake Job Detection Service Account"
```

### Grant Permissions
```bash
gcloud projects add-iam-policy-binding fake-job-detection-481906 \
  --member=serviceAccount:fake-job-detection@fake-job-detection-481906.iam.gserviceaccount.com \
  --role=roles/aiplatform.user

gcloud projects add-iam-policy-binding fake-job-detection-481906 \
  --member=serviceAccount:fake-job-detection@fake-job-detection-481906.iam.gserviceaccount.com \
  --role=roles/bigquery.dataEditor
```

---

## Step 8: Deploy Frontend to Firebase Hosting

### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Initialize Firebase Hosting
```bash
firebase init hosting
```

### Deploy
```bash
npm run build
firebase deploy
```

---

## Troubleshooting

### Cloud Run Connection Issues
- Verify endpoint URL is correct
- Check Cloud Run service is running: `gcloud run services list --region us-central1`
- Verify CORS is enabled in your backend

### Vertex AI Errors
- Ensure endpoint is deployed and active
- Check endpoint ID matches environment variable
- Verify service account has `aiplatform.user` role

### BigQuery Errors
- Verify dataset exists: `bq ls`
- Check table schema matches your data
- Ensure service account has `bigquery.dataEditor` role

### Firebase Issues
- Verify API key is correct
- Check project ID matches Firebase console
- Ensure Firestore security rules allow access

---

## Monitoring and Analytics

### View Predictions in BigQuery
```sql
SELECT
  created_at,
  is_fake,
  confidence,
  risk_level,
  COUNT(*) as count
FROM `fake-job-detection-481906.fake_job_detection_ds.predictions`
GROUP BY created_at, is_fake, confidence, risk_level
ORDER BY created_at DESC
```

### View Cloud Run Logs
```bash
gcloud run services describe fake-job-api --region us-central1
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=fake-job-api" --limit 50
```

---

## Next Steps

1. Test the connection with mock data
2. Monitor API performance
3. Collect feedback and retrain model
4. Scale Cloud Run with additional resources if needed
5. Set up monitoring alerts in Google Cloud Console

