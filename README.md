# DRISHTIX — Hyper-Local Entrepreneurship Intelligence

**Smart India Hackathon 2026** | **Problem Statement Code: SIH26091**  
*AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs*

---

## 🚀 Core Product Idea

**DrishtiX is NOT a generic chatbot.** It is a personalized rural entrepreneurship decision-support platform.

> *"Instead of asking an entrepreneur what business they want to start, DrishtiX discovers what business they are most likely to succeed in."*

### The Core Transformation Workflow:
```
USER PROFILE + LOCATION + LOCAL MARKET DATA + COMPETITION + RESOURCE AVAILABILITY + CAPITAL + SKILLS + EXPERIENCE
                                                         ↓
                                         DRISHTIX DECISION ENGINE
                                                         ↓
       TOP OPPORTUNITIES + EXPLAINABLE SCORES + FINANCIAL DIGITAL TWIN + WHAT-IF SIMULATION + SCHEME READINESS + BUSINESS PLAN
```

---

## ⚙️ Architecture & Tech Stack

### Frontend:
- **Next.js 14+ App Router** (TypeScript, React 18)
- **Tailwind CSS** (Custom Slate/Emerald/Blue modern dark mode UI)
- **Lucide Icons**
- **Recharts** (Scenario comparison charts & score breakdowns)
- **Leaflet / React-Leaflet** (Interactive OpenStreetMap GIS layer)

### Backend & API:
- **Python 3.10+ / FastAPI**
- **Pydantic v2** (Strict data validation)
- **SQLAlchemy 2.0 & Alembic** (PostgreSQL / SQLite compatibility)
- **JWT & Passlib / Bcrypt** (Secure Auth & Role-ready architecture)

### Financial & Scoring Engine:
- Pure Python mathematical cost structure engine (ROI, Break-Even, Loan Amortization, What-If Stress Testing) — **Zero LLM reliance for calculations**.

### AI & RAG Layer:
- **Provider Abstraction**: Supports **Gemini API**, **OpenAI API**, and **Mock Provider Fallback** (ensures 100% functionality without API keys).
- **RAG Architecture**: FAISS / Vector JSON store over government scheme and policy documents with explicit source metadata citations.

---

## 📁 Folder Structure

```
drishtix/
├── backend/
│   └── app/
│       ├── api/            # REST API Routes (Auth, Profile, Opportunities, Finance, Simulation, Schemes, Copilot)
│       ├── core/           # Config, Security, Database session
│       ├── db/             # DB migrations
│       ├── engine/         # 7-Factor Explainable Scoring & Confidence Engine
│       ├── finance/        # Deterministic Financial Twin & Scenario Simulator
│       ├── models/         # SQLAlchemy ORM models
│       ├── rag/            # Vector store retrieval engine
│       ├── schemas/        # Pydantic validation models
│       └── main.py         # FastAPI App Entrypoint
│
├── frontend/               # Next.js App Router Frontend
│   ├── src/
│   │   ├── app/            # Routes (/, /onboarding, /opportunities, /finance, /simulation, /schemes, /business-plan, /copilot, /admin)
│   │   ├── components/     # Navbar, Footer, OpportunityCard, MapComponent, CopilotDrawer
│   │   ├── lib/            # Typed API Client (api.ts)
│   │   └── types/          # TypeScript interfaces
│
├── data/                   # Dataset-Agnostic Data Directory
│   ├── raw/                # Raw incoming CSV/JSON/Excel/Parquet files
│   ├── processed/          # Normalized & cleaned datasets
│   ├── features/           # Location composite indicators
│   ├── schema_mapping.yaml # Configurable column alias mapping
│   └── README.md
│
├── rag/
│   └── documents/          # Vector indexed government scheme documents
│
├── scripts/                # Data Pipeline Automation Scripts
│   ├── validate_data.py    # Schema inspector & quality report generator
│   ├── process_data.py     # Data cleaning & normalization
│   ├── build_features.py   # Location indicator feature engineering
│   ├── build_embeddings.py # Vector embedding generator
│   └── ingest_data.py      # Master ingestion pipeline
│
├── tests/                  # Pytest backend test suite
├── docker/                 # Container Dockerfiles
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📊 Dataset-Agnostic Ingestion & Data Drop-In Guide

DrishtiX is built to consume real datasets without requiring frontend code changes.

### Step-by-Step Dataset Drop-In Instructions for Tomorrow:

1. **Place raw dataset file(s)** into `data/raw/`:
   ```bash
   # Supported formats: .csv, .json, .xlsx, .parquet
   cp your_new_market_data.csv data/raw/
   ```

2. **Update Column Mappings (if column names differ)** in `data/schema_mapping.yaml`:
   ```yaml
   column_mappings:
     latitude: [lat, LATITUDE, Latitude]
     demand_index: [local_demand, demand_score, Demand]
     district: [district_name, District]
   ```

3. **Run Validation & Schema Inspection**:
   ```bash
   python scripts/validate_data.py --input data/raw/your_new_market_data.csv
   ```
   *Generates Data Quality Report (HIGH / MEDIUM / LOW rating, missing value %, duplicates count).*

4. **Execute Master Data Ingestion Pipeline**:
   ```bash
   python scripts/ingest_data.py
   ```
   *Automatically cleans data, computes features, generates vector embeddings, and populates the recommendation engine!*

---

## 💻 Quick Start & Running Locally

### 1. Backend Setup:
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Run Data Ingestion Pipeline
python scripts/ingest_data.py

# Run Pytest Backend Unit Tests
python -m pytest tests/test_backend.py

# Start FastAPI Backend Server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
*Swagger API Docs available at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Setup:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js Development Server
npm run dev
```
*Frontend running at `http://localhost:3000`.*

---

## 🐳 Running with Docker Compose

```bash
# Build & start PostgreSQL, Backend, and Frontend containers
docker-compose up --build
```

---

## 🏆 SIH Winning 3-Minute Presentation & Demo Script

Follow this step-by-step flow for the SIH judges:

1. **Start on Landing Page (`/`)**: Highlight the core statement: *"Instead of asking what business to start, DrishtiX discovers what business you are most likely to succeed in."*
2. **Onboarding (`/onboarding`)**: Enter Profile (Capital: ₹1.5 Lakh, Location: Kudair, Anantapur, Skills: Agriculture & Food Processing). Click **"Discover My Opportunities"**.
3. **Opportunity Dashboard (`/opportunities`)**: Show **TOP 3 Ranked Opportunities** (#1 Millet Processing 86/100, #2 Spice Grinding 81/100, #3 Mini Dairy 74/100).
4. **Explainable Score (`/opportunities/biz_millet_01`)**: Show 7-Factor Radar Breakdown, *"Why Recommended?"* bullets, and *"Why Alternatives Scored Lower?"*.
5. **Financial Digital Twin (`/finance/biz_millet_01`)**: Demonstrate deterministic Python cost calculations (Monthly Revenue ₹85k, Net Profit ₹21.6k, Break-even 218 units).
6. **What-If Stress Simulation (`/simulation/biz_millet_01`)**: Slide Sales -20% and Costs +15%. Show real-time financial survival comparison across Base, Optimistic, Realistic, and Stress cases.
7. **Scheme & Readiness (`/schemes`)**: Show matched government schemes (PMEGP 35% subsidy, Mudra) and Document Compliance Score (78%).
8. **Generate Business Plan (`/business-plan`)**: Display the official 20-Section Detailed Project Report (DPR) ready for bank submission.
9. **AI Copilot (`/copilot`)**: Click Copilot chip *"Why did you recommend this business?"* or ask in Telugu/Hindi to demonstrate multilingual decision support.

---

## 📜 License
Smart India Hackathon 2026 Prototype • Built for Rural Micro-Entrepreneurship Empowerment.
