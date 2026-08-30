import {
  ProfileData,
  RecommendationResponse,
  OpportunityItem,
  FinanceCalculateRequest,
  FinanceTwinResponse,
  WhatIfSimulationResponse,
  SchemeItem,
  ReadinessScoreResponse,
  BusinessPlanResponse
} from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn("Backend API fetch error, using local fallback data:", err);
    throw err;
  }
}

export const api = {
  // Profile
  getProfile: () => fetchJSON<ProfileData>("/profile"),
  saveProfile: (data: ProfileData) =>
    fetchJSON<ProfileData>("/profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Location
  searchLocations: (q: string) => fetchJSON<any[]>(`/locations/search?q=${encodeURIComponent(q)}`),
  getMarketData: (locId: string) => fetchJSON<any>(`/market/${locId}`),

  // Opportunities
  getRecommendations: (profile: ProfileData) =>
    fetchJSON<RecommendationResponse>("/opportunities/recommend", {
      method: "POST",
      body: JSON.stringify({ profile }),
    }),
  getOpportunityDetails: (id: string) => fetchJSON<OpportunityItem>(`/opportunities/${id}`),

  // Finance Twin
  calculateFinance: (req: FinanceCalculateRequest) =>
    fetchJSON<FinanceTwinResponse>("/finance/calculate", {
      method: "POST",
      body: JSON.stringify(req),
    }),

  // What-If Simulation
  runSimulation: (base_finance: FinanceCalculateRequest, sales_change_pct: number, cost_change_pct: number) =>
    fetchJSON<WhatIfSimulationResponse>("/simulation", {
      method: "POST",
      body: JSON.stringify({ base_finance, sales_change_pct, cost_change_pct }),
    }),

  // Schemes & Readiness
  matchSchemes: (profile: ProfileData, business_id: string, category: string, investment_required: number) =>
    fetchJSON<{ business_id: string; total_matched: number; schemes: SchemeItem[] }>("/schemes/match", {
      method: "POST",
      body: JSON.stringify({ profile, business_id, category, investment_required }),
    }),
  calculateReadiness: (profile: ProfileData, business_id: string, provided_documents: string[]) =>
    fetchJSON<ReadinessScoreResponse>("/readiness/calculate", {
      method: "POST",
      body: JSON.stringify({ profile, business_id, provided_documents }),
    }),

  // Business Plan
  generateBusinessPlan: (profile: ProfileData, opportunity_id: string) =>
    fetchJSON<BusinessPlanResponse>("/business-plan/generate", {
      method: "POST",
      body: JSON.stringify({ profile, opportunity_id }),
    }),

  // Copilot
  chatCopilot: (question: string, context?: any, language: string = "en") =>
    fetchJSON<{ answer: string; sources_used: string[]; suggested_followups: string[] }>("/copilot/chat", {
      method: "POST",
      body: JSON.stringify({ question, context, language }),
    }),

  // Admin
  getAdminMetrics: () => fetchJSON<any>("/admin/metrics"),
  rerunDataPipeline: () => fetchJSON<any>("/admin/rerun-pipeline", { method: "POST" }),
};
