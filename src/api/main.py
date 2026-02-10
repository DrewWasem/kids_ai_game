"""
API Entry Point
===============
Run with: python -m api.main
Or: uvicorn api.app:app --host 0.0.0.0 --port 8001 --reload
"""
import uvicorn
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

if __name__ == "__main__":
    uvicorn.run(
        "api.app:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info",
        access_log=True,
    )
