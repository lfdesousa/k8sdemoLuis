#!/bin/bash
# build-and-push.sh

# Set your Docker Hub username
DOCKER_USERNAME="lfds"

# Backend build and push
echo "Building and pushing backend..."
docker buildx create --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ${DOCKER_USERNAME}/jom-backend:latest \
  --push \
  ./backend

# Frontend build and push
echo "Building and pushing frontend..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ${DOCKER_USERNAME}/jom-frontend:latest \
  --push \
  ./frontend

echo "Build and push complete!"
