from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Profile, User
from backend.app.schemas.schemas import ProfileCreateUpdate, ProfileResponse

router = APIRouter(prefix="/profile", tags=["Entrepreneur Profile"])

@router.post("", response_model=ProfileResponse)
def create_or_update_profile(profile_in: ProfileCreateUpdate, user_id: str = "demo_user_123", db: Session = Depends(get_db)):
    existing = db.query(Profile).filter(Profile.user_id == user_id).first()
    if existing:
        for k, v in profile_in.model_dump().items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        profile = Profile(user_id=user_id, **profile_in.model_dump())
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

@router.get("", response_model=ProfileResponse)
def get_profile(user_id: str = "demo_user_123", db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        # Default fallback demo profile
        return ProfileResponse(
            id="prof_demo",
            user_id=user_id,
            name="Ramesh Kumar",
            age=29,
            gender="Male",
            language="en",
            available_capital=150000.0,
            expected_investment=200000.0,
            desired_loan_amount=50000.0,
            experience_level="some experience",
            existing_business=False,
            business_goal="first business",
            state="Andhra Pradesh",
            district="Anantapur",
            block="Kudair",
            village="Kudair",
            pincode="515711",
            latitude=14.6819,
            longitude=77.4521,
            skills=["agriculture", "food processing"],
            interests=["food", "manufacturing"],
            created_at="2026-01-01T00:00:00",
            updated_at="2026-01-01T00:00:00"
        )
    return profile
