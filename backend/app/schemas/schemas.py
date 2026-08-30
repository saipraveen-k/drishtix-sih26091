from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: Optional[str] = "ENTREPRENEUR"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str
    role: str

# --- Profile Schemas ---
class ProfileCreateUpdate(BaseModel):
    name: str
    age: Optional[int] = 28
    gender: Optional[str] = "Prefer not to say"
    language: Optional[str] = "en"
    available_capital: float = Field(..., ge=0)
    expected_investment: float = Field(..., ge=0)
    desired_loan_amount: float = Field(..., ge=0)
    experience_level: str = "beginner"
    existing_business: bool = False
    business_goal: str = "first business"
    state: str
    district: str
    block: Optional[str] = ""
    village: str
    pincode: Optional[str] = ""
    latitude: Optional[float] = 14.6819
    longitude: Optional[float] = 77.4521
    skills: List[str] = []
    interests: List[str] = []

class ProfileResponse(ProfileCreateUpdate):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Location & Market Schemas ---
class LocationSearchQuery(BaseModel):
    query: str

class MarketDataResponse(BaseModel):
    state: str
    district: str
    village: str
    pincode: Optional[str]
    latitude: float
    longitude: float
    demand_index: float
    competition_density: float
    resource_score: float
    infra_score: float
    population: int
    nearest_market_km: float
    road_connectivity: str
    data_quality: str
    data_source: str
    confidence_rating: str

# --- Opportunity & Recommendation Engine Schemas ---
class RecommendRequest(BaseModel):
    user_id: Optional[str] = None
    profile: ProfileCreateUpdate

class FactorBreakdown(BaseModel):
    factor_name: str
    weight_pct: int
    score: float
    description: str

class OpportunityItem(BaseModel):
    business_id: str
    business_name: str
    category: str
    description: str
    score: float
    confidence: float
    confidence_level: str
    investment_min: float
    investment_max: float
    working_capital: float
    demand: str
    competition: str
    skill_fit: str
    risk: str
    score_breakdown: List[FactorBreakdown]
    why_recommended: List[str]
    why_alternatives_lower: List[str]
    assumptions: List[str]
    data_sources: List[Dict[str, Any]]

class RecommendationListResponse(BaseModel):
    user_location: str
    total_analyzed: int
    recommendations: List[OpportunityItem]

# --- Financial Digital Twin Schemas ---
class FinanceCalculateRequest(BaseModel):
    opportunity_id: str
    initial_investment: float = Field(..., ge=0)
    working_capital: float = Field(..., ge=0)
    monthly_sales_revenue: float = Field(..., ge=0)
    selling_price_per_unit: float = Field(..., gt=0)
    units_sold_per_month: float = Field(..., ge=0)
    variable_cost_per_unit: float = Field(..., ge=0)
    fixed_cost_per_month: float = Field(..., ge=0)
    loan_amount: float = Field(0.0, ge=0)
    interest_rate_annual: float = Field(9.5, ge=0)
    loan_tenure_months: int = Field(36, ge=1)

class FinanceTwinResponse(BaseModel):
    opportunity_id: str
    initial_investment: float
    working_capital: float
    monthly_revenue: float
    monthly_variable_costs: float
    monthly_fixed_costs: float
    monthly_gross_profit: float
    monthly_loan_emi: float
    monthly_net_profit: float
    monthly_cash_flow: float
    break_even_units: float
    break_even_revenue: float
    roi_percent: float
    payback_months: float
    risk_assessment: str
    disclaimer: str

# --- Simulation Schemas ---
class SimulationRequest(BaseModel):
    base_finance: FinanceCalculateRequest
    sales_change_pct: float = 0.0 # e.g. -20 for -20%
    cost_change_pct: float = 0.0  # e.g. +15 for +15%
    price_change_pct: float = 0.0
    investment_change_pct: float = 0.0
    loan_amount: Optional[float] = None
    interest_rate: Optional[float] = None

class ScenarioOutput(BaseModel):
    scenario_name: str
    monthly_revenue: float
    monthly_expenses: float
    net_profit: float
    cash_flow: float
    break_even_units: float
    risk_level: str

class WhatIfSimulationResponse(BaseModel):
    base_case: ScenarioOutput
    optimistic_case: ScenarioOutput
    realistic_case: ScenarioOutput
    stress_case: ScenarioOutput
    custom_scenario: ScenarioOutput

# --- Scheme & Readiness Schemas ---
class SchemeMatchRequest(BaseModel):
    profile: ProfileCreateUpdate
    business_id: str
    category: str
    investment_required: float

class SchemeItem(BaseModel):
    scheme_id: str
    name: str
    nodal_agency: str
    relevance_reason: str
    eligibility_status: str # "Potentially Relevant"
    potential_benefit: str
    required_documents: List[str]
    description: str

class SchemeMatchResponse(BaseModel):
    business_id: str
    total_matched: int
    schemes: List[SchemeItem]

class ReadinessCalculateRequest(BaseModel):
    profile: ProfileCreateUpdate
    business_id: str
    provided_documents: List[str] = []

class ReadinessScoreResponse(BaseModel):
    overall_readiness_score: float # 0-100%
    profile_readiness: float
    business_readiness: float
    financial_readiness: float
    document_readiness: float
    eligibility_readiness: float
    missing_requirements: List[str]
    document_checklist: Dict[str, bool]

# --- Business Plan Schemas ---
class BusinessPlanGenerateRequest(BaseModel):
    profile: ProfileCreateUpdate
    opportunity_id: str
    financial_data: Optional[FinanceCalculateRequest] = None

class BusinessPlanSection(BaseModel):
    section_number: int
    title: str
    content: str
    is_financial_table: bool = False
    table_data: Optional[Dict[str, Any]] = None

class BusinessPlanResponse(BaseModel):
    plan_id: str
    business_name: str
    entrepreneur_name: str
    generated_at: str
    sections: List[BusinessPlanSection]

# --- Copilot & Feedback Schemas ---
class CopilotChatRequest(BaseModel):
    question: str
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = {}

class CopilotChatResponse(BaseModel):
    answer: str
    sources_used: List[str]
    suggested_followups: List[str]

class FeedbackCreate(BaseModel):
    opportunity_id: Optional[str] = None
    is_useful: bool
    comments: Optional[str] = None
    suggested_category: Optional[str] = None
