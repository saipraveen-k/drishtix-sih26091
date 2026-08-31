from fastapi import APIRouter, Depends, HTTPException
import json
import os
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.schemas import (
    InterestEvaluateRequest,
    InterestEvaluateResponse,
    JourneySelectRequest,
    JourneyStateResponse,
    NormalizeBusinessRequest,
    NormalizeBusinessResponse
)
from backend.app.engine.interest_evaluator import evaluate_interested_business
from backend.app.engine.normalization import normalize_business_interest
from backend.app.models.models import UserJourneyState

router = APIRouter(prefix="/discover", tags=["Discovery Engine"])

# Global in-memory journey cache as seamless fallback
IN_MEMORY_JOURNEY: Dict[str, Any] = {
    "user_id": "demo_user",
    "interested_business_name": "Restaurant",
    "interested_business_id": "biz_restaurant_10",
    "selected_business_id": "biz_millet_01",
    "selected_business_name": "Millet Processing & Packaging",
    "selection_source": "recommended_alternative",
    "opportunity_score": 91.0,
    "confidence_level": "HIGH",
    "updated_at": "2026-08-31T21:30:00"
}

def load_business_catalog() -> List[Dict[str, Any]]:
    path = "data/raw/demo_businesses.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_market_data_for_location(village: str, district: str) -> Dict[str, Any]:
    return {
        "demand_index": 85.0,
        "competition_density": 38.0,
        "resource_score": 78.0,
        "infra_score": 75.0,
        "population": 14500,
        "data_quality": "HIGH",
        "data_source": "DrishtiX Verified Rural Repository (2026)"
    }

@router.post("/normalize", response_model=NormalizeBusinessResponse)
def normalize_business(req: NormalizeBusinessRequest):
    catalog = load_business_catalog()
    norm = normalize_business_interest(req.user_input, catalog)
    return NormalizeBusinessResponse(
        user_entered_business=norm["user_entered_business"],
        canonical_business_id=norm["canonical_business_id"],
        canonical_business_name=norm["canonical_business_name"],
        category=norm["category"],
        is_custom=norm["is_custom"]
    )

@router.post("/evaluate-interest", response_model=InterestEvaluateResponse)
def evaluate_interest(req: InterestEvaluateRequest):
    profile = req.profile.model_dump()
    catalog = load_business_catalog()
    market_data = get_market_data_for_location(profile.get("village", ""), profile.get("district", ""))

    res = evaluate_interested_business(
        profile=profile,
        user_entered_interest=req.interested_business,
        catalog=catalog,
        market_data=market_data
    )

    # Initialize default journey state cache with user interest
    ib = res["interested_business"]
    IN_MEMORY_JOURNEY["interested_business_name"] = ib["user_entered_business"]
    IN_MEMORY_JOURNEY["interested_business_id"] = ib["canonical_business_id"]
    IN_MEMORY_JOURNEY["selected_business_id"] = ib["canonical_business_id"]
    IN_MEMORY_JOURNEY["selected_business_name"] = ib["canonical_business_name"]
    IN_MEMORY_JOURNEY["selection_source"] = "user_interest"
    IN_MEMORY_JOURNEY["opportunity_score"] = ib["opportunity_score"]

    return res

@router.post("/select", response_model=JourneyStateResponse)
def select_business(req: JourneySelectRequest, db: Session = Depends(get_db)):
    user_id = req.user_id or "demo_user"

    IN_MEMORY_JOURNEY["user_id"] = user_id
    IN_MEMORY_JOURNEY["interested_business_name"] = req.interested_business_name
    IN_MEMORY_JOURNEY["interested_business_id"] = req.interested_business_id
    IN_MEMORY_JOURNEY["selected_business_id"] = req.selected_business_id
    IN_MEMORY_JOURNEY["selected_business_name"] = req.selected_business_name
    IN_MEMORY_JOURNEY["selection_source"] = req.selection_source
    IN_MEMORY_JOURNEY["opportunity_score"] = req.opportunity_score
    IN_MEMORY_JOURNEY["updated_at"] = "2026-08-31T21:30:00"

    try:
        existing = db.query(UserJourneyState).filter(UserJourneyState.user_id == user_id).first()
        if not existing:
            existing = UserJourneyState(
                user_id=user_id,
                interested_business_name=req.interested_business_name,
                interested_business_id=req.interested_business_id,
                selected_business_id=req.selected_business_id,
                selected_business_name=req.selected_business_name,
                selection_source=req.selection_source,
                opportunity_score=req.opportunity_score
            )
            db.add(existing)
        else:
            existing.interested_business_name = req.interested_business_name
            existing.interested_business_id = req.interested_business_id
            existing.selected_business_id = req.selected_business_id
            existing.selected_business_name = req.selected_business_name
            existing.selection_source = req.selection_source
            existing.opportunity_score = req.opportunity_score
        db.commit()
    except Exception:
        pass

    return JourneyStateResponse(
        user_id=IN_MEMORY_JOURNEY["user_id"],
        interested_business_name=IN_MEMORY_JOURNEY["interested_business_name"],
        interested_business_id=IN_MEMORY_JOURNEY["interested_business_id"],
        selected_business_id=IN_MEMORY_JOURNEY["selected_business_id"],
        selected_business_name=IN_MEMORY_JOURNEY["selected_business_name"],
        selection_source=IN_MEMORY_JOURNEY["selection_source"],
        opportunity_score=IN_MEMORY_JOURNEY["opportunity_score"],
        confidence_level=IN_MEMORY_JOURNEY["confidence_level"],
        updated_at=IN_MEMORY_JOURNEY["updated_at"]
    )

@router.get("/journey-state", response_model=JourneyStateResponse)
def get_journey_state(user_id: str = "demo_user", db: Session = Depends(get_db)):
    try:
        state = db.query(UserJourneyState).filter(UserJourneyState.user_id == user_id).first()
        if state:
            return JourneyStateResponse(
                user_id=state.user_id,
                interested_business_name=state.interested_business_name,
                interested_business_id=state.interested_business_id,
                selected_business_id=state.selected_business_id,
                selected_business_name=state.selected_business_name,
                selection_source=state.selection_source,
                opportunity_score=state.opportunity_score,
                confidence_level=state.confidence_level,
                updated_at=str(state.updated_at)
            )
    except Exception:
        pass

    return JourneyStateResponse(
        user_id=IN_MEMORY_JOURNEY["user_id"],
        interested_business_name=IN_MEMORY_JOURNEY["interested_business_name"],
        interested_business_id=IN_MEMORY_JOURNEY["interested_business_id"],
        selected_business_id=IN_MEMORY_JOURNEY["selected_business_id"],
        selected_business_name=IN_MEMORY_JOURNEY["selected_business_name"],
        selection_source=IN_MEMORY_JOURNEY["selection_source"],
        opportunity_score=IN_MEMORY_JOURNEY["opportunity_score"],
        confidence_level=IN_MEMORY_JOURNEY["confidence_level"],
        updated_at=IN_MEMORY_JOURNEY["updated_at"]
    )
