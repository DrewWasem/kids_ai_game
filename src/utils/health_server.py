"""
Worker Health Server
====================
Simple HTTP health server for K8s liveness/readiness probes.
Workers start this on a configurable port to report their health status.
"""
import logging
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

logger = logging.getLogger(__name__)

_health_status = {"healthy": True, "details": {}}


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ('/health', '/healthz', '/ready'):
            status = 200 if _health_status["healthy"] else 503
            import json
            body = json.dumps(_health_status).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress access logs

    def write(self, data):
        self.wfile.write(data)


def start_health_server(port: int = 8090) -> HTTPServer:
    """Start health server in a background thread."""
    server = HTTPServer(('0.0.0.0', port), HealthHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    logger.info(f"Health server started on port {port}")
    return server


def set_healthy(healthy: bool = True, **details):
    """Update health status."""
    _health_status["healthy"] = healthy
    _health_status["details"].update(details)


def set_unhealthy(reason: str):
    """Mark as unhealthy."""
    _health_status["healthy"] = False
    _health_status["details"]["reason"] = reason
