# Google Cloud Integration Checklist

## Project Details
- [x] Project ID: `fake-job-detection-481906`
- [x] Project Number: `781226369708`
- [ ] Billing Account linked
- [ ] Owner/Editor access verified

---

## Phase 1: Enable APIs

- [ ] Vertex AI API enabled
- [ ] Cloud Run API enabled
- [ ] BigQuery API enabled
- [ ] Cloud Build API enabled
- [ ] Container Registry API enabled
- [ ] Firebase API enabled

**Commands:**
```bash
gcloud services enable aiplatform.googleapis.com run.googleapis.com bigquery.googleapis.com
```

---

## Phase 2: BigQuery Setup

- [ ] BigQuery dataset created: `fake_job_detection_ds`
- [ ] Predictions table created with schema
- [ ] Sample data loaded (optional)
- [ ] Test query successful

**Verify:**
```bash
bq ls fake_job_detection_ds
bq show fake_job_detection_ds.predictions
```

---

## Phase 3: Vertex AI Model

- [ ] Training data prepared (CSV/JSONL format)
- [ ] Training pipeline created
- [ ] Model trained successfully
- [ ] Model deployed to endpoint
- [ ] **Endpoint URL obtained**: `____________________`
- [ ] **Endpoint ID obtained**: `____________________`
- [ ] Test prediction successful

**Save these values in .env:**
```
VITE_VERTEX_AI_ENDPOINT=https://REGION-aiplatform.googleapis.com/v1/projects/fake-job-detection-481906/locations/us-central1/endpoints/YOUR_ENDPOINT_ID
```

---

## Phase 4: Cloud Run Backend

- [ ] Backend code created (`main.py` or equivalent)
- [ ] `requirements.txt` configured
- [ ] Service account created
- [ ] Backend deployed to Cloud Run
- [ ] **Cloud Run URL obtained**: `____________________`
- [ ] Service is publicly accessible (allow-unauthenticated)
- [ ] Test `/predict` endpoint successful
- [ ] CORS headers configured

**Save in .env:**
```
VITE_CLOUD_RUN_ENDPOINT=https://fake-job-api-xxxxx.run.app
```

**Test endpoint:**
```bash
curl -X POST CLOUD_RUN_URL/predict \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": "Test job posting"}'
```

---

## Phase 5: Firebase Setup

- [ ] Firebase project created/linked
- [ ] Firestore database created
- [ ] Authentication enabled (optional)
- [ ] Security rules configured
- [ ] Hosting enabled
- [ ] **Firebase Project ID obtained**: `____________________`
- [ ] **Firebase API Key obtained**: `____________________`

**Save in .env:**
```
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_API_KEY=your-firebase-api-key
```

---

## Phase 6: IAM & Permissions

- [ ] Service account created
- [ ] Service account has `aiplatform.user` role
- [ ] Service account has `bigquery.dataEditor` role
- [ ] Service account has `run.invoker` role (if private)
- [ ] Application Default Credentials configured

**Set permissions:**
```bash
gcloud projects add-iam-policy-binding fake-job-detection-481906 \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/aiplatform.user
```

---

## Phase 7: Frontend Configuration

- [ ] `.env` file updated with all values
- [ ] Environment variables validated (no placeholder values)
- [ ] Cloud Run API service integrated (`src/services/cloudRunApi.ts`)
- [ ] Frontend built successfully
- [ ] Tested with mock data

**Verify build:**
```bash
npm run build
```

---

## Phase 8: Supabase Database (For Logging)

- [x] Supabase configured (already in .env)
- [ ] Predictions table created in Supabase:
  ```sql
  CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_description TEXT NOT NULL,
    is_fake BOOLEAN NOT NULL,
    confidence INTEGER NOT NULL,
    risk_level TEXT NOT NULL,
    red_flags TEXT[] NOT NULL,
    model_version TEXT,
    processing_time INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
  ```
- [ ] RLS policies created
- [ ] Test insert successful

---

## Phase 9: Integration Testing

- [ ] Frontend loads without errors
- [ ] Can paste job description
- [ ] Analyze button calls Cloud Run API
- [ ] Receives prediction response
- [ ] Displays results correctly
- [ ] Confidence score accurate
- [ ] Red flags display properly
- [ ] Data logs to Supabase

**Test steps:**
1. Open frontend in browser
2. Load sample job description
3. Click "Analyze Job Posting"
4. Verify prediction appears within 3 seconds
5. Check Supabase dashboard for logged data

---

## Phase 10: Deployment

- [ ] Frontend built and tested
- [ ] Cloud Run backend stable and tested
- [ ] Vertex AI model performing well
- [ ] BigQuery logging working
- [ ] Firebase Hosting configured
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Monitoring alerts set up

**Deploy frontend:**
```bash
npm run build
firebase deploy
```

---

## Monitoring Setup

- [ ] Cloud Run logs accessible: `gcloud logging read ...`
- [ ] BigQuery job monitoring enabled
- [ ] Vertex AI prediction metrics visible
- [ ] Error alerts configured
- [ ] Performance metrics tracked

---

## Security Checklist

- [ ] API keys not committed to git
- [ ] Service account keys secured
- [ ] Cloud Run endpoint requires auth (if needed)
- [ ] BigQuery table has proper RLS
- [ ] Firebase security rules reviewed
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Rate limiting considered

---

## Credentials to Obtain from GCP Console

| Item | Location | Value |
|------|----------|-------|
| **Vertex AI Endpoint URL** | Vertex AI > Endpoints > Select endpoint | `https://...` |
| **Vertex AI Endpoint ID** | Same page, in the URL | `xxxxxxxx` |
| **Cloud Run Service URL** | Cloud Run > Services > fake-job-api | `https://fake-job-api-xxxxx.run.app` |
| **Firebase Project ID** | Firebase Console > Settings | `xxxxx` |
| **Firebase API Key** | Firebase Console > Settings | `AIzaXxxxxxxx` |

---

## Quick Reference Commands

```bash
# List all services
gcloud services list --enabled

# View Cloud Run service
gcloud run services describe fake-job-api --region us-central1

# Stream Cloud Run logs
gcloud run services log read fake-job-api --region us-central1 --limit 50

# List Vertex AI endpoints
gcloud ai endpoints list --region=us-central1

# Check BigQuery datasets
bq ls

# Test Cloud Run endpoint
curl -X POST YOUR_CLOUD_RUN_URL/predict \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": "Sample job description"}'
```

---

## Support Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud Console](https://console.cloud.google.com)

