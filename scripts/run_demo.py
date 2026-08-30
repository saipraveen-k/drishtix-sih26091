import httpx
import json

base_url = "http://127.0.0.1:8000/api"

print("====================================================")
print(" DRISHTIX LIVE SIH DEMO JOURNEY EXECUTION")
print("====================================================\n")

# 1. Onboard Profile
profile = {
    "name": "Ramesh Kumar",
    "age": 29,
    "gender": "Male",
    "language": "en",
    "available_capital": 150000.0,
    "expected_investment": 200000.0,
    "desired_loan_amount": 50000.0,
    "experience_level": "some experience",
    "existing_business": False,
    "business_goal": "first business",
    "state": "Andhra Pradesh",
    "district": "Anantapur",
    "block": "Kudair",
    "village": "Kudair",
    "pincode": "515711",
    "latitude": 14.6819,
    "longitude": 77.4521,
    "skills": ["agriculture", "food processing"],
    "interests": ["food", "manufacturing"]
}
prof_resp = httpx.post(f"{base_url}/profile", json=profile).json()
print(f"[STEP 1 & 2] Profile Onboarded: {prof_resp['name']} in {prof_resp['village']}, {prof_resp['district']}")

# 2. Get Top 3 Recommendations
rec_resp = httpx.post(f"{base_url}/opportunities/recommend", json={"profile": profile}).json()
print("\n[STEP 5 & 6] TOP 3 BUSINESS OPPORTUNITIES GENERATED:")
for idx, r in enumerate(rec_resp["recommendations"], 1):
    print(f"  #{idx} {r['business_name']} | Score: {r['score']}/100 | Confidence: {r['confidence']}% ({r['confidence_level']}) | Capital: Rs.{r['investment_min']:,} - Rs.{r['investment_max']:,}")

top_biz = rec_resp["recommendations"][0]
print("\n[STEP 7] EXPLAINABILITY RATIONALE FOR TOP MATCH (#1):")
for w in top_biz["why_recommended"]:
    clean_w = str(w).replace("₹", "Rs.")
    print(f"  * {clean_w}")

# 3. Run Financial Digital Twin
fin_req = {
    "opportunity_id": top_biz["business_id"],
    "initial_investment": top_biz["investment_min"],
    "working_capital": top_biz["working_capital"],
    "monthly_sales_revenue": 85000.0,
    "selling_price_per_unit": 170.0,
    "units_sold_per_month": 500.0,
    "variable_cost_per_unit": 93.5,
    "fixed_cost_per_month": 15000.0,
    "loan_amount": 50000.0,
    "interest_rate_annual": 9.5,
    "loan_tenure_months": 36
}
fin_resp = httpx.post(f"{base_url}/finance/calculate", json=fin_req).json()
print("\n[STEP 8 & 9] FINANCIAL DIGITAL TWIN METRICS:")
print(f"  Monthly Revenue: Rs.{fin_resp['monthly_revenue']:,}")
print(f"  Monthly Net Profit: Rs.{fin_resp['monthly_net_profit']:,}")
print(f"  Break-Even Units: {fin_resp['break_even_units']} units/mo (Rs.{fin_resp['break_even_revenue']:,})")
print(f"  Projected ROI: {fin_resp['roi_percent']}% per annum")

# 4. Run What-If Simulation
sim_resp = httpx.post(f"{base_url}/simulation", json={"base_finance": fin_req, "sales_change_pct": -20.0, "cost_change_pct": 15.0}).json()
print("\n[STEP 10] WHAT-IF STRESS TESTING RESULTS:")
print(f"  Base Case Net Profit: Rs.{sim_resp['base_case']['net_profit']:,} ({sim_resp['base_case']['risk_level']} Risk)")
print(f"  Stress Case (-20% Sales, +15% Costs): Rs.{sim_resp['stress_case']['net_profit']:,} ({sim_resp['stress_case']['risk_level']} Risk)")

# 5. Scheme Matching
scheme_resp = httpx.post(f"{base_url}/schemes/match", json={"profile": profile, "business_id": top_biz["business_id"], "category": top_biz["category"], "investment_required": top_biz["investment_min"]}).json()
print("\n[STEP 11] MATCHED GOVERNMENT SCHEMES:")
for s in scheme_resp["schemes"]:
    benefit_clean = str(s['potential_benefit']).replace("₹", "Rs.")
    print(f"  * {s['name']} | Status: {s['eligibility_status']} | Benefit: {benefit_clean}")

# 6. Business Plan Generation
plan_resp = httpx.post(f"{base_url}/business-plan/generate", json={"profile": profile, "opportunity_id": top_biz["business_id"]}).json()
print("\n[STEP 12] 20-SECTION BUSINESS PLAN GENERATED:")
print(f"  Plan Ref: {plan_resp['plan_id']} | Sections: {len(plan_resp['sections'])}/20 complete.")

print("\n====================================================")
print(" DRISHTIX FULL-STACK DEMO JOURNEY EXECUTED SUCCESSFULLY!")
print("====================================================")
