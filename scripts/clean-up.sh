#!/bin/bash

# Docker cleanup script
# This script removes unused Docker data including:
# - stopped containers
# - networks not used by at least one container
# - dangling images
# - dangling build cache

echo "Starting Docker cleanup..."
docker system prune --force
echo "Docker cleanup completed!"