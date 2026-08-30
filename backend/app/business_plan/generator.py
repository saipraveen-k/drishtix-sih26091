"""
DrishtiX 20-Section Structured Business Plan Generator
Combines deterministic financial twin calculations with retrieved market data and scheme insights.
"""

from typing import Dict, Any, List
from datetime import datetime
from backend.app.finance.engine import calculate_financial_twin
from backend.app.schemes.matcher import match_schemes_for_opportunity

def generate_business_plan_document(
    profile: Dict[str, Any],
    business: Dict[str, Any],
    market_data: Dict[str, Any],
    financial_data: Dict[str, Any] = None
) -> Dict[str, Any]:

    biz_name = business.get("name", "Rural Micro-Enterprise")
    ent_name = profile.get("name", "Rural Entrepreneur")
    village = profile.get("village", "Village")
    district = profile.get("district", "District")
    state = profile.get("state", "State")

    # Ensure financial calculations
    if not financial_data:
        inv = business.get("investment_min", 100000)
        w_cap = business.get("working_capital", 25000)
        typical_rev = business.get("typical_cost_structure", {}).get("typical_monthly_revenue", 75000)
        units = 500
        price = typical_rev / units if units > 0 else 150
        var_cost = price * 0.55
        fixed_cost = typical_rev * 0.20
        financial_data = calculate_financial_twin(
            initial_investment=inv,
            working_capital=w_cap,
            selling_price=price,
            units_sold=units,
            variable_cost_per_unit=var_cost,
            fixed_cost_per_month=fixed_cost,
            loan_amount=max(0, inv - profile.get("available_capital", 50000))
        )

    # Matched schemes
    schemes_res = match_schemes_for_opportunity(profile, business.get("id", ""), business.get("category", ""), financial_data["initial_investment"])
    matched_schemes_list = [s["name"] for s in schemes_res.get("schemes", [])[:2]]
    matched_schemes_str = ", ".join(matched_schemes_list) if matched_schemes_list else "PMEGP / MUDRA Scheme"

    sections = [
        {
            "section_number": 1,
            "title": "1. Executive Summary",
            "content": f"{biz_name} is a high-potential rural micro-enterprise proposed by {ent_name} in {village}, {district}, {state}. The business addresses growing local demand for {business.get('category').lower()} products, operating with an initial setup capital of ₹{financial_data['initial_investment']:,.0f} and projected monthly net profit of ₹{financial_data['monthly_net_profit']:,.0f}."
        },
        {
            "section_number": 2,
            "title": "2. Business Overview",
            "content": f"{business.get('description')} The unit will be established in {village} to serve local retail customers, weekly markets (haats), and regional institutional buyers."
        },
        {
            "section_number": 3,
            "title": "3. Entrepreneur Profile",
            "content": f"Promoter Name: {ent_name} | Age: {profile.get('age', 28)} | Location: {village}, {district} | Experience: {profile.get('experience_level', 'Beginner').capitalize()} | Primary Skills: {', '.join(profile.get('skills', ['General Agriculture']))}."
        },
        {
            "section_number": 4,
            "title": "4. Local Market Analysis",
            "content": f"Location Demand Index: {market_data.get('demand_index', 75)}/100 | Population Base: {market_data.get('population', 15000):,} residents | Nearest Major Market: {market_data.get('nearest_market_km', 5)} km | Road Connectivity: {market_data.get('road_connectivity', 'Good')}."
        },
        {
            "section_number": 5,
            "title": "5. Opportunity Analysis",
            "content": f"DrishtiX Opportunity Score: {business.get('score', 84)}/100 (High Confidence). Key recommendation drivers include strong local demand, accessible raw material supply, and manageable capital requirements."
        },
        {
            "section_number": 6,
            "title": "6. Products & Services",
            "content": f"Primary offerings include {business.get('name')} with standardized local packaging, quality assurance, and competitive pricing tailored for rural households."
        },
        {
            "section_number": 7,
            "title": "7. Target Customers",
            "content": f"Primary target audience comprises rural households in {district}, local retail stores, sweet shops, weekly haats, and agricultural cooperatives."
        },
        {
            "section_number": 8,
            "title": "8. Competition Analysis",
            "content": f"Local Competition Density Index: {market_data.get('competition_density', 40)}/100 (Moderate). The business will differentiate through superior freshness, direct-from-source pricing, and prompt delivery."
        },
        {
            "section_number": 9,
            "title": "9. Operations & Infrastructure Plan",
            "content": f"Required Infrastructure: {', '.join(business.get('infrastructure_requirements', ['Single-phase power shed']))}. Raw Material Requirements: {', '.join(business.get('resource_requirements', ['Local agricultural produce']))}."
        },
        {
            "section_number": 10,
            "title": "10. Investment Requirement",
            "content": f"Initial Fixed Investment: ₹{financial_data['initial_investment']:,.0f} | Working Capital Reserve: ₹{financial_data['working_capital']:,.0f} | Total Project Cost: ₹{financial_data['initial_investment'] + financial_data['working_capital']:,.0f}.",
            "is_financial_table": True,
            "table_data": {"Fixed Capital": financial_data['initial_investment'], "Working Capital": financial_data['working_capital'], "Total": financial_data['initial_investment'] + financial_data['working_capital']}
        },
        {
            "section_number": 11,
            "title": "11. Working Capital Cycle",
            "content": f"Estimated 30-day operating cycle for inventory procurement, processing, and receivables collection from local vendors."
        },
        {
            "section_number": 12,
            "title": "12. Revenue Assumptions",
            "content": f"Monthly Revenue: ₹{financial_data['monthly_revenue']:,.0f} based on estimated monthly sales volume."
        },
        {
            "section_number": 13,
            "title": "13. Expense Assumptions",
            "content": f"Monthly Variable Costs: ₹{financial_data['monthly_variable_costs']:,.0f} | Monthly Fixed Costs: ₹{financial_data['monthly_fixed_costs']:,.0f} | Loan EMI: ₹{financial_data['monthly_loan_emi']:,.0f}."
        },
        {
            "section_number": 14,
            "title": "14. Financial Projections & Cash Flow",
            "content": f"Monthly Gross Profit: ₹{financial_data['monthly_gross_profit']:,.0f} | Monthly Net Profit: ₹{financial_data['monthly_net_profit']:,.0f} | Projected ROI: {financial_data['roi_percent']}% per annum.",
            "is_financial_table": True,
            "table_data": {"Gross Profit": financial_data['monthly_gross_profit'], "Net Profit": financial_data['monthly_net_profit'], "EMI": financial_data['monthly_loan_emi'], "ROI %": financial_data['roi_percent']}
        },
        {
            "section_number": 15,
            "title": "15. Break-Even Analysis",
            "content": f"Break-even Monthly Volume: {financial_data['break_even_units']} units | Break-even Monthly Revenue: ₹{financial_data['break_even_revenue']:,.0f}."
        },
        {
            "section_number": 16,
            "title": "16. Risk Analysis",
            "content": f"Risk Level: {business.get('risk_level', 'MEDIUM')} | Key risks include raw material price fluctuations, seasonal demand shifts, and power supply interruptions."
        },
        {
            "section_number": 17,
            "title": "17. Risk Mitigation Strategies",
            "content": f"Procure raw materials directly from local farmers during harvest peaks, maintain solar/generator power backup, and diversify retail channels."
        },
        {
            "section_number": 18,
            "title": "18. Financing Requirement",
            "content": f"Promoter Contribution: ₹{profile.get('available_capital', 50000):,.0f} | Proposed Debt / Loan Funding: ₹{max(0, financial_data['initial_investment'] - profile.get('available_capital', 50000)):,.0f}."
        },
        {
            "section_number": 19,
            "title": "19. Potential Government Scheme Support",
            "content": f"Relevant Schemes: {matched_schemes_str}. Potential credit-linked subsidy eligibility ranges from 25% to 35% under rural micro-enterprise incentives."
        },
        {
            "section_number": 20,
            "title": "20. Implementation & Launch Roadmap",
            "content": f"Month 1: Location finalization & PMEGP/MUDRA loan application | Month 2: Equipment procurement & electricity line setup | Month 3: Trial run & commercial launch in {village}."
        }
    ]

    return {
        "plan_id": f"plan_{int(datetime.utcnow().timestamp())}",
        "business_name": biz_name,
        "entrepreneur_name": ent_name,
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "sections": sections
    }
