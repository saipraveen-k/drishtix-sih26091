export interface ProfileData {
  name: string;
  age?: number;
  gender?: string;
  language?: string;
  available_capital: number;
  expected_investment: number;
  desired_loan_amount: number;
  experience_level: string;
  existing_business: boolean;
  business_goal: string;
  state: string;
  district: string;
  block?: string;
  village: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  skills: string[];
  interests: string[];
}

export interface FactorBreakdown {
  factor_name: string;
  weight_pct: number;
  score: number;
  description: string;
}

export interface OpportunityItem {
  business_id: string;
  business_name: string;
  category: string;
  description: string;
  score: number;
  confidence: number;
  confidence_level: string;
  investment_min: number;
  investment_max: number;
  working_capital: number;
  demand: string;
  competition: string;
  skill_fit: string;
  risk: string;
  score_breakdown: FactorBreakdown[];
  why_recommended: string[];
  why_alternatives_lower: string[];
  assumptions: string[];
  data_sources: { name: string; type: string; freshness: string }[];
}

export interface RecommendationResponse {
  user_location: string;
  total_analyzed: number;
  recommendations: OpportunityItem[];
}

export interface FinanceCalculateRequest {
  opportunity_id: string;
  initial_investment: number;
  working_capital: number;
  monthly_sales_revenue: number;
  selling_price_per_unit: number;
  units_sold_per_month: number;
  variable_cost_per_unit: number;
  fixed_cost_per_month: number;
  loan_amount: number;
  interest_rate_annual: number;
  loan_tenure_months: number;
}

export interface FinanceTwinResponse {
  opportunity_id: string;
  initial_investment: number;
  working_capital: number;
  monthly_revenue: number;
  monthly_variable_costs: number;
  monthly_fixed_costs: number;
  monthly_gross_profit: number;
  monthly_loan_emi: number;
  monthly_net_profit: number;
  monthly_cash_flow: number;
  break_even_units: number;
  break_even_revenue: number;
  roi_percent: number;
  payback_months: number;
  risk_assessment: string;
  disclaimer: string;
}

export interface ScenarioOutput {
  scenario_name: string;
  monthly_revenue: number;
  monthly_expenses: number;
  net_profit: number;
  cash_flow: number;
  break_even_units: number;
  risk_level: string;
}

export interface WhatIfSimulationResponse {
  base_case: ScenarioOutput;
  optimistic_case: ScenarioOutput;
  realistic_case: ScenarioOutput;
  stress_case: ScenarioOutput;
  custom_scenario: ScenarioOutput;
}

export interface SchemeItem {
  scheme_id: string;
  name: string;
  nodal_agency: string;
  relevance_reason: string;
  eligibility_status: string;
  potential_benefit: string;
  required_documents: string[];
  description: string;
}

export interface ReadinessScoreResponse {
  overall_readiness_score: number;
  profile_readiness: number;
  business_readiness: number;
  financial_readiness: number;
  document_readiness: number;
  eligibility_readiness: number;
  missing_requirements: string[];
  document_checklist: Record<string, boolean>;
}

export interface BusinessPlanSection {
  section_number: number;
  title: string;
  content: string;
  is_financial_table?: boolean;
  table_data?: Record<string, unknown>;
}

export interface BusinessPlanResponse {
  plan_id: string;
  business_name: string;
  entrepreneur_name: string;
  generated_at: string;
  sections: BusinessPlanSection[];
}

export interface NormalizeBusinessResponse {
  user_entered_business: string;
  canonical_business_id: string;
  canonical_business_name: string;
  category: string;
  is_custom: boolean;
}

export interface WhyReasonItem {
  type: string;
  text: string;
}

export interface SuitabilityMetrics {
  interest_level: string;
  personal_fit: number;
  market_fit: number;
  financial_fit: number;
  overall_score: number;
}

export interface DataTransparencyInfo {
  data_source: string;
  source_year: string;
  geographic_coverage: string;
  freshness: string;
  confidence: string;
  proxy_status: string;
}

export interface InterestedBusinessEval {
  user_entered_business: string;
  canonical_business_id: string;
  canonical_business_name: string;
  category: string;
  description: string;
  opportunity_score: number;
  confidence_score: number;
  confidence_level: string;
  fit_level: string;
  investment_min: number;
  investment_max: number;
  working_capital: number;
  factors: Record<string, number>;
  score_breakdown: FactorBreakdown[];
  why_reasons: WhyReasonItem[];
  suitability_metrics: SuitabilityMetrics;
  data_transparency: DataTransparencyInfo;
}

export interface AlternativeBusinessItem {
  business_id: string;
  business_name: string;
  category: string;
  description: string;
  opportunity_score: number;
  confidence_score: number;
  fit_level: string;
  investment_min: number;
  investment_max: number;
  working_capital: number;
  factors: Record<string, number>;
  why_better: string[];
  score_breakdown: FactorBreakdown[];
}

export interface ComparisonFactorItem {
  factor_key: string;
  label: string;
  user_choice_score: number;
  best_alt_score: number;
}

export interface ComparisonSummary {
  best_alternative: {
    business_id: string;
    business_name: string;
    opportunity_score: number;
  };
  factor_matrix: ComparisonFactorItem[];
}

export interface InterestEvaluateResponse {
  interested_business: InterestedBusinessEval;
  alternatives: AlternativeBusinessItem[];
  comparison: ComparisonSummary;
}

export interface JourneyStateResponse {
  user_id: string;
  interested_business_name: string;
  interested_business_id: string;
  selected_business_id: string;
  selected_business_name: string;
  selection_source: "user_interest" | "recommended_alternative" | string;
  opportunity_score: number;
  confidence_level: string;
  updated_at: string;
}

