import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="ENTREPRENEUR") # ENTREPRENEUR, FACILITATOR, ADMIN
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    language = Column(String, default="en")
    
    available_capital = Column(Float, default=0.0)
    expected_investment = Column(Float, default=0.0)
    desired_loan_amount = Column(Float, default=0.0)

    experience_level = Column(String, default="beginner") # beginner, some experience, experienced
    existing_business = Column(Boolean, default=False)
    business_goal = Column(String, default="first business") # first business, expand existing business, increase income, create employment, use local resources
    
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    block = Column(String, nullable=True)
    village = Column(String, nullable=False)
    pincode = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    skills = Column(JSON, default=list) # e.g. ["agriculture", "food processing"]
    interests = Column(JSON, default=list) # e.g. ["food", "renewable energy"]
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class BusinessCatalog(Base):
    __tablename__ = "business_catalog"

    id = Column(String, primary_key=True, default=generate_uuid)
    business_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    investment_min = Column(Float, nullable=False)
    investment_max = Column(Float, nullable=False)
    working_capital = Column(Float, nullable=False)
    resource_requirements = Column(JSON, default=list)
    infrastructure_requirements = Column(JSON, default=list)
    risk_level = Column(String, default="MEDIUM") # LOW, MEDIUM, HIGH
    seasonality = Column(String, default="Year-Round")
    growth_potential = Column(String, default="HIGH")
    typical_cost_structure = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class MarketLocationData(Base):
    __tablename__ = "market_location_data"

    id = Column(String, primary_key=True, default=generate_uuid)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    village = Column(String, nullable=False, index=True)
    pincode = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    demand_index = Column(Float, default=75.0)
    competition_density = Column(Float, default=40.0)
    resource_score = Column(Float, default=70.0)
    infra_score = Column(Float, default=65.0)
    population = Column(Integer, default=15000)
    nearest_market_km = Column(Float, default=5.0)
    road_connectivity = Column(String, default="GOOD")
    
    data_quality = Column(String, default="HIGH")
    data_source = Column(String, default="DrishtiX Verified Repository")
    updated_at = Column(DateTime, default=datetime.utcnow)

class GeneratedOpportunity(Base):
    __tablename__ = "generated_opportunities"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    business_id = Column(String, nullable=False)
    business_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    score = Column(Float, nullable=False) # 0-100
    confidence = Column(Float, nullable=False) # 0-100
    confidence_level = Column(String, default="HIGH") # HIGH, MEDIUM, LOW
    
    score_breakdown = Column(JSON, default=dict)
    why_recommended = Column(JSON, default=list)
    why_alternatives_lower = Column(JSON, default=list)
    assumptions = Column(JSON, default=list)
    data_sources = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)

class SavedFinancialTwin(Base):
    __tablename__ = "financial_twins"

    id = Column(String, primary_key=True, default=generate_uuid)
    opportunity_id = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    business_name = Column(String, nullable=False)

    initial_investment = Column(Float, nullable=False)
    working_capital = Column(Float, nullable=False)
    monthly_sales = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    units_sold = Column(Float, nullable=False)
    variable_cost = Column(Float, nullable=False)
    fixed_cost = Column(Float, nullable=False)
    loan_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    loan_tenure_months = Column(Integer, nullable=False)

    # Calculated metrics
    monthly_revenue = Column(Float, nullable=False)
    monthly_variable_costs = Column(Float, nullable=False)
    monthly_gross_profit = Column(Float, nullable=False)
    monthly_net_profit = Column(Float, nullable=False)
    monthly_cash_flow = Column(Float, nullable=False)
    break_even_units = Column(Float, nullable=False)
    break_even_revenue = Column(Float, nullable=False)
    roi_percent = Column(Float, nullable=False)
    payback_months = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

class SchemeRecord(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True, default=generate_uuid)
    scheme_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    nodal_agency = Column(String, nullable=False)
    target_categories = Column(JSON, default=list)
    max_benefit = Column(String, nullable=True)
    subsidy_rate = Column(String, nullable=True)
    eligibility_criteria = Column(JSON, default=dict)
    required_documents = Column(JSON, default=list)
    description = Column(Text, nullable=False)

class UserFeedback(Base):
    __tablename__ = "user_feedback"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    opportunity_id = Column(String, nullable=True)
    is_useful = Column(Boolean, nullable=False)
    comments = Column(Text, nullable=True)
    suggested_category = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
