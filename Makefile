.PHONY: help test test-unit test-db test-fast test-integration test-e2e test-perf test-cov lint format docker-build docker-up docker-down clean deploy-db workers-start workers-stop

help:
	@echo "Available targets:"
	@echo "  test            - Run all tests"
	@echo "  test-unit       - Run unit tests only (no DB)"
	@echo "  test-db         - Run database tests"
	@echo "  test-fast       - Run fast tests (unit + db, skip e2e/perf)"
	@echo "  test-integration- Run integration tests"
	@echo "  test-e2e        - Run end-to-end tests"
	@echo "  test-perf       - Run performance tests"
	@echo "  test-cov        - Run tests with coverage report"
	@echo "  lint            - Run linters (ruff, mypy)"
	@echo "  format          - Auto-format code (black, ruff)"
	@echo "  docker-build    - Build Docker images"
	@echo "  docker-up       - Start Docker stack"
	@echo "  docker-down     - Stop Docker stack"
	@echo "  clean           - Remove build artifacts"
	@echo "  deploy-db       - Deploy database schema"
	@echo "  workers-start   - Start all workers"
	@echo "  workers-stop    - Stop all workers"

test:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/ -v

test-unit:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/ -v -m unit

test-db:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/ -v -m db

test-fast:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/ -v -m "not e2e and not perf and not integration"

test-integration:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/integration/ -v

test-e2e:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/ -v -m e2e

test-perf:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/ -v -m perf

test-cov:
	cd src && MYAPP_SECRET_KEY="test-secret-key-for-testing-only" python -m pytest tests/ -v --cov=. --cov-report=html --cov-report=term

lint:
	cd src && ruff check .
	cd src && mypy --ignore-missing-imports .

format:
	cd src && ruff format .
	cd src && ruff check --fix .

docker-build:
	docker build -t myapp:latest .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf htmlcov .coverage

deploy-db:
	@echo "Deploy database schema here"
	@echo "Example: psql -d myapp -f sql/schema.sql"

workers-start:
	@echo "Start workers here"
	@echo "Example: ./scripts/start_workers.sh"

workers-stop:
	@echo "Stop workers here"
	@echo "Example: pkill -f worker"
