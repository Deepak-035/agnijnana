# AI-Based Automotive Wheel / Rim Quality Intelligence System

**SINGULARITY 2026 — Track 3**

## Project Scope
This system is an industrial Quality Intelligence platform built specifically for **aluminium alloy automotive wheels and rims**.

Aluminium alloy wheels undergo high-pressure die casting, heat treatment, CNC machining, and painting. Structural defects (such as shrinkage cavities, inclusions, casting cracks, gas porosity, and machining burrs) compromise vehicle safety and can lead to structural wheel failure under dynamic road loading.

This platform provides an end-to-end industrial quality pipeline:
```
Aluminium Wheel/Rim 
  ➔ Image Inspection 
  ➔ Defect Detection 
  ➔ Defect Classification 
  ➔ Defect Localization 
  ➔ Severity Assessment (Low vs Critical) 
  ➔ Process / Production Data 
  ➔ Root-Cause Analysis 
  ➔ Future Defect Risk Prediction 
  ➔ Corrective-Action Recommendation 
  ➔ Affected Batch / Machine Alerts 
  ➔ Quality Intelligence Dashboard
```

---

## Core Objectives
1. **Wheel Defect Detection & Localization**: Detect and localize surface and casting defects on aluminium alloy wheel/rim images with spatial bounding coordinates and confidence scores.
2. **Defect Severity Assessment**: Classify detected wheel defects into `Low` (cosmetic/reworkable) or `Critical` (structural defect requiring wheel rejection/scrap).
3. **Process Root-Cause Analysis (RCA)**: Correlate wheel casting/machining defects with production process parameters (casting batch, machine station, temperature, pressure, speed, vibration, cycle time) to identify the probable operational root cause with confidence.
4. **Predictive Defect Risk Forecasting**: Analyze historical casting batches and equipment telemetry to forecast impending defect risks for specific machines and subsequent production cycles.
5. **Quality Intelligence Dashboard**: Deliver a unified cockpit for plant quality engineers answering:
   - *What went wrong?*
   - *Where is the defect on the wheel rim?*
   - *How severe is it?*
   - *Why did it probably happen?*
   - *How confident is the diagnosis?*
   - *What is likely to go wrong next?*
   - *What corrective action should the engineer take?*
6. **Corrective Action Recommendations**: Prescribe actionable industrial countermeasures (e.g., mould maintenance, degassing check, thermal recalibration).
7. **Batch & Machine Alerts**: Dispatch instant notifications for affected casting batches and flag high-risk machines.
8. **Industrial Safety & Security**: Enforce role-based access control, strict input validation, and data leakage prevention.

---

## Team Ownership

| Member | Role | Responsibilities |
| :--- | :--- | :--- |
| **Ashish** | Backend / FastAPI Lead | FastAPI architecture, REST endpoints (`/inspection`, `/defects`, `/root-cause`, etc.), AI model serving, DB integration, Auth/RBAC, payload validation. |
| **Ganesh** | Frontend / UI Lead | React + Vite Wheel Quality Dashboard, wheel inspection viewer, defect overlays, severity/root-cause/risk visualization, operator UX. |
| **Deepak** | Database Lead | PostgreSQL schema design, `wheels`, `casting batches`, `machines`, `production cycles`, `process_data`, `defects`, `predictions`, `alerts`. |
| **Vijeth** | Data + AI/ML Lead | Aluminium wheel dataset acquisition, preprocessing, defect detection model, severity mapping, tabular RCA model, risk forecasting, inference export. |

**Shared**: Documentation, Integration testing, CI/CD pipeline, End-to-end deployment.

---

## Repository Structure

```
automotive-wheel-quality-intelligence/
├── README.md                   # Project overview & guidelines
├── .gitignore                  # Exclusions for model weights, datasets, venv
├── .env.example                # Environment variable configuration
├── docker-compose.yml          # Container orchestration (PostgreSQL, FastAPI, React)
├── docs/                       # Specifications and architecture docs
│   ├── architecture/           # System design and wheel inspection data flow
│   ├── dataset/                # Wheel dataset documentation and data dictionary
│   ├── models/                 # Defect detection, severity, RCA, and risk plans
│   └── api/                    # REST API interface specification
├── data/                       # Datasets (ignored in version control)
│   ├── raw/                    # Raw wheel imagery and process logs
│   ├── processed/              # Normalized and split datasets
│   ├── annotations/            # Bounding box / mask annotations
│   └── sample/                 # Sample images for integration testing
├── ai/                         # Machine learning modules (owned by Vijeath)
│   ├── defect_detection/       # Wheel defect localization (YOLO / Detectron / etc.)
│   ├── severity/               # Low vs Critical severity classifier
│   ├── root_cause/             # Process parameter attribution & explainability
│   ├── risk_prediction/        # Machine / batch failure risk forecasting
│   └── recommendation/         # Corrective action recommendation engine
├── backend/                    # FastAPI web application (owned by Ashish)
│   ├── app/
│   │   ├── api/                # Endpoints (/inspection, /defects, /root-cause, /risk, etc.)
│   │   ├── core/               # Configuration settings and CORS
│   │   ├── schemas/            # Pydantic schemas (Wheel AI Contract)
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── database/           # DB engine and session handling
│   │   ├── services/           # Business logic and AI service adapters
│   │   ├── auth/               # Access control and security
│   │   └── main.py             # FastAPI entrypoint
│   ├── tests/                  # Backend unit & health tests
│   ├── requirements.txt
│   └── README.md
├── frontend/                   # React + Vite application (owned by Ganesh)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # WheelInspection, DefectViewer, SeverityCard, RootCause, etc.
│   │   ├── pages/              # Dashboard, Inspection, Batches, Machines
│   │   ├── services/           # API client
│   │   ├── App.jsx             # Shell layout with focused inspection flow
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/                   # Database schemas and migrations (owned by Deepak)
│   ├── schema/schema.sql       # Wheel-specific PostgreSQL schema
│   ├── migrations/             # Migration scripts
│   ├── seeds/                  # Seed scripts
│   └── README.md
├── notebooks/                  # Exploratory data analysis & experiments
├── tests/                      # Integration and End-to-End test suites
└── .github/workflows/ci.yml    # Continuous Integration pipeline
```

---

## Technology Stack
- **Frontend**: React 18, Vite, Vanilla CSS
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn
- **Database**: PostgreSQL 15+, SQLAlchemy
- **AI/ML**: Python (PyTorch / OpenCV / Scikit-learn / LightGBM)
- **Containerization**: Docker, Docker Compose

---

## Current Status
**SKELETON / FOUNDATION PHASE (WHEEL-FOCUSED)**
*No AI models have been trained or downloaded. No fake datasets or mock predictions have been generated. Exact defect classes and sensor telemetry fields will be finalized once Vijeath verifies the physical wheel datasets.*

---

## Setup Instructions

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger API docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Dashboard: `http://localhost:5188`

### 4. Database Setup
```bash
docker-compose up -d db
psql -U quality_user -d quality_db -f database/schema/schema.sql
```
