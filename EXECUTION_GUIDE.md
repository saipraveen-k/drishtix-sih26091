# DrishtiX — Execution & Demo Guide (SIH26091)

This guide provides step-by-step instructions to set up prerequisites, run the FastAPI backend server, start the Next.js frontend application, run automated backend and frontend tests, and execute the complete **Interest-Led Business Discovery & Decision Journey**.

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:

1. **Python 3.10+** (with `pip` package manager)
2. **Node.js 18.0+** (with `npm` package manager)
3. **Git** (for version control)

---

## ⚙️ 1. Environment Setup

### A. Backend Setup
1. Open a terminal in the project root directory (`c:\tempp\projects\DRISHTIX`).
2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Verify environment configuration:
   - Ensure `.env` or defaults are set (uses SQLite database `drishtix.db` by default).

### B. Frontend Setup
1. Open a terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install frontend Node modules:
   ```bash
   npm install
   ```

---

## 🚀 2. Running the Application

### Step 1: Start the Backend API Server
Run the Uvicorn ASGI server from the project root:
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **API Base URL**: `http://127.0.0.1:8000/api`
- **Interactive Swagger OpenAPI Docs**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/health`

### Step 2: Start the Next.js Frontend App
In a separate terminal, navigate to the `frontend` folder and start the Next.js development server:
```bash
cd frontend
npm run dev
```
- **Web App URL**: `http://localhost:3000`

---

## 🧪 3. Running Automated Tests

### Run Backend Pytest Suite
From the root directory, execute:
```bash
python -m pytest
```
- **Expected Output**: `15 passed in ~4.5s`
- **Coverage**: Tests business normalization, 7-factor composite scoring engine, alternative ranking, side-by-side comparison, and journey selection state persistence.

### Run Frontend Type Check & Production Build
From the `frontend` directory, execute:
```bash
cd frontend
npm run build
```
- **Expected Output**: `✓ Compiled successfully`, `✓ Generating static pages (15/15)`.

---

## 🎯 4. Step-by-Step Execution Guide: Primary User Journey

Follow this scenario to demonstrate the complete **Interest-Led Business Discovery & Decision Flow**:

### Step 1: Profile & Business Interest Onboarding (`/onboarding`)
1. Open your browser and navigate to `http://localhost:3000/onboarding`.
2. Fill out the 7 onboarding sections:
   - **SECTION 1 (Goal)**: Select *"Start a New Business"*.
   - **SECTION 2 (Skills)**: Select chips *"Agriculture"* and *"Food Processing"*.
   - **SECTION 3 (Experience)**: Select *"1–3 years"*.
   - **SECTION 4 (Capital)**: Select *"₹1 Lakh"* or enter custom `150000` (Funding gap calculated automatically as ₹50,000).
   - **SECTION 5 (Location)**: Set State: `Andhra Pradesh`, District: `Anantapur`, Block: `Kudair`, Village: `Kudair`.
   - **SECTION 6 (Resources)**: Select *"Land"*, *"Equipment"*, *"Raw Materials"*.
   - **SECTION 7 (Business Interest)**: Type or select **`Restaurant`**.
3. Click **`EVALUATE MY BUSINESS INTEREST →`**.

---

### Step 2: Interest Analysis & Alternatives Screen (`/discover`)
1. The page evaluates your chosen business (`Restaurant`):
   - **Score**: `61.4 / 100` (*Promising Fit*).
   - Displays 7-factor breakdown bars & *"Why does DrishtiX give this score?"*.
   - Displays **Interest vs Suitability Radar**: User Interest (High), Personal Fit (82.0), Market Fit (88.0), Financial Fit (79.0).
2. Scroll to **"Businesses you may be even better suited for"**:
   - Displays Top 4 alternatives ranked deterministically:
     - #1 **Millet Processing & Packaging** (`91.2 / 100`) — *Best Fit*
     - #2 **Solar Agri Food Dehydration Unit** (`87.5 / 100`)
     - #3 **Mini Dairy & Milk Product Processing** (`83.1 / 100`)
     - #4 **Agri Equipment Rental Center** (`79.0 / 100`)
3. Review **"How does your choice compare?"** side-by-side comparison table.
4. Reach the **Entrepreneur Decision Point**:
   - **Option A**: Click **`EXPLORE BETTER MATCH (Millet Processing & Packaging)`**.
   - **Option B**: Click **`CONTINUE WITH MY BUSINESS (Restaurant)`**.

---

### Step 3: Complete Downstream Business Journey
Whichever option you choose, the application launches the full downstream journey:

1. **Opportunity Details (`/opportunities/[id]`)**:
   - Shows detailed 7-factor fit metrics, data freshness (2026-Q1), and verified source citations.
2. **Financial Simulator (`/finance/[id]`)**:
   - Interactive financial twin calculating monthly revenue, variable/fixed costs, EMI (₹1,605/mo), ROI (28.4%), break-even units, and cash flow.
3. **Stress Scenario (`/simulation/[id]`)**:
   - Simulates -20% sales drop and +15% cost increases to test business resilience under stress.
4. **Government Schemes (`/schemes`)**:
   - Matches PMEGP (35% subsidy) and MUDRA loans with "Potentially eligible" badges.
5. **Application Readiness (`/readiness`)**:
   - Evaluates bankability score (88%) and document checklist.
6. **20-Section Business Plan / DPR (`/business-plan`)**:
   - Generates complete, printable Detailed Project Report for bank submission.
7. **90-Day Launch Roadmap & Dashboard (`/dashboard`)**:
   - Renders active journey status, selection source badge (`Selection: DrishtiX Recommendation` vs `Selection: Your Choice`), 90-day phase-by-phase execution timeline, and a **"Why Not My Original Business?"** switch-back panel.

---

## 🎙️ 5. Voice Interaction & Multilingual Demo

1. Click the floating **Ask DrishtiX** button at the bottom-right corner.
2. Select or speak a query in **English**, **Hindi (हिंदी)**, or **Telugu (తెలుగు)**:
   - *"मुझे डेयरी फार्मिंग में रुचि है"* (Hindi)
   - *"నాకు మిల్లెట్ ప్రాసెసింగ్లో ఆసక్తి ఉంది"* (Telugu)
3. The system shows a **Voice Confirmation Modal**:
   > *"You said you are interested in: Mini Dairy & Milk Product Processing"*  
   > **`[Confirm & Evaluate]`** | **`[Change]`**
4. Click **`[Confirm & Evaluate]`** to launch the analysis for the confirmed business!
