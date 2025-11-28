#!/bin/bash

# Kubernetes Deployment Script for Inventory Manager
# This script deploys the entire application stack to a local Kubernetes cluster

set -elly now. The application is running. Let me wait a bit and check the pod status again:

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="inventory-manager"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    log_success "kubectl found"
}

check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Kubernetes cluster is not running or not accessible."
        exit 1
    fi
    log_success "Kubernetes cluster is accessible"
}

create_namespace() {
    log_info "Creating namespace: $NAMESPACE"
    kubectl apply -f "$SCRIPT_DIR/namespace.yaml"
    log_success "Namespace created"
}

deploy_postgres() {
    log_info "Deploying PostgreSQL..."
    kubectl apply -f "$SCRIPT_DIR/postgres-configmap.yaml"
    kubectl apply -f "$SCRIPT_DIR/postgres-secret.yaml"
    kubectl apply -f "$SCRIPT_DIR/postgres-pvc.yaml"
    kubectl apply -f "$SCRIPT_DIR/postgres-deployment.yaml"
    
    log_info "Waiting for PostgreSQL to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s
    log_success "PostgreSQL deployed and ready"
}

deploy_backend() {
    log_info "Deploying Backend..."
    kubectl apply -f "$SCRIPT_DIR/backend-configmap.yaml"
    kubectl apply -f "$SCRIPT_DIR/backend-secret.yaml"
    kubectl apply -f "$SCRIPT_DIR/backend-deployment.yaml"
    
    log_info "Waiting for Backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s
    log_success "Backend deployed and ready"
}

deploy_frontend() {
    log_info "Deploying Frontend..."
    kubectl apply -f "$SCRIPT_DIR/frontend-deployment.yaml"
    
    log_info "Waiting for Frontend to be ready..."
    kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s
    log_success "Frontend deployed and ready"
}

deploy_ingress() {
    log_info "Deploying Ingress..."
    kubectl apply -f "$SCRIPT_DIR/ingress.yaml"
    log_success "Ingress deployed"
}

show_access_info() {
    log_info "Getting service information..."
    echo ""
    echo -e "${BLUE}========== ACCESS INFORMATION ==========${NC}"
    echo ""
    
    # Get Frontend Service
    FRONTEND_IP=$(kubectl get svc frontend -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
    FRONTEND_PORT=$(kubectl get svc frontend -n $NAMESPACE -o jsonpath='{.spec.ports[0].port}' 2>/dev/null)
    
    if [ "$FRONTEND_IP" = "pending" ]; then
        FRONTEND_PORT=$(kubectl get svc frontend -n $NAMESPACE -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null)
        log_warning "Frontend LoadBalancer IP is pending. Using NodePort: $FRONTEND_PORT"
        echo -e "${YELLOW}Frontend URL: http://<node-ip>:$FRONTEND_PORT${NC}"
    else
        echo -e "${GREEN}Frontend URL: http://$FRONTEND_IP:$FRONTEND_PORT${NC}"
    fi
    
    # Get Backend Service
    BACKEND_IP=$(kubectl get svc backend -n $NAMESPACE -o jsonpath='{.spec.clusterIP}' 2>/dev/null)
    BACKEND_PORT=$(kubectl get svc backend -n $NAMESPACE -o jsonpath='{.spec.ports[0].port}' 2>/dev/null)
    echo -e "${GREEN}Backend URL (internal): http://$BACKEND_IP:$BACKEND_PORT${NC}"
    
    # Get PostgreSQL Service
    POSTGRES_IP=$(kubectl get svc postgres -n $NAMESPACE -o jsonpath='{.spec.clusterIP}' 2>/dev/null)
    POSTGRES_PORT=$(kubectl get svc postgres -n $NAMESPACE -o jsonpath='{.spec.ports[0].port}' 2>/dev/null)
    echo -e "${GREEN}PostgreSQL (internal): $POSTGRES_IP:$POSTGRES_PORT${NC}"
    
    echo ""
    echo -e "${BLUE}========== USEFUL COMMANDS ==========${NC}"
    echo ""
    echo "View pods:"
    echo "  kubectl get pods -n $NAMESPACE"
    echo ""
    echo "View logs:"
    echo "  kubectl logs -f deployment/backend -n $NAMESPACE"
    echo "  kubectl logs -f deployment/frontend -n $NAMESPACE"
    echo "  kubectl logs -f deployment/postgres -n $NAMESPACE"
    echo ""
    echo "Port forward to access services locally:"
    echo "  kubectl port-forward svc/frontend 3000:80 -n $NAMESPACE"
    echo "  kubectl port-forward svc/backend 8083:8083 -n $NAMESPACE"
    echo "  kubectl port-forward svc/postgres 5432:5432 -n $NAMESPACE"
    echo ""
    echo "Delete deployment:"
    echo "  kubectl delete namespace $NAMESPACE"
    echo ""
}

main() {
    log_info "Starting Inventory Manager Kubernetes Deployment"
    echo ""
    
    check_kubectl
    check_cluster
    
    create_namespace
    deploy_postgres
    deploy_backend
    deploy_frontend
    deploy_ingress
    
    show_access_info
    
    log_success "Deployment completed successfully!"
}

# Run main function
main
