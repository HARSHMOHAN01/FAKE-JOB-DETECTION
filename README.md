# Fake Job Detection - AI-Powered Fraud Detection System

Team: **Byte Brigadier** | HackSprint 2024 | Roorkee Institute of Technology

## Overview

A cloud-native machine learning system that analyzes job postings and classifies them as real or fake using advanced NLP and text classification. The system is built on Google Cloud Platform using Vertex AI for ML predictions, Cloud Run for API serving, BigQuery for analytics, and Firebase Hosting for the user interface.

## Architecture

```
User Browser
    ↓
Firebase Hosting (Frontend - React)
    ↓
Cloud Run (Backend API - Flask)
    ↓
Vertex AI (ML Model)
    ↓
Prediction Result
    ↓
BigQuery & Supabase (Analytics/Logging)
```

## Project Details

- **Google Cloud Project**: `fake-job-detection-481906`
- **Project Number**: `781226369708`
- **Region**: `us-central1`

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Google Cloud SDK
- Firebase CLI

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update `.env` with your GCP credentials (see CREDENTIALS.template.md)

### 3. Development
```bash
npm run dev
```

### 4. Build
```bash
npm run build
```

### 5. Deploy Backend
```bash
chmod +x deploy.sh
./deploy.sh <YOUR_VERTEX_AI_ENDPOINT_ID>
```

### 6. Deploy Frontend
```bash
firebase deploy
```

## Key Features

### Frontend
- Clean, modern UI for job analysis
- Real-time prediction display
- Confidence scores and risk levels
- Red flag detection
- Responsive design
- Loading states and animations

### Backend
- REST API with Flask
- Vertex AI ML integration
- BigQuery logging
- CORS-enabled for frontend
- Production-ready with gunicorn

### ML Model
- Text classification for fake job detection
- Analyzes linguistic patterns
- Confidence scoring
- Red flag identification

## Documentation

Start here for setup:
1. **SETUP_COMPLETE.md** - Overview and quick start
2. **GCP_CHECKLIST.md** - Step-by-step checklist
3. **GOOGLE_CLOUD_SETUP.md** - Detailed GCP guide
4. **CREDENTIALS.template.md** - Credentials management
5. **INTEGRATION_SUMMARY.md** - Architecture overview

## File Structure

```
.
├── src/                          # Frontend React app
│   ├── App.tsx                  # Main component
│   ├── components/              # React components
│   │   ├── JobInputForm.tsx
│   │   └── PredictionResult.tsx
│   └── services/                # API integration
│       ├── cloudRunApi.ts
│       └── mockApi.ts
├── cloud-run-backend/           # Backend Flask app
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── .env                         # Environment variables
├── deploy.sh                    # Deployment script
└── Documentation files
```

## API Endpoints

### Cloud Run API

**Health Check**
```bash
GET /health
```

**Predict Endpoint**
```bash
POST /predict
Content-Type: application/json

{
  "jobDescription": "Job posting text here..."
}

Response:
{
  "isFake": boolean,
  "confidence": number (0-100),
  "riskLevel": "low|medium|high",
  "redFlags": [string],
  "modelVersion": string,
  "processingTime": number (ms)
}
```

## Environment Variables

```env
# GCP Configuration
VITE_GCP_PROJECT_ID=fake-job-detection-481906
VITE_GCP_PROJECT_NUMBER=781226369708

# Vertex AI
VITE_VERTEX_AI_ENDPOINT=https://...

# Cloud Run
VITE_CLOUD_RUN_ENDPOINT=https://fake-job-api-xxxxx.run.app

# Firebase (Optional)
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_API_KEY=...

# Supabase (Already configured)
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Vite

### Backend
- Python 3.11
- Flask
- Google Cloud AI Platform
- BigQuery
- Gunicorn

### Infrastructure
- Google Cloud Platform
  - Vertex AI (ML Model)
  - Cloud Run (API Server)
  - BigQuery (Data Analytics)
  - Cloud Storage
  - Container Registry
- Firebase Hosting (Frontend)
- Supabase (Data Logging)

## Deployment

### Deploy Backend
```bash
./deploy.sh <ENDPOINT_ID>
```

This script:
1. Builds Docker image
2. Pushes to Container Registry
3. Deploys to Cloud Run
4. Updates .env automatically

### Deploy Frontend
```bash
npm run build
firebase deploy
```

## Monitoring

### View Cloud Run Logs
```bash
gcloud run services log read fake-job-api --region=us-central1 --limit=50
```

### Query BigQuery Analytics
```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as predictions,
  SUM(CASE WHEN is_fake THEN 1 ELSE 0 END) as fake_count,
  AVG(confidence) as avg_confidence
FROM `fake-job-detection-481906.fake_job_detection_ds.predictions`
GROUP BY date
ORDER BY date DESC
```

## Troubleshooting

### Frontend won't connect to API
- Check Cloud Run URL in .env
- Verify service is publicly accessible
- Check CORS headers in backend

### Vertex AI endpoint errors
- Verify endpoint ID is correct
- Check endpoint is in same region
- Ensure service account has proper permissions

### BigQuery not logging
- Verify dataset and table exist
- Check service account has bigquery.dataEditor role
- Verify table schema matches data

See GOOGLE_CLOUD_SETUP.md for detailed troubleshooting.

## Performance

- **Frontend Load**: < 2 seconds
- **API Response**: 2-5 seconds (with ML inference)
- **Confidence Score**: 85%+ accuracy with trained model
- **Scalability**: Auto-scales with Cloud Run

## Security

- CORS enabled only from trusted origins
- Input validation and sanitization
- Service account least-privilege access
- HTTPS only
- API authentication ready (optional)

## Future Enhancements

- [ ] User authentication
- [ ] Prediction history tracking
- [ ] Model retraining pipeline
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Browser extension

## Links

- **GitHub Repository**: https://github.com/HARSHMOHAN01/FakeJob-Detection.git
- **Demo Video**: https://drive.google.com/file/d/1G723_2AjATTyPeNnMQ8w4x9J0v08XcY/view
- **Google Cloud Console**: https://console.cloud.google.com/project/fake-job-detection-481906
- **Firebase Console**: https://console.firebase.google.com

## Team

- **Team Name**: Byte Brigadier
- **Team Lead**: Harsh Mohan
- **Project**: Fake Job Detection
- **Hackathon**: HackSprint 2024
- **Institution**: Roorkee Institute of Technology

## Support

For setup and configuration issues:
1. Check SETUP_COMPLETE.md
2. Review GCP_CHECKLIST.md
3. Consult GOOGLE_CLOUD_SETUP.md
4. Check troubleshooting sections

## License

This project is part of HackSprint 2024 at Roorkee Institute of Technology.

---

**Status**: Production Ready | Last Updated: December 23, 2025

