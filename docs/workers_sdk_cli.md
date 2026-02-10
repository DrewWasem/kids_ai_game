# Workers, SDK, CLI, and Monitor Reference

## Workers

### Base Worker Pattern

All background workers extend `BaseWorker` abstract class:

```python
from workers.base_worker import BaseWorker

class MyWorker(BaseWorker):
    def __init__(self, **kwargs):
        super().__init__(worker_name="my_worker", **kwargs)

    def process_batch(self) -> int:
        # Process work, return number of items processed
        return count

    def on_startup(self):
        # Optional: initialization
        pass

    def on_shutdown(self):
        # Optional: cleanup
        pass
```

**Features:**
- Graceful shutdown via SIGTERM/SIGINT
- Health server for K8s probes (`--health-port`)
- Adaptive polling (idle/active intervals)
- Exponential backoff on errors
- Single-shot mode (`--once`) for testing/cron

**Run:**
```bash
# Continuous mode
python -m workers.example_worker

# Single-shot mode
python -m workers.example_worker --once

# With health probe (for K8s)
python -m workers.example_worker --health-port 8090
```

### Files

| File | Description |
|------|-------------|
| `src/workers/base_worker.py` | Abstract base class (153 lines) |
| `src/workers/example_worker.py` | Example implementation (62 lines) |
| `src/workers/__init__.py` | Package exports |

## SDK

### Client Usage

```python
from sdk import Client

# With API key
client = Client(base_url="http://localhost:8001", api_key="your-key")

# With JWT login
client = Client(base_url="http://localhost:8001")
client.login(email="user@example.com", password="password")

# CRUD operations
items = client.list_items(page=1, limit=50)
item = client.create_item(title="New Item", description="Description")
item = client.get_item(item_id=1)
item = client.update_item(item_id=1, title="Updated")
client.delete_item(item_id=1)

# Auto-paging iterator
for item in client.iter_items(limit=100):
    print(item.title)

# Context manager
with Client(api_key="key") as client:
    items = client.list_items()
```

### Exception Hierarchy

```python
AppError (base)
├── APIError(message, status_code)
├── AuthenticationError
├── NotFoundError
└── RateLimitError(message, retry_after)
```

### Models

```python
@dataclass
class HealthStatus:
    status: str
    uptime_seconds: int
    connection_pool: dict

@dataclass
class Item:
    id: int
    user_id: int
    title: str
    description: str
    status: str
    metadata: dict
    created_at: str
    updated_at: str

@dataclass
class PaginatedResponse:
    items: list
    total: int
    page: int
    limit: int
    pages: int
```

### Files

| File | Description |
|------|-------------|
| `src/sdk/client.py` | HTTP client (112 lines) |
| `src/sdk/models.py` | Response models (36 lines) |
| `src/sdk/exceptions.py` | Exception classes (34 lines) |
| `src/sdk/__init__.py` | Package exports |

**Dependencies:** `httpx`

## CLI Tool

### Commands

```bash
# Status check
python -m cli.ctl status

# Database commands
python -m cli.ctl db connections

# Log management
python -m cli.ctl logs tail -n 100
python -m cli.ctl logs tail -f
```

### Add Custom Commands

```python
@cli.command()
@click.option('--verbose', is_flag=True)
def my_command(verbose):
    """Custom command description."""
    if verbose:
        click.echo("Verbose mode")
    # Your logic here
```

### Files

| File | Description |
|------|-------------|
| `src/cli/ctl.py` | Click-based CLI (106 lines) |
| `src/cli/__init__.py` | Package marker |

**Dependencies:** `click`

## Service Monitor

### Usage

```bash
# Check status
python monitor.py

# Start all services
python monitor.py --start-all

# Continuous monitoring (auto-refresh)
python monitor.py --watch
python monitor.py --watch --interval 10

# Restart failed services
python monitor.py --restart
```

### Configured Services

| Service | Port | Command |
|---------|------|---------|
| API | 8001 | `uvicorn api.app:app` |
| Frontend | 5173 | `npm run dev` |

### Add New Service

Edit `SERVICES` dict in `monitor.py`:

```python
SERVICES = {
    "api": {...},
    "frontend": {...},
    "worker": {
        "cmd": [sys.executable, "-m", "workers.example_worker"],
        "cwd": os.path.join(os.path.dirname(__file__), "src"),
        "port": 8090,  # health port
        "url": "http://localhost:8090/health",
    },
}
```

### Features

- Port availability check
- Process management with PID tracking
- Log rotation (logs written to `logs/{service}.log`)
- Auto-restart on failure
- Graceful shutdown via signal groups

### Files

| File | Description |
|------|-------------|
| `monitor.py` | Service orchestrator (125 lines) |

## Architecture Patterns

### Worker Pattern

```
BaseWorker (abstract)
    ├── process_batch() -> int (required)
    ├── on_startup() (optional)
    ├── on_shutdown() (optional)
    └── on_error(Exception) (optional)

Flow:
1. on_startup()
2. Loop:
   - process_batch()
   - Adaptive sleep (idle vs active)
   - Error handling with backoff
3. on_shutdown()
```

### SDK Pattern

```
Client
    ├── _headers() -> dict (auth)
    ├── _request(method, path) -> Any (core)
    └── Resource methods (list_items, create_item, etc.)

Response -> Dataclass Models
Errors -> Exception Hierarchy
```

### CLI Pattern

```
Click Group (cli)
    ├── Command (status, restart, etc.)
    └── Subgroup (db, logs)
        └── Command (connections, tail)

Context: Uses config.py + api.db for operations
```

### Monitor Pattern

```
SERVICES dict -> Service definitions
    ├── check_port() -> bool
    ├── start_service() -> subprocess
    └── watch() -> continuous monitoring

Process tracking via _processes dict
Log management via logs/ directory
```

## Testing Examples

### Test Worker

```python
def test_worker():
    worker = ExampleWorker(worker_id=0)
    processed = worker.process_batch()
    assert processed >= 0
    worker.stop()
```

### Test SDK

```python
def test_sdk_client():
    with Client(base_url="http://localhost:8001", api_key="test-key") as client:
        health = client.health()
        assert health.status == "healthy"
```

### Test CLI

```python
from click.testing import CliRunner
from cli.ctl import cli

def test_status_command():
    runner = CliRunner()
    result = runner.invoke(cli, ['status'])
    assert result.exit_code == 0
    assert "System Status" in result.output
```

## Configuration

All components use centralized config from `src/config/config.py`:

```python
# Worker config
WORKER_IDLE_INTERVAL = 30
WORKER_MAX_RETRIES = 5
BACKOFF_MIN_DELAY = 1.0
BACKOFF_MAX_DELAY = 300.0

# Database config
DB_HOST, DB_PORT, DB_NAME, DB_USER

# Logging
LOG_DIR, LOG_LEVEL
```

## Deployment

### Docker

```dockerfile
# Worker deployment
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "-m", "workers.example_worker", "--health-port", "8090"]
```

### Kubernetes

```yaml
# Worker deployment with health probes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-worker
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: worker
        image: app:latest
        command: ["python", "-m", "workers.example_worker", "--health-port", "8090"]
        livenessProbe:
          httpGet:
            path: /health
            port: 8090
          initialDelaySeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8090
          initialDelaySeconds: 10
```

## Dependencies

Add to `requirements.txt`:

```
# SDK
httpx>=0.24.0

# CLI
click>=8.1.0

# Workers (no external deps beyond stdlib + config)
```

## Next Steps

1. Implement your worker logic in `process_batch()`
2. Add SDK methods for your custom endpoints
3. Add CLI commands for your operations
4. Configure services in `monitor.py`
5. Add health checks to workers for K8s
6. Write tests for all components
