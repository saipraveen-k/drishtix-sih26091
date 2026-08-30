"""
DrishtiX Deterministic Financial Digital Twin Engine
Pure Python mathematical engine for exact financial metrics, break-even analysis, and loan amortization.
"""

import math
from typing import Dict, Any

def calculate_loan_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> float:
    if principal <= 0 or tenure_months <= 0:
        return 0.0
    r = (annual_rate_pct / 100.0) / 12.0
    if r == 0:
        return principal / tenure_months
    emi = (principal * r * ((1 + r) ** tenure_months)) / (((1 + r) ** tenure_months) - 1)
    return round(emi, 2)

def calculate_financial_twin(
    initial_investment: float,
    working_capital: float,
    selling_price: float,
    units_sold: float,
    variable_cost_per_unit: float,
    fixed_cost_per_month: float,
    loan_amount: float = 0.0,
    interest_rate_annual: float = 9.5,
    loan_tenure_months: int = 36
) -> Dict[str, Any]:

    # 1. Revenue
    monthly_revenue = round(units_sold * selling_price, 2)

    # 2. Costs
    monthly_variable_costs = round(units_sold * variable_cost_per_unit, 2)
    monthly_fixed_costs = round(fixed_cost_per_month, 2)
    monthly_total_op_costs = monthly_variable_costs + monthly_fixed_costs

    # 3. Gross Profit
    monthly_gross_profit = round(monthly_revenue - monthly_variable_costs, 2)

    # 4. Loan EMI
    monthly_emi = calculate_loan_emi(loan_amount, interest_rate_annual, loan_tenure_months)

    # 5. Net Profit
    monthly_net_profit = round(monthly_gross_profit - monthly_fixed_costs - monthly_emi, 2)

    # 6. Cash Flow
    monthly_cash_flow = monthly_net_profit # Net cash generation

    # 7. Break-Even Analysis
    contribution_margin = selling_price - variable_cost_per_unit
    if contribution_margin > 0:
        total_fixed_burden = monthly_fixed_costs + monthly_emi
        break_even_units = math.ceil(total_fixed_burden / contribution_margin)
        break_even_revenue = round(break_even_units * selling_price, 2)
    else:
        break_even_units = 999999.0
        break_even_revenue = 999999.0

    # 8. ROI %
    total_capital = initial_investment + working_capital
    if total_capital > 0:
        annual_net_profit = monthly_net_profit * 12.0
        roi_percent = round((annual_net_profit / total_capital) * 100.0, 1)
    else:
        roi_percent = 0.0

    # 9. Payback Period
    if monthly_net_profit > 0:
        payback_months = round(total_capital / monthly_net_profit, 1)
    else:
        payback_months = 999.0

    # 10. Risk Level
    if monthly_net_profit > (monthly_revenue * 0.15) and units_sold >= (break_even_units * 1.3):
        risk = "LOW"
    elif monthly_net_profit > 0 and units_sold >= break_even_units:
        risk = "MEDIUM"
    else:
        risk = "HIGH"

    return {
        "initial_investment": initial_investment,
        "working_capital": working_capital,
        "monthly_revenue": monthly_revenue,
        "monthly_variable_costs": monthly_variable_costs,
        "monthly_fixed_costs": monthly_fixed_costs,
        "monthly_gross_profit": monthly_gross_profit,
        "monthly_loan_emi": monthly_emi,
        "monthly_net_profit": monthly_net_profit,
        "monthly_cash_flow": monthly_cash_flow,
        "break_even_units": break_even_units,
        "break_even_revenue": break_even_revenue,
        "roi_percent": roi_percent,
        "payback_months": payback_months,
        "risk_assessment": risk,
        "disclaimer": "Estimated based on provided user assumptions and deterministic Python cost models."
    }
