# Google Cloud Credentials - Fill In Your Details

**PROJECT INFORMATION (Already Provided)**
```
Project ID: fake-job-detection-481906
Project Number: 781226369708
Region: us-central1
```

---

## VERTEX AI - REQUIRED

After training and deploying your ML model:

```
Endpoint ID: _________________________________

Endpoint URL: https://us-central1-aiplatform.googleapis.com/v1/projects/fake-job-detection-481906/locations/us-central1/endpoints/[ENDPOINT_ID_HERE]

Model Version: v1.0 (or your version)
```

**How to find:**
1. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai/endpoints)
2. Click on your deployed endpoint
3. Copy the "Endpoint ID" from the display name or URL
4. Endpoint URL format: `https://region-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/REGION/endpoints/ENDPOINT_ID`

---

## CLOUD RUN - REQUIRED

After deploying the backend service:

```
Service Name: fake-job-api

Service URL: _________________________________

Region: us-central1
```

**How to find:**
1. Run: `gcloud run services list --region=us-central1`
2. Or go to [Cloud Run Console](https://console.cloud.google.com/run)
3. Click "fake-job-api" service
4. Copy the "Service URL" from the top

---

## BIGQUERY - OPTIONAL (FOR LOGGING)

```
Dataset Name: fake_job_detection_ds

Table Name: predictions

Dataset Location: US
```

**How to create:**
```bash
bq mk --dataset --location=US fake_job_detection_ds
bq mk --table fake_job_detection_ds.predictions schema.json
```

---

## FIREBASE - OPTIONAL (FOR HOSTING & FIRESTORE)

After creating/linking Firebase project:

```
Firebase Project ID: _________________________________

Firebase API Key: _________________________________

Firebase Auth Domain: _________________________________

Firebase Database URL: _________________________________

Firebase Storage Bucket: _________________________________
```

**How to find:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Settings > Project Settings
4. Scroll down to "Your apps" section
5. Copy credentials from Web app configuration

---

## UPDATE .env FILE

Once you have all credentials, update `.env`:

```env
# Google Cloud
VITE_GCP_PROJECT_ID=fake-job-detection-481906
VITE_GCP_PROJECT_NUMBER=781226369708

# Vertex AI
VITE_VERTEX_AI_ENDPOINT=https://us-central1-aiplatform.googleapis.com/v1/projects/fake-job-detection-481906/locations/us-central1/endpoints/[YOUR_ENDPOINT_ID]

# Cloud Run
VITE_CLOUD_RUN_ENDPOINT=https://fake-job-api-xxxxx.run.app

# Firebase (if using)
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_API_KEY=your-firebase-api-key

# Supabase (already configured)
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

---

## SERVICE ACCOUNT (FOR BACKEND OPERATIONS)

Create a service account with appropriate permissions:

```bash
gcloud iam service-accounts create fake-job-detection \
  --display-name="Fake Job Detection Service Account"

gcloud projects add-iam-policy-binding fake-job-detection-481906 \
  --member=serviceAccount:fake-job-detection@fake-job-detection-481906.iam.gserviceaccount.com \
  --role=roles/aiplatform.user

gcloud projects add-iam-policy-binding fake-job-detection-481906 \
  --member=serviceAccount:fake-job-detection@fake-job-detection-481906.iam.gserviceaccount.com \
  --role=roles/bigquery.dataEditor
```

**Service Account Email:**
```
fake-job-detection@fake-job-detection-481906.iam.gserviceaccount.com
```

---

## DEPLOYMENT STEPS

### 1. Prepare Vertex AI Model
- [ ] Train text classification model
- [ ] Deploy to Vertex AI Endpoint
- [ ] Copy Endpoint ID
- [ ] Add to .env

### 2. Deploy Cloud Run Backend
```bash
chmod +x deploy.sh
./deploy.sh [VERTEX_ENDPOINT_ID]
```
- [ ] Copy Cloud Run URL
- [ ] .env automatically updated

### 3. Update Environment Variables
- [ ] Fill in all values in .env
- [ ] Remove placeholder values
- [ ] Save file

### 4. Build Frontend
```bash
npm run build
```
- [ ] Build successful

### 5. Deploy to Firebase
```bash
firebase init hosting
npm run build
firebase deploy
```
- [ ] Frontend deployed
- [ ] URL accessible

---

## VERIFICATION CHECKLIST

After setup:

- [ ] `gcloud ai endpoints list` shows your endpoint
- [ ] `gcloud run services list` shows fake-job-api
- [ ] `bq ls` shows fake_job_detection_ds
- [ ] Curl test to Cloud Run succeeds
- [ ] Frontend loads in browser
- [ ] Prediction works end-to-end

---

## QUICK REFERENCE

| Component | Command | Status |
|-----------|---------|--------|
| Vertex AI Endpoints | `gcloud ai endpoints list --region=us-central1` | ❌ |
| Cloud Run Services | `gcloud run services list --region=us-central1` | ❌ |
| BigQuery Datasets | `bq ls` | ❌ |
| Firebase Project | [Firebase Console](https://console.firebase.google.com) | ❌ |
| .env Updated | Check file | ❌ |
| Build Successful | `npm run build` | ❌ |
| API Working | `curl {CLOUD_RUN_URL}/health` | ❌ |
| Frontend Deployed | `firebase deploy` | ❌ |

---

## NEED HELP?

**GCP Resources:**
- [Google Cloud Console](https://console.cloud.google.com/project/fake-job-detection-481906)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)

**Check logs:**
```bash
# Cloud Run logs
gcloud run services log read fake-job-api --region=us-central1 --limit=50

# BigQuery operations
bq ls -j

# Check service status
gcloud run services describe fake-job-api --region=us-central1
```

