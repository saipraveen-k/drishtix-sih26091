"""
DrishtiX What-If Scenario Simulator Engine
Generates financial recalculations across Base, Optimistic, Realistic, Stress, and Custom Scenarios.
"""

from typing import Dict, Any
from backend.app.finance.engine import calculate_financial_twin

def run_scenario(
    base_params: Dict[str, Any],
    sales_delta_pct: float = 0.0,
    cost_delta_pct: float = 0.0,
    price_delta_pct: float = 0.0,
    name: str = "Custom"
) -> Dict[str, Any]:

    units = base_params.get("units_sold_per_month", 100) * (1.0 + (sales_delta_pct / 100.0))
    price = base_params.get("selling_price_per_unit", 50) * (1.0 + (price_delta_pct / 100.0))
    var_cost = base_params.get("variable_cost_per_unit", 25) * (1.0 + (cost_delta_pct / 100.0))
    fixed_cost = base_params.get("fixed_cost_per_month", 10000) * (1.0 + (cost_delta_pct / 100.0))
    
    inv = base_params.get("initial_investment", 100000)
    w_cap = base_params.get("working_capital", 25000)
    loan = base_params.get("loan_amount", 0)
    rate = base_params.get("interest_rate_annual", 9.5)
    tenure = base_params.get("loan_tenure_months", 36)

    res = calculate_financial_twin(
        initial_investment=inv,
        working_capital=w_cap,
        selling_price=price,
        units_sold=units,
        variable_cost_per_unit=var_cost,
        fixed_cost_per_month=fixed_cost,
        loan_amount=loan,
        interest_rate_annual=rate,
        loan_tenure_months=tenure
    )

    return {
        "scenario_name": name,
        "monthly_revenue": res["monthly_revenue"],
        "monthly_expenses": round(res["monthly_variable_costs"] + res["monthly_fixed_costs"] + res["monthly_loan_emi"], 2),
        "net_profit": res["monthly_net_profit"],
        "cash_flow": res["monthly_cash_flow"],
        "break_even_units": res["break_even_units"],
        "risk_level": res["risk_assessment"]
    }

def generate_what_if_simulations(base_params: Dict[str, Any], custom_sales_pct: float = -20.0, custom_cost_pct: float = 15.0) -> Dict[str, Any]:
    base_case = run_scenario(base_params, 0.0, 0.0, 0.0, "Base Case")
    optimistic_case = run_scenario(base_params, 20.0, -5.0, 5.0, "Optimistic (+20% Sales)")
    realistic_case = run_scenario(base_params, 5.0, 2.0, 0.0, "Realistic (+5% Growth)")
    stress_case = run_scenario(base_params, -20.0, 15.0, 0.0, "Stress Case (-20% Sales, +15% Costs)")
    custom_scenario = run_scenario(base_params, custom_sales_pct, custom_cost_pct, 0.0, f"Custom ({custom_sales_pct}% Sales, {custom_cost_pct}% Costs)")

    return {
        "base_case": base_case,
        "optimistic_case": optimistic_case,
        "realistic_case": realistic_case,
        "stress_case": stress_case,
        "custom_scenario": custom_scenario
    }
