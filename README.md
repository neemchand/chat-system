# Chat System

Real-time chat application built with Node.js, Socket.IO, and MongoDB.

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Run with in-memory storage
npm start

# Run with MongoDB
npm run start:mongodb
```

### Docker Setup
**Prerequisites:** Docker, Docker Compose

```bash
# Automated setup
./docker-setup.sh

# Or manual setup
docker-compose up --build -d
```

## Services

- **Chat App:** http://localhost:5000
- **MongoDB Admin:** http://localhost:8081 (admin/admin123)

## Commands

```bash
# Basic operations
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose restart        # Restart
docker-compose logs -f        # View logs

# Development
docker-compose up --build -d  # Rebuild
docker exec -it chat-system /bin/sh  # Shell access
```

## Configuration

Copy and customize environment variables:
```bash
cp .env.example .env
```

Key variables:
- `PORT`: Application port (default: 5000)
- `DB_HOST`: MongoDB hostname (default: mongodb)
- `DB_NAME`: Database name (default: chatdb)

## Troubleshooting

```bash
# Reset everything
docker-compose down -v
docker system prune -f
./docker-setup.sh

# Check logs
docker-compose logs -f chat-app

# Check database
docker exec chat-system node check-database.js
```
