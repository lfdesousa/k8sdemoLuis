# Stage 1 - Build
FROM --platform=${TARGETPLATFORM} node:18-alpine AS builder
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy source
COPY . .
# Build application
RUN npm run build

# Stage 2 - Production
FROM --platform=${TARGETPLATFORM} nginx:alpine
# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
