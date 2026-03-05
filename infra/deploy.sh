#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${GOOGLE_CLOUD_PROJECT:-}" ]]; then
  echo "GOOGLE_CLOUD_PROJECT is required."
  exit 1
fi

if [[ -z "${GCS_BUCKET:-}" ]]; then
  echo "GCS_BUCKET is required."
  exit 1
fi

GOOGLE_CLOUD_REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
FIRESTORE_COLLECTION="${FIRESTORE_COLLECTION:-sessions}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-1.5-pro}"
ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-http://localhost:3000}"
SERVICE_NAME="${SERVICE_NAME:-weavedirector-backend}"
IMAGE="gcr.io/${GOOGLE_CLOUD_PROJECT}/${SERVICE_NAME}:$(date +%Y%m%d-%H%M%S)"

echo "Setting gcloud project..."
gcloud config set project "${GOOGLE_CLOUD_PROJECT}"

echo "Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com

echo "Building image with Cloud Build..."
gcloud builds submit backend --tag "${IMAGE}"

ENV_VARS="GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT},GOOGLE_CLOUD_REGION=${GOOGLE_CLOUD_REGION},FIRESTORE_COLLECTION=${FIRESTORE_COLLECTION},GCS_BUCKET=${GCS_BUCKET},GEMINI_MODEL=${GEMINI_MODEL},ALLOWED_ORIGINS=${ALLOWED_ORIGINS}"

DEPLOY_ARGS=(
  run deploy "${SERVICE_NAME}"
  --image "${IMAGE}"
  --platform managed
  --region "${GOOGLE_CLOUD_REGION}"
  --allow-unauthenticated
  --set-env-vars "${ENV_VARS}"
)

if [[ -n "${SERVICE_ACCOUNT_EMAIL:-}" ]]; then
  DEPLOY_ARGS+=(--service-account "${SERVICE_ACCOUNT_EMAIL}")
fi

echo "Deploying Cloud Run service..."
gcloud "${DEPLOY_ARGS[@]}"

echo "Deployment complete."
gcloud run services describe "${SERVICE_NAME}" \
  --platform managed \
  --region "${GOOGLE_CLOUD_REGION}" \
  --format='value(status.url)'
