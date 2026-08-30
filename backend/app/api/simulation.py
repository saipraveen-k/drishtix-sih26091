from fastapi import APIRouter
from backend.app.schemas.schemas import SimulationRequest, WhatIfSimulationResponse
from backend.app.finance.scenarios import generate_what_if_simulations

router = APIRouter(prefix="/simulation", tags=["What-If Stress Simulator"])

@router.post("", response_model=WhatIfSimulationResponse)
def run_what_if_simulation(req: SimulationRequest):
    base_dict = req.base_finance.model_dump()
    sim_results = generate_what_if_simulations(base_dict, req.sales_change_pct, req.cost_change_pct)

    return WhatIfSimulationResponse(
        base_case=sim_results["base_case"],
        optimistic_case=sim_results["optimistic_case"],
        realistic_case=sim_results["realistic_case"],
        stress_case=sim_results["stress_case"],
        custom_scenario=sim_results["custom_scenario"]
    )
