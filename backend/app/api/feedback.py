from fastapi import APIRouter
from backend.app.schemas.schemas import FeedbackCreate

router = APIRouter(prefix="/feedback", tags=["Feedback Loop"])

@router.post("")
def record_feedback(fb: FeedbackCreate):
    return {
        "status": "success",
        "message": "Thank you for your feedback! Your evaluation helps refine future opportunity ranking models.",
        "recorded_feedback": fb.model_dump()
    }
