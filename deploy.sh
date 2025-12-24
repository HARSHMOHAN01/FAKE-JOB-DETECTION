#!/bin/bash

set -e

PROJECT_ID="fake-job-detection-481906"
REGION="us-central1"
SERVICE_NAME="fake-job-api"
ENDPOINT_ID="${1:-}"

echo "==================================="
echo "Fake Job Detection - GCP Deployment"
echo "==================================="
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

if [ -z "$ENDPOINT_ID" ]; then
    echo "ERROR: Vertex AI Endpoint ID is required!"
    echo "Usage: ./deploy.sh <ENDPOINT_ID>"
    echo ""
    echo "To get your Endpoint ID:"
    echo "  gcloud ai endpoints list --region=$REGION"
    exit 1
fi

echo "Step 1: Setting up gcloud..."
gcloud config set project $PROJECT_ID

echo ""
echo "Step 2: Building and pushing Docker image..."
cd cloud-run-backend

echo "Building Docker image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

echo ""
echo "Step 3: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --timeout 300 \
    --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID,VERTEX_ENDPOINT_ID=$ENDPOINT_ID,GCP_REGION=$REGION"

echo ""
echo "Step 4: Getting Cloud Run URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')
echo "Cloud Run Service URL: $SERVICE_URL"

echo ""
echo "Step 5: Testing the deployment..."
echo "Sending test request to $SERVICE_URL/health..."
curl -s "$SERVICE_URL/health" | python -m json.tool

echo ""
echo "Step 6: Updating .env file..."
cd ..

sed -i "s|VITE_CLOUD_RUN_ENDPOINT=.*|VITE_CLOUD_RUN_ENDPOINT=$SERVICE_URL|" .env

if [ -z "${VITE_VERTEX_AI_ENDPOINT}" ]; then
    VERTEX_URL="https://$REGION-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/$REGION/endpoints/$ENDPOINT_ID"
    sed -i "s|VITE_VERTEX_AI_ENDPOINT=.*|VITE_VERTEX_AI_ENDPOINT=$VERTEX_URL|" .env
fi

echo "Updated .env with:"
echo "  VITE_CLOUD_RUN_ENDPOINT=$SERVICE_URL"

echo ""
echo "==================================="
echo "Deployment Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Verify .env is correctly updated"
echo "2. Run: npm run build"
echo "3. Deploy frontend: firebase deploy"
echo ""
echo "To make a test prediction:"
echo "curl -X POST $SERVICE_URL/predict \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"jobDescription\": \"Test job posting\"}'"
