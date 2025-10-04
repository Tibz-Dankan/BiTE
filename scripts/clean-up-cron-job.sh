#!/bin/bash

# set-cron-job.sh
# Sets up hourly Docker cleanup cron job

echo "Setting up Docker cleanup cron job..."

# Make cleanup script executable and move to system location
chmod +x ~/clean-up.sh
sudo mv ~/clean-up.sh /usr/local/bin/

# Create log directory if it doesn't exist
sudo mkdir -p /var/log

# Check if cron/cronie is installed
if ! command -v crontab &> /dev/null; then
  echo "crontab not found. Installing cron..."
  # Try different package managers
  if command -v apt-get &> /dev/null; then
    sudo apt-get update && sudo apt-get install -y cron
    sudo systemctl enable cron
    sudo systemctl start cron
  elif command -v yum &> /dev/null; then
    sudo yum install -y cronie
    sudo systemctl enable crond
    sudo systemctl start crond
  elif command -v apk &> /dev/null; then
    sudo apk add --no-cache dcron
    sudo rc-update add dcron
    sudo rc-service dcron start
  else
    echo "ERROR: Could not install cron - package manager not found"
    exit 1
  fi
fi

# Check if cron job already exists, if not add it
if ! crontab -l 2>/dev/null | grep -q "clean-up.sh"; then
  echo "Setting up hourly Docker cleanup cron job..."
  (crontab -l 2>/dev/null; echo "0 * * * * /usr/local/bin/clean-up.sh >> /var/log/docker-cleanup.log 2>&1") | crontab -
  echo "Cron job added successfully!"
else
  echo "Docker cleanup cron job already exists"
fi

# Verify cron service is running (handle different service names)
if systemctl list-units --type=service | grep -q "cron.service"; then
  sudo systemctl status cron --no-pager
elif systemctl list-units --type=service | grep -q "crond.service"; then
  sudo systemctl status crond --no-pager
else
  echo "Cron service check skipped - service manager may differ"
fi

echo "Cron job setup completed!"