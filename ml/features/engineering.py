"""
DrishtiX Feature Engineering Module (Step 5)
Computes 10 normalized (0-100) composite features for hyper-local decision intelligence.
"""

import pandas as pd
import numpy as np
from typing import Dict, Any

def compute_normalized_features(df: pd.DataFrame) -> pd.DataFrame:
    df_feat = df.copy()

    # 1. Demand Score (0-100)
    if 'demand_index' in df_feat.columns:
        df_feat['feat_demand_score'] = df_feat['demand_index'].clip(0, 100)
    else:
        df_feat['feat_demand_score'] = 75.0

    # 2. Competition Score (0-100, where higher means lower/safer competition)
    if 'competition_density' in df_feat.columns:
        df_feat['feat_competition_score'] = (100 - df_feat['competition_density']).clip(0, 100)
    else:
        df_feat['feat_competition_score'] = 60.0

    # 3. Resource Availability (0-100)
    if 'resource_score' in df_feat.columns:
        df_feat['feat_resource_availability'] = df_feat['resource_score'].clip(0, 100)
    else:
        df_feat['feat_resource_availability'] = 70.0

    # 4. Infrastructure Score (0-100)
    if 'infra_score' in df_feat.columns:
        df_feat['feat_infrastructure_score'] = df_feat['infra_score'].clip(0, 100)
    else:
        df_feat['feat_infrastructure_score'] = 65.0

    # 5. Market Opportunity Index (0-100)
    df_feat['feat_market_opportunity'] = np.round(
        0.50 * df_feat['feat_demand_score'] + 0.50 * df_feat['feat_competition_score'], 1
    )

    # 6. Growth Indicator (0-100)
    df_feat['feat_growth_indicator'] = np.round(
        0.60 * df_feat['feat_demand_score'] + 0.40 * df_feat['feat_resource_availability'], 1
    )

    # 7. Location Suitability (0-100)
    df_feat['feat_location_suitability'] = np.round(
        0.30 * df_feat['feat_demand_score'] +
        0.30 * df_feat['feat_infrastructure_score'] +
        0.20 * df_feat['feat_resource_availability'] +
        0.20 * df_feat['feat_competition_score'], 1
    )

    # 8. Capital Compatibility Default (0-100)
    df_feat['feat_capital_compatibility'] = 85.0

    # 9. Skill Compatibility Default (0-100)
    df_feat['feat_skill_compatibility'] = 80.0

    # 10. Risk Indicator (0-100, higher is safer)
    df_feat['feat_risk_indicator'] = np.round(
        0.50 * df_feat['feat_competition_score'] + 0.50 * df_feat['feat_infrastructure_score'], 1
    )

    return df_feat
