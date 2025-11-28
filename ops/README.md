# Kubernetes Deployment Guide

# Make scripts executable (already done)

chmod +x ops/deploy.sh ops/delete.sh

# Deploy everything

./ops/deploy.sh

# Access via port forwarding

kubectl port-forward svc/frontend 3000:80 -n inventory-manager
kubectl port-forward svc/backend 8083:8083 -n inventory-manager

This directory contains Kubernetes manifests and deployment scripts for the Inventory Manager application.

## Prerequisites

- Kubernetes cluster (local or remote)
- `kubectl` CLI installed and configured
- Docker images pushed to Docker Hub:
  - `arshavardhan/inventory-manager-backend:latest`
  - `arshavardhan/inventory-manager-frontend:latest`

### Local Kubernetes Setup Options

#### Option 1: Docker Desktop (Recommended for beginners)

```bash
# Enable Kubernetes in Docker Desktop settings
# Settings → Kubernetes → Enable Kubernetes
```

#### Option 2: Minikube

```bash
# Install Minikube
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube
minikube start

# Enable metrics-server for HPA
minikube addons enable metrics-server
```

#### Option 3: Kind (Kubernetes in Docker)

```bash
# Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster
kind create cluster --name inventory-manager
```

## File Structure

```
ops/
├── namespace.yaml              # Kubernetes namespace
├── postgres-configmap.yaml     # PostgreSQL configuration
├── postgres-secret.yaml        # PostgreSQL credentials (password)
├── postgres-pvc.yaml           # PostgreSQL persistent volume
├── postgres-deployment.yaml    # PostgreSQL deployment & service
├── backend-configmap.yaml      # Backend configuration
├── backend-secret.yaml         # Backend secrets (DB password)
├── backend-deployment.yaml     # Backend deployment, service & HPA
├── frontend-deployment.yaml    # Frontend deployment, service & HPA
├── ingress.yaml                # Ingress configuration
├── deploy.sh                   # Automated deployment script
├── delete.sh                   # Cleanup script
└── README.md                   # This file
```

## Quick Start

### 1. Make scripts executable

```bash
chmod +x ops/deploy.sh ops/delete.sh
```

### 2. Deploy the application

```bash
./ops/deploy.sh
```

The script will:

- Create the `inventory-manager` namespace
- Deploy PostgreSQL with persistent storage
- Deploy Backend API with 2 replicas and HPA
- Deploy Frontend with 2 replicas and HPA
- Create services and ingress
- Display access information

### 3. Access the application

After deployment, the script shows access URLs. For local development:

```bash
# Port forward to frontend
kubectl port-forward svc/frontend 3000:80 -n inventory-manager

# Port forward to backend
kubectl port-forward svc/backend 8083:8083 -n inventory-manager

# Port forward to database
kubectl port-forward svc/postgres 5432:5432 -n inventory-manager
```

Then access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8083
- API Docs: http://localhost:8083/swagger-ui.html
- Database: localhost:5432

## Manual Deployment

If you prefer to deploy step by step:

```bash
# Create namespace
kubectl apply -f ops/namespace.yaml

# Deploy PostgreSQL
kubectl apply -f ops/postgres-configmap.yaml
kubectl apply -f ops/postgres-secret.yaml
kubectl apply -f ops/postgres-pvc.yaml
kubectl apply -f ops/postgres-deployment.yaml

# Deploy Backend
kubectl apply -f ops/backend-configmap.yaml
kubectl apply -f ops/backend-secret.yaml
kubectl apply -f ops/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f ops/frontend-deployment.yaml

# Deploy Ingress
kubectl apply -f ops/ingress.yaml
```

## Useful Commands

### View Resources

```bash
# List all pods
kubectl get pods -n inventory-manager

# List all services
kubectl get svc -n inventory-manager

# List all deployments
kubectl get deployments -n inventory-manager

# View detailed pod information
kubectl describe pod <pod-name> -n inventory-manager
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n inventory-manager

# Frontend logs
kubectl logs -f deployment/frontend -n inventory-manager

# PostgreSQL logs
kubectl logs -f deployment/postgres -n inventory-manager

# Logs from specific pod
kubectl logs -f <pod-name> -n inventory-manager
```

### Execute Commands in Pods

```bash
# Connect to backend pod
kubectl exec -it <backend-pod-name> -n inventory-manager -- /bin/bash

# Connect to database
kubectl exec -it <postgres-pod-name> -n inventory-manager -- psql -U postgres -d inventorydb
```

### Scaling

```bash
# Manually scale backend
kubectl scale deployment backend --replicas=3 -n inventory-manager

# Manually scale frontend
kubectl scale deployment frontend --replicas=3 -n inventory-manager
```

### Update Deployment

```bash
# Update image
kubectl set image deployment/backend backend=arshavardhan/inventory-manager-backend:v1.0.0 -n inventory-manager

# Rollout status
kubectl rollout status deployment/backend -n inventory-manager

# Rollback to previous version
kubectl rollout undo deployment/backend -n inventory-manager
```

## Configuration

### Environment Variables

#### Backend (backend-configmap.yaml)

- `SPRING_DATASOURCE_URL`: PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Hibernate DDL mode (update/create/validate)
- `SERVER_PORT`: Backend server port

#### Frontend (frontend-deployment.yaml)

- `REACT_APP_API_URL`: Backend API URL

### Secrets

Sensitive data is stored in Kubernetes Secrets:

- `postgres-secret.yaml`: Database password
- `backend-secret.yaml`: Database password for backend

**Important**: In production, use proper secret management solutions like:

- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault
- Sealed Secrets

## Persistence

PostgreSQL data is persisted using a PersistentVolumeClaim (PVC). The data survives pod restarts but will be lost if the PVC is deleted.

For local development:

- Minikube: Data stored in Minikube VM
- Docker Desktop: Data stored in Docker volume
- Kind: Data stored in Kind container

## Auto-scaling

Both Backend and Frontend deployments have Horizontal Pod Autoscalers (HPA) configured:

- **Min replicas**: 2
- **Max replicas**: 5
- **CPU threshold**: 70%
- **Memory threshold**: 80%

For HPA to work, metrics-server must be installed:

```bash
# For Minikube
minikube addons enable metrics-server

# For other clusters
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## Cleanup

To remove all resources:

```bash
./ops/delete.sh
```

Or manually:

```bash
kubectl delete namespace inventory-manager
```

## Troubleshooting

### Pods not starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n inventory-manager

# Check events
kubectl get events -n inventory-manager --sort-by='.lastTimestamp'
```

### Database connection issues

```bash
# Check if PostgreSQL pod is running
kubectl get pods -l app=postgres -n inventory-manager

# Check PostgreSQL logs
kubectl logs -f deployment/postgres -n inventory-manager

# Test database connectivity
kubectl exec -it <backend-pod> -n inventory-manager -- nc -zv postgres 5432
```

### Image pull errors

```bash
# Check if images exist on Docker Hub
docker pull arshavardhan/inventory-manager-backend:latest
docker pull arshavardhan/inventory-manager-frontend:latest

# Update image in deployment
kubectl set image deployment/backend backend=arshavardhan/inventory-manager-backend:latest -n inventory-manager --record
```

### Storage issues

```bash
# Check PVC status
kubectl get pvc -n inventory-manager

# Check PV status
kubectl get pv

# Describe PVC for details
kubectl describe pvc postgres-pvc -n inventory-manager
```

## Production Considerations

For production deployment, consider:

1. **Security**

   - Use RBAC (Role-Based Access Control)
   - Network policies
   - Pod security policies
   - Secret encryption at rest

2. **High Availability**

   - Multiple replicas for all services
   - Pod Disruption Budgets
   - Anti-affinity rules

3. **Monitoring & Logging**

   - Prometheus for metrics
   - ELK/Loki for logging
   - Grafana for visualization

4. **Backup & Recovery**

   - Regular database backups
   - Disaster recovery plan

5. **Resource Management**

   - Resource quotas
   - Limit ranges
   - Pod priority classes

6. **Networking**
   - Ingress controller (Nginx, Traefik)
   - TLS/SSL certificates
   - Service mesh (optional)

## Support

For issues or questions, refer to:

- Kubernetes Documentation: https://kubernetes.io/docs/
- Docker Hub: https://hub.docker.com/
- GitHub Issues: [Your repository]
