# Architecture

## Overview

```
Client → Frontend (:5173) → API (:8001) → PostgreSQL (:5432)
                                ↕
                          Redis (:6379)
```

## Middleware Chain (order matters)

1. **CORS** (outermost) — Allow cross-origin requests
2. **Request Logging** — Log method/path/status/duration + correlation ID
3. **Rate Limiting** — Redis sliding window per user/endpoint
4. **Auth Middleware** (innermost) — Default-deny, JWT or API key required

## Database

- Connection pool: `ThreadedConnectionPool` (psycopg2)
- Retry: Exponential backoff on transient errors (3 attempts)
- Slow query logging: Warns when operation exceeds threshold (default 500ms)
- Always use `pooled_connection()` context manager

## Workers

- Base class: `BaseWorker` ABC
- Signal handling: SIGTERM/SIGINT for graceful shutdown
- Health probes: HTTP server on configurable port
- Polling: Adaptive (1s active, 30s idle)
- Errors: Exponential backoff, max retries, then shutdown

## Request Flow

1. Client sends request with JWT or API key
2. CORS middleware validates origin
3. Request logging middleware adds correlation ID
4. Rate limiting checks Redis (fallback to in-memory)
5. Auth middleware validates token/key (default-deny)
6. Route handler executes with `pooled_connection()`
7. Response includes correlation ID and rate limit headers

## Database Schema

```sql
-- Core tables
users (id, email, password_hash, created_at, updated_at)
api_keys (id, user_id, key_hash, name, created_at, last_used_at)
items (id, user_id, title, description, created_at, updated_at)
```

## Security

- Passwords: bcrypt with per-hash salt
- JWT: HS256 with configurable expiration
- API keys: SHA-256 hashed, prefix matching for lookup
- Default-deny: All routes require auth unless whitelisted
- CORS: Configurable allowed origins
- Rate limiting: Per-user and per-endpoint limits

## Deployment

- Docker Compose for development
- Helm chart for Kubernetes production
- HPA (Horizontal Pod Autoscaler) scales based on CPU
- PDB (Pod Disruption Budget) ensures availability during updates
- NetworkPolicy restricts traffic to DB/Redis/HTTPS only
