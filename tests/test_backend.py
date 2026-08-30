import pytest
import os
import pandas as pd
from backend.app.engine.scoring import compute_opportunity_score
from backend.app.engine.confidence import calculate_confidence_score
from backend.app.engine.explainability import generate_recommendation_rationale
from backend.app.finance.engine import calculate_financial_twin, calculate_loan_emi
from backend.app.finance.scenarios import generate_what_if_simulations
from backend.app.schemes.matcher import match_schemes_for_opportunity, calculate_readiness_score
from backend.app.ingestion.quality import run_data_quality_checks
from ml.features.engineering import compute_normalized_features
from scripts.profile_datasets import run_dataset_profiler

def test_dataset_profiler():
    profiles = run_dataset_profiler()
    assert len(profiles) > 0
    assert os.path.exists("data/reports/dataset_profile.json")
    assert os.path.exists("data/reports/dataset_profile.md")

def test_data_quality_engine():
    df_sample = pd.DataFrame({
        "state": ["Andhra Pradesh", "Telangana"],
        "district": ["Anantapur", "Nizamabad"],
        "demand_index": [85.0, 88.0],
        "latitude": [14.68, 18.78],
        "longitude": [77.45, 78.28]
    })
    q_report = run_data_quality_checks(df_sample, "sample.csv")
    assert q_report["quality_rating"] == "HIGH"
    assert q_report["score"] == 100

def test_feature_engineering_normalized():
    df_sample = pd.DataFrame({
        "demand_index": [85.0],
        "competition_density": [38.0],
        "resource_score": [78.0],
        "infra_score": [75.0]
    })
    feat_df = compute_normalized_features(df_sample)
    assert "feat_demand_score" in feat_df.columns
    assert "feat_market_opportunity" in feat_df.columns
    assert 0 <= feat_df["feat_market_opportunity"].iloc[0] <= 100

def test_opportunity_scoring_and_rationale():
    profile = {
        "available_capital": 150000.0,
        "experience_level": "some experience",
        "skills": ["agriculture", "food processing"],
        "village": "Kudair",
        "district": "Anantapur"
    }
    business = {
        "investment_min": 120000,
        "investment_max": 250000,
        "required_skills": ["food processing"],
        "growth_potential": "HIGH",
        "risk_level": "LOW"
    }
    market_data = {
        "demand_index": 85.0,
        "competition_density": 38.0,
        "resource_score": 78.0,
        "infra_score": 75.0
    }

    res = compute_opportunity_score(profile, business, market_data)
    assert "final_score" in res
    assert 0 <= res["final_score"] <= 100
    assert res["final_score"] > 70.0

    rationale = generate_recommendation_rationale(profile, business, market_data, res)
    assert len(rationale["why_recommended"]) > 0
    assert len(rationale["why_alternatives_lower"]) > 0

def test_financial_twin_and_loan_emi():
    emi = calculate_loan_emi(50000, 9.5, 36)
    assert 1500 < emi < 1700

    res = calculate_financial_twin(
        initial_investment=120000,
        working_capital=35000,
        selling_price=170,
        units_sold=500,
        variable_cost_per_unit=93.5,
        fixed_cost_per_month=15000,
        loan_amount=50000,
        interest_rate_annual=9.5,
        loan_tenure_months=36
    )

    assert res["monthly_revenue"] == 85000.0
    assert res["monthly_gross_profit"] == 38250.0
    assert res["monthly_net_profit"] > 0
    assert res["break_even_units"] > 0
    assert res["roi_percent"] > 0

def test_scenario_simulator():
    base_dict = {
        "initial_investment": 120000,
        "working_capital": 35000,
        "selling_price_per_unit": 170,
        "units_sold_per_month": 500,
        "variable_cost_per_unit": 93.5,
        "fixed_cost_per_month": 15000,
        "loan_amount": 50000
    }
    sims = generate_what_if_simulations(base_dict, custom_sales_pct=-20.0, custom_cost_pct=15.0)
    assert "base_case" in sims
    assert "stress_case" in sims
    assert sims["optimistic_case"]["net_profit"] > sims["base_case"]["net_profit"]
    assert sims["stress_case"]["net_profit"] < sims["base_case"]["net_profit"]

def test_scheme_matching_and_readiness():
    profile = {
        "name": "Ramesh Kumar",
        "district": "Anantapur",
        "village": "Kudair",
        "skills": ["agriculture"],
        "available_capital": 150000
    }
    schemes = match_schemes_for_opportunity(profile, "biz_01", "Food Processing", 120000)
    assert schemes["total_matched"] > 0

    readiness = calculate_readiness_score(profile, {"investment_min": 120000, "required_skills": ["agriculture"]}, ["Aadhaar Card", "PAN Card"])
    assert 0 <= readiness["overall_readiness_score"] <= 100
