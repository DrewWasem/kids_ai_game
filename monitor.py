#!/usr/bin/env python3
"""
Service Monitor
===============
Start, monitor, and restart application services.

Usage:
    python monitor.py              # Check status
    python monitor.py --start-all  # Start all services
    python monitor.py --watch      # Continuous monitoring
    python monitor.py --restart    # Restart failed services
"""
import argparse
import os
import signal
import subprocess
import sys
import time

SERVICES = {
    "api": {
        "cmd": [sys.executable, "-m", "uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8001"],
        "cwd": os.path.join(os.path.dirname(__file__), "src"),
        "port": 8001,
        "url": "http://localhost:8001/api/v1/health",
    },
    "frontend": {
        "cmd": ["npm", "run", "dev"],
        "cwd": os.path.join(os.path.dirname(__file__), "frontend"),
        "port": 5173,
        "url": "http://localhost:5173",
    },
}

_processes = {}


def check_port(port):
    """Check if a port is in use."""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0


def start_service(name):
    """Start a service."""
    svc = SERVICES[name]
    if name in _processes and _processes[name].poll() is None:
        print(f"  {name}: already running (PID {_processes[name].pid})")
        return

    if check_port(svc["port"]):
        print(f"  {name}: port {svc['port']} already in use")
        return

    log_dir = os.path.join(os.path.dirname(__file__), "logs")
    os.makedirs(log_dir, exist_ok=True)

    log_file = open(os.path.join(log_dir, f"{name}.log"), "a")
    proc = subprocess.Popen(
        svc["cmd"], cwd=svc["cwd"],
        stdout=log_file, stderr=subprocess.STDOUT,
        preexec_fn=os.setpgrp if sys.platform != 'win32' else None,
    )
    _processes[name] = proc
    print(f"  {name}: started (PID {proc.pid}) on port {svc['port']}")


def check_status():
    """Check status of all services."""
    print("=== Service Status ===")
    for name, svc in SERVICES.items():
        port_up = check_port(svc["port"])
        status = "UP" if port_up else "DOWN"
        pid_info = ""
        if name in _processes and _processes[name].poll() is None:
            pid_info = f" (PID {_processes[name].pid})"
        print(f"  {name}: {status} (port {svc['port']}){pid_info}")


def start_all():
    """Start all services."""
    print("Starting all services...")
    for name in SERVICES:
        start_service(name)


def watch(interval=5):
    """Continuously monitor services."""
    print(f"Watching services (every {interval}s, Ctrl+C to stop)...")
    try:
        while True:
            os.system('clear' if os.name != 'nt' else 'cls')
            check_status()
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\nStopped watching.")


def main():
    parser = argparse.ArgumentParser(description="Service Monitor")
    parser.add_argument('--start-all', action='store_true', help='Start all services')
    parser.add_argument('--watch', action='store_true', help='Continuous monitoring')
    parser.add_argument('--restart', action='store_true', help='Restart failed services')
    parser.add_argument('--interval', type=int, default=5, help='Watch interval (seconds)')
    args = parser.parse_args()

    if args.start_all:
        start_all()
        if args.watch:
            time.sleep(2)
            watch(args.interval)
    elif args.restart:
        for name, svc in SERVICES.items():
            if not check_port(svc["port"]):
                print(f"Restarting {name}...")
                start_service(name)
    elif args.watch:
        watch(args.interval)
    else:
        check_status()


if __name__ == '__main__':
    main()
