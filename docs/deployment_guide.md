# Deployment Guide

## Docker Compose (Development)

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Environment Variables

Create `.env` file:

```bash
MYAPP_SECRET_KEY=your-secret-key-here
MYAPP_DB_PASSWORD=your-db-password
```

### Services

| Service | Port | URL |
|---------|------|-----|
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| API | 8001 | http://localhost:8001 |
| Frontend | 5173 | http://localhost:5173 |

## Kubernetes (Production)

### Prerequisites

- Kubernetes 1.24+
- Helm 3.0+
- kubectl configured

### Install with Helm

```bash
# Create namespace
kubectl create namespace myapp

# Create secrets
kubectl create secret generic myapp-secrets \
  --from-literal=db-password=your-db-password \
  --from-literal=secret-key=your-secret-key \
  -n myapp

# Install chart
helm install myapp ./helm/app \
  --namespace myapp \
  --set database.host=your-db-host \
  --set image.repository=your-registry/myapp \
  --set image.tag=v1.0.0

# Check status
kubectl get pods -n myapp
```

### Production Values

Create `values-production.yaml`:

```yaml
replicaCount: 3

image:
  repository: your-registry/myapp
  tag: v1.0.0
  pullPolicy: Always

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilization: 70

database:
  host: postgres.production.svc.cluster.local
  port: 5432
  name: myapp_prod

redis:
  url: redis://redis.production.svc.cluster.local:6379

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: api.myapp.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: myapp-tls
      hosts:
        - api.myapp.com
```

Deploy:

```bash
helm upgrade --install myapp ./helm/app \
  --namespace myapp \
  -f values-production.yaml
```

### Database Migration

```bash
# Run migration job
kubectl run myapp-migrate \
  --image=your-registry/myapp:v1.0.0 \
  --namespace myapp \
  --restart=Never \
  --command -- psql -h postgres -d myapp -f /app/sql/deploy.sql

# Check logs
kubectl logs myapp-migrate -n myapp

# Cleanup
kubectl delete pod myapp-migrate -n myapp
```

## Environment Variables

Required for production:

### Security (Required)

```bash
MYAPP_SECRET_KEY=your-secret-key-here    # Strong random key (64+ chars)
MYAPP_DB_PASSWORD=your-db-password       # Database password
```

### Database (Required)

```bash
MYAPP_DB_HOST=your-db-host
MYAPP_DB_PORT=5432
MYAPP_DB_NAME=myapp_prod
MYAPP_DB_USER=myapp
```

### Application

```bash
MYAPP_CORS_ORIGINS=https://app.myapp.com,https://admin.myapp.com
MYAPP_LOG_LEVEL=INFO
MYAPP_API_DEFAULT_PAGE_SIZE=50
MYAPP_API_MAX_PAGE_SIZE=1000
```

### Rate Limiting

```bash
MYAPP_RATE_LIMIT_ENABLED=true
MYAPP_RATE_LIMIT_REDIS_URL=redis://redis:6379
MYAPP_RATE_LIMIT_DEFAULT=100/minute
```

### Connection Pool

```bash
MYAPP_DB_POOL_MIN=2
MYAPP_DB_POOL_MAX=20
MYAPP_DB_CONNECT_TIMEOUT=10
MYAPP_DB_SLOW_QUERY_THRESHOLD_MS=500
```

## Monitoring

### Health Checks

```bash
# API health
curl http://localhost:8001/api/v1/health

# Response
{
  "status": "healthy",
  "uptime_seconds": 12345,
  "database": "connected",
  "connection_pool": {
    "initialized": true,
    "total": 20,
    "available": 18
  }
}
```

### Logs

```bash
# Kubernetes
kubectl logs -f deployment/myapp-api -n myapp

# Docker Compose
docker-compose logs -f api

# Local
tail -f logs/app.log
```

### Metrics

Health endpoint includes:
- Uptime
- Database connection status
- Connection pool stats
- Active requests (if tracked)

## Backup

### Database Backup

```bash
# Manual backup
./scripts/backup_database.sh

# Kubernetes CronJob
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: myapp-backup
  namespace: myapp
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16-alpine
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -h postgres -U myapp myapp_prod | gzip > /backup/myapp_\$(date +%Y%m%d_%H%M%S).sql.gz
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: myapp-secrets
                  key: db-password
            volumeMounts:
            - name: backup
              mountPath: /backup
          restartPolicy: OnFailure
          volumes:
          - name: backup
            persistentVolumeClaim:
              claimName: backup-pvc
EOF
```

### Restore

```bash
# From backup file
gunzip -c backup.sql.gz | psql -h localhost -U myapp -d myapp_prod
```

## Scaling

### Horizontal Pod Autoscaler

The Helm chart includes HPA by default:

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilization: 70
```

Monitor scaling:

```bash
kubectl get hpa -n myapp
kubectl describe hpa myapp-api -n myapp
```

### Manual Scaling

```bash
# Kubernetes
kubectl scale deployment myapp-api --replicas=5 -n myapp

# Docker Compose
docker-compose up -d --scale api=3
```

## Troubleshooting

### Pods Not Starting

```bash
kubectl describe pod myapp-api-xxx -n myapp
kubectl logs myapp-api-xxx -n myapp
```

Common issues:
- Secrets not created
- Database unreachable
- Image pull errors

### Database Connection Errors

Check connection pool settings:
- Increase `MYAPP_DB_POOL_MAX` if exhausted
- Check database max_connections
- Verify network connectivity

### Rate Limit Issues

If Redis unavailable, API falls back to in-memory rate limiting (per-pod).

For distributed rate limiting, ensure Redis is accessible:

```bash
kubectl get svc redis -n myapp
```

## Rolling Updates

```bash
# Update image
helm upgrade myapp ./helm/app \
  --namespace myapp \
  --set image.tag=v1.1.0 \
  --reuse-values

# Monitor rollout
kubectl rollout status deployment/myapp-api -n myapp

# Rollback if needed
kubectl rollout undo deployment/myapp-api -n myapp
```

Pod Disruption Budget ensures at least 1 replica stays up during updates.
