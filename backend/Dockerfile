# Backend Dockerfile
FROM --platform=${TARGETPLATFORM} node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]

