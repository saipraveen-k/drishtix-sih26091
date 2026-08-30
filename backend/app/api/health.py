from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["Health & Status"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "DrishtiX Hyper-Local Entrepreneurship Intelligence API",
        "version": "1.0.0"
    }
