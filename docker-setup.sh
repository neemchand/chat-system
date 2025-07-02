#!/bin/bash

echo "Chat System Docker Setup"
echo "========================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Create mongo-init directory for MongoDB initialization scripts
mkdir -p mongo-init

echo "Building and starting containers..."
echo "This may take a few minutes on first run..."

# Build and start containers
docker-compose up --build -d

echo ""
echo "Waiting for services to start..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "Chat System is running"
    echo ""
    echo "Chat Application: http://localhost:5000"
    echo "MongoDB Admin:    http://localhost:8081 (admin/admin123)"
    echo ""
    echo "Commands:"
    echo "  docker-compose logs -f chat-app"
    echo "  docker-compose down"
    echo "  docker-compose restart"
    echo "  docker-compose ps"
    echo ""
else
    echo "Error: Some containers failed to start"
    echo "Check logs: docker-compose logs"
fi
