# Docker Deployment Guide for IndiaBorn

## Prerequisites
- Docker Desktop installed
- Docker Compose installed (included with Docker Desktop)

---

## Quick Start (All Services with Docker Compose)

### 1. Build and Start All Services
```bash
docker-compose up --build
```

This will start:
- **MongoDB** on `localhost:27017`
- **Backend API** on `http://localhost:5184`
- **Frontend** on `http://localhost:3000`

### 2. Stop All Services
```bash
docker-compose down
```

### 3. Stop and Remove Volumes (Clean slate)
```bash
docker-compose down -v
```

---

## Individual Service Deployment

### Backend Only

**Build:**
```bash
cd Indiaborn.Api
docker build -t indiaborn-backend .
```

**Run:**
```bash
docker run -d \
  -p 5184:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e Mongo__ConnectionString=mongodb+srv://user:pass@cluster.mongodb.net/ \
  -e Mongo__DatabaseName=IndiabornDb \
  --name indiaborn-backend \
  indiaborn-backend
```

### Frontend Only

**Build:**
```bash
cd frontend
docker build -t indiaborn-frontend .
```

**Run:**
```bash
docker run -d \
  -p 3000:80 \
  --name indiaborn-frontend \
  indiaborn-frontend
```

---

## Using MongoDB Atlas (Cloud Database)

Update `docker-compose.yml` backend environment:

```yaml
environment:
  - Mongo__ConnectionString=mongodb+srv://rahulshindejira_db_user:sPV9dXaOjdyho5Zu@indiaborn.nia0rf5.mongodb.net/
  - Mongo__DatabaseName=IndiabornDb
```

Then remove the mongodb service from docker-compose.yml and run:
```bash
docker-compose up --build backend frontend
```

---

## Production Deployment with Docker

### Option 1: Docker Hub

**1. Tag and Push Images:**
```bash
# Backend
docker tag indiaborn-backend yourusername/indiaborn-backend:latest
docker push yourusername/indiaborn-backend:latest

# Frontend
docker tag indiaborn-frontend yourusername/indiaborn-frontend:latest
docker push yourusername/indiaborn-frontend:latest
```

**2. Pull and Run on Server:**
```bash
docker pull yourusername/indiaborn-backend:latest
docker pull yourusername/indiaborn-frontend:latest
docker-compose up -d
```

### Option 2: Render.com with Docker

Create `render.yaml` in root:
```yaml
services:
  - type: web
    name: indiaborn-api
    env: docker
    dockerfilePath: ./Indiaborn.Api/Dockerfile
    dockerContext: ./Indiaborn.Api
    envVars:
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
      - key: Mongo__ConnectionString
        value: your-mongodb-atlas-connection-string
```

---

## Useful Docker Commands

### View Running Containers
```bash
docker ps
```

### View All Containers (including stopped)
```bash
docker ps -a
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild After Code Changes
```bash
docker-compose up --build
```

### Access Container Shell
```bash
# Backend
docker exec -it indiaborn-backend sh

# Frontend
docker exec -it indiaborn-frontend sh

# MongoDB
docker exec -it indiaborn-mongodb mongosh
```

### Remove Everything (Clean slate)
```bash
docker-compose down -v --rmi all
```

---

## Environment Variables

### Backend (.env file)
```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
Mongo__ConnectionString=mongodb://admin:password123@mongodb:27017
Mongo__DatabaseName=IndiabornDb
Jwt__Issuer=IndiaBornAPI
Jwt__Audience=IndiaBornClient
Jwt__SigningKey=your-secret-key-here
```

### Frontend (.env file)
```env
VITE_API_URL=http://localhost:5184
```

For production, change to your deployed backend URL.

---

## Troubleshooting

### Backend can't connect to MongoDB
- Check MongoDB is running: `docker ps | grep mongodb`
- Verify connection string in environment variables
- Check network: `docker network ls`

### Frontend can't connect to Backend
- Ensure VITE_API_URL points to correct backend URL
- Check CORS settings in backend Program.cs
- Verify backend is running: `curl http://localhost:5184/api/products`

### Port already in use
```bash
# Find process using port
netstat -ano | findstr :5184
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <process_id> /F
```

### Image upload not working
- Check volume mount: `docker inspect indiaborn-backend`
- Verify directory exists: `docker exec indiaborn-backend ls -la /app/wwwroot/assets/products`

---

## Performance Tips

### Multi-platform Build
```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t indiaborn-backend .
```

### Optimize Build Cache
- `.dockerignore` files are already configured
- Use `--no-cache` flag to force fresh build if needed

### Health Checks
Add to docker-compose.yml:
```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/products"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Security Considerations

1. **Never commit** `.env` files with real credentials
2. **Use secrets** management in production (Docker Secrets, Azure Key Vault, etc.)
3. **Update** base images regularly: `docker pull mcr.microsoft.com/dotnet/aspnet:9.0`
4. **Scan** images for vulnerabilities: `docker scan indiaborn-backend`
5. **Use** non-root users in Dockerfile (already configured)

---

## Production Checklist

- [ ] Update MongoDB connection string
- [ ] Change JWT secret key
- [ ] Update CORS origins
- [ ] Configure HTTPS certificates
- [ ] Set up monitoring and logging
- [ ] Configure backups for MongoDB
- [ ] Use environment-specific configs
- [ ] Enable health checks
- [ ] Set resource limits in docker-compose.yml

---

## Support

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- .NET on Docker: https://docs.microsoft.com/en-us/dotnet/core/docker/

---

**Happy Dockerizing! 🐳**
