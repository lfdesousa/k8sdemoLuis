#!/bin/bash
# deploy.sh

# Apply backend deployment and service
sudo kubectl apply -f backend-deployment.yaml

# Wait for backend to be ready
sudo kubectl rollout status deployment/jom-backend

# Apply frontend deployment and service
sudo kubectl apply -f frontend-deployment.yaml

# Wait for frontend to be ready
sudo kubectl rollout status deployment/jom-frontend

# Apply ingress
sudo kubectl apply -f ingress.yaml

echo "Deployment complete"

