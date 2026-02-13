# Docker Deployment Guide

This guide provides detailed instructions for deploying the Imóvel Fácil application using Docker.

## Quick Start

The fastest way to get the application running with Docker:

```bash
# 1. Clone the repository
git clone <repository-url>
cd imovel-facil

# 2. Create environment file
cp .env.example .env
# Edit .env if needed (default values work for Docker Compose setup)

# 3. Build and start the application
npm run docker:build
npm run docker:up

# 4. Access the application
# http://localhost:5000
```

## What Gets Deployed

The Docker Compose setup includes:

1. **PostgreSQL Database** (postgres:16-alpine)
   - Port: 5432
   - Database: imovel_facil
   - Persistent volume: postgres_data

2. **Application Server** (Node.js 20)
   - Port: 5000
   - Includes both frontend and backend
   - Auto-runs database migrations on startup

## Docker Commands Reference

### Production Deployment

```bash
# Build images
npm run docker:build

# Start services in background
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Restart services
npm run docker:down && npm run docker:up
```

### Development with Docker Database

For local development, you can run just PostgreSQL in Docker:

```bash
# Start only the database
npm run docker:dev:up

# Run application locally
npm run dev

# Stop database
npm run docker:dev:down
```

## Environment Variables

The application uses these environment variables:

| Variable | Default (Docker) | Description |
|----------|------------------|-------------|
| DATABASE_URL | postgresql://postgres:postgres@postgres:5432/imovel_facil | PostgreSQL connection string |
| NODE_ENV | production | Environment mode |
| PORT | 5000 | Server port |
| SESSION_SECRET | (optional) | Session encryption key |

## Data Persistence

The PostgreSQL database data is stored in a Docker volume named `postgres_data`. This ensures data persists across container restarts.

To remove all data and start fresh:
```bash
npm run docker:down
docker volume rm imovel-facil_postgres_data
npm run docker:up
```

## Logs and Debugging

```bash
# View all logs
npm run docker:logs

# View logs for specific service
docker compose logs -f app
docker compose logs -f postgres

# Check service status
docker compose ps

# Enter container shell
docker compose exec app sh
docker compose exec postgres psql -U postgres -d imovel_facil
```

## Production Considerations

### Security

1. **Change default passwords** - Update PostgreSQL password in docker-compose.yml
2. **Set SESSION_SECRET** - Add a strong random string for session encryption
3. **Use environment files** - Don't commit .env files with sensitive data
4. **Enable HTTPS** - Use a reverse proxy like Nginx with SSL certificates

### Performance

1. **Resource limits** - Add memory and CPU limits to docker-compose.yml
2. **Database tuning** - Configure PostgreSQL for production workloads
3. **Connection pooling** - Already configured via pg.Pool

### Backup

Regular backups are recommended:

```bash
# Backup database
docker compose exec postgres pg_dump -U postgres imovel_facil > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres imovel_facil < backup.sql
```

## Troubleshooting

### Port Already in Use

If port 5000 or 5432 is already in use:

```bash
# Find process using the port
lsof -i :5000
lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check database is healthy
docker compose ps

# Check database logs
docker compose logs postgres

# Test database connection
docker compose exec postgres psql -U postgres -d imovel_facil -c "SELECT 1"
```

### Application Won't Start

```bash
# View application logs
docker compose logs app

# Rebuild without cache
docker compose build --no-cache app
docker compose up -d

# Check if migrations failed
docker compose exec app npx drizzle-kit push
```

## Updating the Application

To deploy new changes:

```bash
# Pull latest changes
git pull

# Rebuild and restart
npm run docker:down
npm run docker:build
npm run docker:up
```

## Scaling (Future Enhancement)

To run multiple application instances:

```bash
docker compose up -d --scale app=3
```

Note: You'll need to:
- Add a load balancer (Nginx)
- Use external session store (Redis)
- Configure shared volumes if needed

## Health Checks

The PostgreSQL service includes a health check. The application starts only after PostgreSQL is healthy.

You can add health checks for the app service:

```yaml
app:
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5000/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and deploy
        run: |
          docker compose build
          docker compose up -d
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
