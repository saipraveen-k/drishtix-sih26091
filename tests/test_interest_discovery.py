"""
Tests for DrishtiX Interest-Led Business Discovery & Decision Flow Engine
"""

import pytest
from fastapi.testclient import TestClient
import json
import os

from backend.app.main import app
from backend.app.engine.normalization import normalize_business_interest
from backend.app.engine.interest_evaluator import evaluate_interested_business, evaluate_fit_level
from backend.app.engine.scoring import compute_opportunity_score

client = TestClient(app)

@pytest.fixture
def catalog():
    path = "data/raw/demo_businesses.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@pytest.fixture
def sample_profile():
    return {
        "name": "Ramesh Kumar",
        "available_capital": 150000.0,
        "expected_investment": 200000.0,
        "desired_loan_amount": 50000.0,
        "experience_level": "1–3 years",
        "existing_business": False,
        "business_goal": "Start a new business",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "block": "Kudair",
        "village": "Kudair",
        "skills": ["Agriculture", "Food Processing"],
        "interests": ["Land", "Equipment", "Raw Materials"]
    }

@pytest.fixture
def sample_market_data():
    return {
        "demand_index": 85.0,
        "competition_density": 38.0,
        "resource_score": 78.0,
        "infra_score": 75.0,
        "population": 14500,
        "data_quality": "HIGH",
        "data_source": "DrishtiX Verified Rural Repository (2026)"
    }

def test_business_interest_normalization(catalog):
    # Alias matches
    res1 = normalize_business_interest("millet processing", catalog)
    assert res1["canonical_business_id"] == "biz_millet_01"
    assert res1["user_entered_business"] == "millet processing"
    assert not res1["is_custom"]

    res2 = normalize_business_interest("restaurant", catalog)
    assert res2["canonical_business_id"] == "biz_restaurant_10"
    assert res2["user_entered_business"] == "restaurant"
    assert not res2["is_custom"]

    res3 = normalize_business_interest("dairy farming", catalog)
    assert res3["canonical_business_id"] == "biz_dairy_03"

    # Synthetic fallback for custom unlisted business with no catalog keywords
    res4 = normalize_business_interest("space tourism venture", catalog)
    assert res4["user_entered_business"] == "space tourism venture"
    assert res4["canonical_business_id"].startswith("biz_custom_")
    assert res4["is_custom"]

def test_deterministic_scoring_formula(sample_profile, sample_market_data):
    biz = {
        "id": "biz_millet_01",
        "name": "Millet Processing & Packaging",
        "category": "Food Processing",
        "required_skills": ["food processing", "agriculture"],
        "investment_min": 120000,
        "investment_max": 250000,
        "working_capital": 35000,
        "growth_potential": "HIGH",
        "risk_level": "LOW"
    }

    res = compute_opportunity_score(sample_profile, biz, sample_market_data)
    # Check 7 weights: 0.25*demand + 0.20*skill + 0.15*capital + 0.10*supply + 0.10*infra + 0.10*growth + 0.10*risk
    assert 0 <= res["final_score"] <= 100
    assert len(res["score_breakdown"]) == 7

def test_interest_evaluation_engine(sample_profile, catalog, sample_market_data):
    eval_res = evaluate_interested_business(
        profile=sample_profile,
        user_entered_interest="Restaurant",
        catalog=catalog,
        market_data=sample_market_data
    )

    ib = eval_res["interested_business"]
    assert ib["user_entered_business"] == "Restaurant"
    assert ib["canonical_business_id"] == "biz_restaurant_10"

    # Top alternatives check: interested business must NOT be listed in alternatives
    alts = eval_res["alternatives"]
    assert len(alts) > 0
    alt_ids = [a["business_id"] for a in alts]
    assert "biz_restaurant_10" not in alt_ids

    # Check comparison matrix structure
    comp = eval_res["comparison"]
    assert "factor_matrix" in comp
    assert len(comp["factor_matrix"]) == 8

def test_api_normalize_endpoint():
    response = client.post("/api/discover/normalize", json={"user_input": "millet food processing"})
    assert response.status_code == 200
    data = response.json()
    assert data["canonical_business_id"] == "biz_millet_01"

def test_api_evaluate_interest_endpoint(sample_profile):
    payload = {
        "profile": sample_profile,
        "interested_business": "Restaurant"
    }
    response = client.post("/api/discover/evaluate-interest", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "interested_business" in data
    assert "alternatives" in data
    assert "comparison" in data

def test_api_journey_selection_flow():
    # 1. Select recommended alternative
    select_payload = {
        "user_id": "test_user_01",
        "interested_business_name": "Restaurant",
        "interested_business_id": "biz_restaurant_10",
        "selected_business_id": "biz_millet_01",
        "selected_business_name": "Millet Processing & Packaging",
        "selection_source": "recommended_alternative",
        "opportunity_score": 91.2
    }
    resp1 = client.post("/api/discover/select", json=select_payload)
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["selection_source"] == "recommended_alternative"
    assert data1["selected_business_id"] == "biz_millet_01"

    # 2. Get journey state
    resp2 = client.get("/api/discover/journey-state?user_id=test_user_01")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["selected_business_id"] == "biz_millet_01"

    # 3. Switch back to user interest
    switch_payload = {
        "user_id": "test_user_01",
        "interested_business_name": "Restaurant",
        "interested_business_id": "biz_restaurant_10",
        "selected_business_id": "biz_restaurant_10",
        "selected_business_name": "Village Family Restaurant & Tiffin Center",
        "selection_source": "user_interest",
        "opportunity_score": 61.4
    }
    resp3 = client.post("/api/discover/select", json=switch_payload)
    assert resp3.status_code == 200
    data3 = resp3.json()
    assert data3["selection_source"] == "user_interest"
    assert data3["selected_business_id"] == "biz_restaurant_10"
