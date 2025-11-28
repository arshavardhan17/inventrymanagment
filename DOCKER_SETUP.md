# Docker Setup Guide - Inventory Manager

This guide explains how to build, run, and deploy the Inventory Manager application using Docker.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)
- Docker Hub account (for pushing images)

## Local Development with Docker Compose

### 1. Build and Run All Services

```bash
docker-compose up --build
```

This command will:

- Build the backend image
- Build the frontend image
- Start PostgreSQL database
- Start the backend API
- Start the frontend application

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8083
- **API Documentation**: http://localhost:8083/swagger-ui.html
- **PostgreSQL**: localhost:5432

### 3. Database Credentials

- **Username**: postgres
- **Password**: arsha@2005
- **Database**: inventorydb

### 4. Stop Services

```bash
docker-compose down
```

To also remove volumes:

```bash
docker-compose down -v
```

## Building Individual Images

### Build Backend Image

```bash
docker build -f Dockerfile.backend -t arshavardhan/inventory-manager-backend:latest .
```

### Build Frontend Image

```bash
docker build -f Dockerfile.frontend -t arshavardhan/inventory-manager-frontend:latest .
```

## Pushing Images to Docker Hub

### 1. Set Up Docker Hub Credentials

```bash
docker login
```

### 2. Tag Images

```bash
docker tag arshavardhan/inventory-manager-backend:latest arshavardhan/inventory-manager-backend:latest
docker tag arshavardhan/inventory-manager-frontend:latest arshavardhan/inventory-manager-frontend:latest
```

### 3. Push Images

```bash
docker push arshavardhan/inventory-manager-backend:latest
docker push arshavardhan/inventory-manager-frontend:latest
```

## GitHub Actions Automation

The `.github/workflows/docker-push.yml` workflow automatically:

1. Triggers on push to the `main` branch
2. Builds both backend and frontend images
3. Pushes images to Docker Hub with tags:
   - `latest` - Latest version
   - `main-<sha>` - Commit SHA
   - Branch name tag

### Required GitHub Secrets

Add these secrets to your GitHub repository settings:

- **DOCKER_USERNAME**: Your Docker Hub username (arshavardhan)
- **DOCKER_PASSWORD**: Your Docker Hub password or personal access token

### Setting Up Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add:
   - Name: `DOCKER_USERNAME`, Value: `arshavardhan`
   - Name: `DOCKER_PASSWORD`, Value: `<your-docker-hub-token>`

## Environment Variables

### Backend Environment Variables

- `SPRING_DATASOURCE_URL`: PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SERVER_PORT`: Backend server port (default: 8083)

### Frontend Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: http://backend:8083)

## Docker Image Details

### Backend Image

- **Base Image**: eclipse-temurin:21-jre-alpine
- **Port**: 8083
- **Health Check**: Enabled
- **Size**: ~500MB (optimized multi-stage build)

### Frontend Image

- **Base Image**: node:18-alpine
- **Port**: 3000
- **Health Check**: Enabled
- **Size**: ~200MB (optimized multi-stage build)

## Troubleshooting

### Backend fails to connect to database

Ensure PostgreSQL is running and healthy:

```bash
docker-compose ps
```

Check logs:

```bash
docker-compose logs backend
```

### Frontend cannot reach backend

Verify the `REACT_APP_API_URL` environment variable is set correctly in docker-compose.yml

### Port already in use

Change the port mapping in docker-compose.yml:

```yaml
ports:
  - "8084:8083" # Maps host port 8084 to container port 8083
```

## Production Deployment

For production, consider:

1. Using environment-specific docker-compose files
2. Setting up proper secrets management
3. Using a container orchestration platform (Kubernetes, Docker Swarm)
4. Implementing proper logging and monitoring
5. Using a reverse proxy (Nginx, Traefik)
6. Setting resource limits in docker-compose.yml

Example resource limits:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 1G
        reservations:
          cpus: "0.5"
          memory: 512M
```
