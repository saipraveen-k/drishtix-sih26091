from fastapi import APIRouter
from backend.app.schemas.schemas import FinanceCalculateRequest, FinanceTwinResponse
from backend.app.finance.engine import calculate_financial_twin

router = APIRouter(prefix="/finance", tags=["Financial Digital Twin"])

@router.post("/calculate", response_model=FinanceTwinResponse)
def calculate_financial_metrics(req: FinanceCalculateRequest):
    res = calculate_financial_twin(
        initial_investment=req.initial_investment,
        working_capital=req.working_capital,
        selling_price=req.selling_price_per_unit,
        units_sold=req.units_sold_per_month,
        variable_cost_per_unit=req.variable_cost_per_unit,
        fixed_cost_per_month=req.fixed_cost_per_month,
        loan_amount=req.loan_amount,
        interest_rate_annual=req.interest_rate_annual,
        loan_tenure_months=req.loan_tenure_months
    )

    return FinanceTwinResponse(
        opportunity_id=req.opportunity_id,
        initial_investment=res["initial_investment"],
        working_capital=res["working_capital"],
        monthly_revenue=res["monthly_revenue"],
        monthly_variable_costs=res["monthly_variable_costs"],
        monthly_fixed_costs=res["monthly_fixed_costs"],
        monthly_gross_profit=res["monthly_gross_profit"],
        monthly_loan_emi=res["monthly_loan_emi"],
        monthly_net_profit=res["monthly_net_profit"],
        monthly_cash_flow=res["monthly_cash_flow"],
        break_even_units=res["break_even_units"],
        break_even_revenue=res["break_even_revenue"],
        roi_percent=res["roi_percent"],
        payback_months=res["payback_months"],
        risk_assessment=res["risk_assessment"],
        disclaimer=res["disclaimer"]
    )

@router.get("/{opportunity_id}", response_model=FinanceTwinResponse)
def get_default_finance(opportunity_id: str):
    default_req = FinanceCalculateRequest(
        opportunity_id=opportunity_id,
        initial_investment=120000.0,
        working_capital=35000.0,
        monthly_sales_revenue=85000.0,
        selling_price_per_unit=170.0,
        units_sold_per_month=500.0,
        variable_cost_per_unit=93.5,
        fixed_cost_per_month=15000.0,
        loan_amount=50000.0,
        interest_rate_annual=9.5,
        loan_tenure_months=36
    )
    return calculate_financial_metrics(default_req)
