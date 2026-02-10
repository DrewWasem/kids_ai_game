"""
CLI Tool
========
Management CLI for the application.
Run with: python -m cli.ctl [command]
"""
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'config'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import click

from config import DB_HOST, DB_PORT, DB_NAME, DB_USER


@click.group()
def cli():
    """Application management CLI."""
    pass


@cli.command()
def status():
    """Show system status."""
    click.echo("=== System Status ===")
    click.echo(f"Database: {DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

    try:
        from api.db import pooled_connection
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version()")
                version = cur.fetchone()[0]
                click.echo(f"PostgreSQL: {version[:60]}...")

                cur.execute("SELECT COUNT(*) FROM cfg_user")
                users = cur.fetchone()[0]
                click.echo(f"Users: {users}")

                cur.execute("SELECT COUNT(*) FROM items")
                items = cur.fetchone()[0]
                click.echo(f"Items: {items}")
        click.echo("Status: HEALTHY")
    except Exception as e:
        click.echo(f"Status: ERROR - {e}", err=True)
        sys.exit(1)


@cli.group()
def db():
    """Database management commands."""
    pass


@db.command()
def connections():
    """Show active database connections."""
    try:
        from api.db import pooled_connection
        with pooled_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT pid, state, query_start, left(query, 80) as query
                    FROM pg_stat_activity
                    WHERE datname = %s AND pid != pg_backend_pid()
                    ORDER BY query_start DESC
                """, (DB_NAME,))
                rows = cur.fetchall()
                click.echo(f"Active connections: {len(rows)}")
                for row in rows:
                    click.echo(f"  PID={row[0]} state={row[1]} query={row[3]}")
    except Exception as e:
        click.echo(f"Error: {e}", err=True)


@cli.group()
def logs():
    """Log management commands."""
    pass


@logs.command()
@click.option('-f', '--follow', is_flag=True, help='Follow log output')
@click.option('-n', '--lines', default=50, help='Number of lines')
def tail(follow, lines):
    """Show recent log entries."""
    from config import LOG_DIR
    log_file = os.path.join(LOG_DIR, 'app.log')

    if not os.path.exists(log_file):
        click.echo(f"Log file not found: {log_file}")
        return

    import subprocess
    cmd = ['tail']
    if follow:
        cmd.append('-f')
    cmd.extend(['-n', str(lines), log_file])
    subprocess.run(cmd)


if __name__ == '__main__':
    cli()
