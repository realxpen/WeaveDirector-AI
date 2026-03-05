# WeaveDirector

WeaveDirector includes:
- A Next.js frontend (`/`)
- A FastAPI backend (`/backend`) for Gemini-powered campaign generation, SSE streaming, Firestore sessions, and GCS assets

## Environment

Copy `.env.example` into your runtime environment and set values:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_REGION=us-central1
FIRESTORE_COLLECTION=sessions
GCS_BUCKET=your-gcs-bucket
GEMINI_MODEL=gemini-1.5-pro
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

## Run Frontend Locally

```bash
npm install
npm run dev
```

## Run Backend Locally

```bash
python -m venv .venv
# Windows PowerShell:
. .venv/Scripts/Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r backend/requirements.txt
cd backend
uvicorn main:app --reload --port 8080
```

Open Swagger at `http://localhost:8080/docs`.

## Cloud Run Deployment

Use the deployment script:

```bash
chmod +x infra/deploy.sh
./infra/deploy.sh
```

Required environment variables for deployment:
- `GOOGLE_CLOUD_PROJECT`
- `GCS_BUCKET`

Optional:
- `GOOGLE_CLOUD_REGION` (default `us-central1`)
- `FIRESTORE_COLLECTION` (default `sessions`)
- `GEMINI_MODEL` (default `gemini-1.5-pro`)
- `ALLOWED_ORIGINS`
- `SERVICE_NAME` (default `weavedirector-backend`)
- `SERVICE_ACCOUNT_EMAIL` (if you want explicit Cloud Run identity)

`infra/deploy.sh` enables required APIs, builds with Cloud Build, and deploys to Cloud Run.

## Backend API

- `POST /api/generate` -> creates session and returns stream URL
- `GET /api/stream/{sessionId}` -> SSE generation stream
- `POST /api/regenerate` -> section-specific regeneration
- `GET /api/sessions` -> latest sessions summary
- `GET /api/sessions/{sessionId}` -> full session detail
- `GET /health` -> health check
