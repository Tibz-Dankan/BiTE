#!/bin/bash
# Zero-downtime deployment script using Docker Swarm
# Usage: ./deploy.sh [new-image-tag]

set -e  # Exit on any error

NEW_IMAGE=$1
if [ -z "$NEW_IMAGE" ]; then
  echo "Error: New image tag not provided"
  echo "Usage: ./deploy.sh [new-image-tag]"
  exit 1
fi

echo "Deploying new image: $NEW_IMAGE"

# Check if Docker and Docker Compose are installed, if not install them
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    # Normally, you'd need to log out and back in for this to take effect
    # For this script, we'll use sudo for Docker commands
fi

# Create the project directory if it doesn't exist
mkdir -p ~/app
cd ~/app

# Copy .env file from the root directory to app directory
if [ -f ~/.env ]; then
    echo "Copying .env file from home directory to app directory..."
    cp ~/.env ./
elif [ -f ../.env ]; then
    echo "Using existing .env file in parent directory..."
    cp ../.env ./
else
    echo "ERROR: No .env file found in ~ or ~/app/ !"
    echo "Please create an .env file with your application's environment variables"
    exit 1
fi

BiTE_PROMETHEUS_SUBDOMAIN="prometheus.bitcoinhighschool.com"
BiTE_GRAFANA_SUBDOMAIN="grafana.bitcoinhighschool.com"
BiTE_TRAEFIK_SUBDOMAIN="traefik.bitcoinhighschool.com"
BiTE_BACKEND_SUBDOMAIN="api.bitcoinhighschool.com"

# Copy docker-compose.yaml file from the root directory to app directory
if [ -f ~/docker-compose.yaml ]; then
    echo "Copying docker-compose.yaml from home directory to app directory..."
    cp ~/docker-compose.yaml ./
elif [ -f ../docker-compose.yaml ]; then
    echo "Using existing docker-compose.yaml file in parent directory..."
    cp ../docker-compose.yaml ./
else
    echo "ERROR: No docker-compose.yaml file found in ~ or ~/app/ !"
    echo "Please create an docker-compose.yaml file with deployment configuration"
    exit 1
fi

# Initialize Docker Swarm if not already initialized
if ! docker info | grep -q "Swarm: active"; then
  echo "Initializing Docker Swarm..."
  docker swarm init --advertise-addr $(hostname -I | awk '{print $1}')
fi

echo "About to deploy stack with image: ${NEW_IMAGE}"

# Deploy or update the stack
if docker stack ls | grep -q "app-stack"; then
  echo "Updating existing stack..."
  docker stack deploy -c docker-compose.yaml app-stack --with-registry-auth
else
  echo "Deploying new stack..."
  docker stack deploy -c docker-compose.yaml app-stack --with-registry-auth
fi

# Wait for backend service to be running and available on port 5000
echo "Waiting for backend service to start and be available on port 5000..."

check_service() {
  echo "  Checking service existence..."
  if ! docker service ls | grep -q app-stack_bite-backend; then
    echo "  Service app-stack_bite-backend not found"
    return 1
  fi
  
  echo "  Checking service replicas..."
  if ! docker service ls | grep app-stack_bite-backend | grep -q "1/1"; then
    echo "  Service replicas not ready yet"
    return 1
  fi
  
  echo "  Checking port 5000..."
  if ! timeout 5 bash -c "</dev/tcp/localhost/5000" &>/dev/null; then
    echo "  Port 5000 not accessible"
    return 1
  fi

  echo "  Port 5000 is accessible"
  
  # echo "  Checking health endpoint..."
  # if ! curl -s -f -o /dev/null http://localhost:5000/health; then
  #   echo "  Health endpoint not responding"
  #   return 1
  # fi
  
  return 0
}

# Keep checking until service is running or timeout (200 seconds = 4 minutes)
MAX_ATTEMPTS=40
ATTEMPT=1
WAIT_TIME=5  # seconds between attempts

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  echo "Checking if backend service is running (attempt $ATTEMPT/$MAX_ATTEMPTS)..."
  
  if check_service; then
    echo "Backend service is now running and available on port 5000!"
    break
  fi
  
  # If this is the first few attempts, show more debugging info
  if [ $ATTEMPT -le 3 ] || [ $(($ATTEMPT % 10)) -eq 0 ]; then
    echo "Service status:"
    docker service ps app-stack_bite-backend --no-trunc
    echo "Recent logs:"
    docker service logs app-stack_bite-backend --tail 10
  fi
  
  ATTEMPT=$((ATTEMPT+1))
  
  if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "ERROR: Backend service failed to start within the allocated time."
    echo "Final service status:"
    docker service ps app-stack_bite-backend --no-trunc
    echo "Detailed container logs:"
    docker service logs app-stack_bite-backend --tail 100
    echo "Checking if .env file variables are being properly loaded..."
    echo "Number of variables in .env file: $(grep -v '^#' ./.env | grep -v '^$' | wc -l)"
    exit 1
  fi
  
  echo "Waiting for $WAIT_TIME seconds before next check..."
  sleep $WAIT_TIME
done

echo "Deployment successful!"
echo "Your backend application is now available at https://$BiTE_BACKEND_SUBDOMAIN"
echo "Grafana dashboard is available at https://$BiTE_GRAFANA_SUBDOMAIN"
echo "Prometheus dashboard is available at https://$BiTE_PROMETHEUS_SUBDOMAIN"
echo "Traefik dashboard is available at https://$BiTE_TRAEFIK_SUBDOMAIN (username: admin, password: admin123)"

# TODO: To add check for every container in the stack
#  before switching to it and investigate traefik:v3.4
# To add clean and non-disruptive system cleans