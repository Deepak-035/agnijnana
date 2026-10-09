# Frontend Application — Aluminium Wheel Quality Cockpit (React + Vite)

## 1. Overview
- **Owner**: Ganesh (Frontend/UI Lead)
- **Role**: Plant operator and quality engineer cockpit providing real-time visual inspection of aluminium alloy wheels, severity breakdown, root cause analysis, predictive machine/batch risk visualization, and automated alert management.
- **Current Status**: SKELETON / FOUNDATION PHASE — Dashboard layout and UI component structure tailored to aluminium wheel quality intelligence.

## 2. Component Organization
- `src/components/WheelInspection/`: Interactive wheel inspection upload and analysis trigger
- `src/components/DefectViewer/`: Wheel surface image & bounding box localization viewer
- `src/components/SeverityCard/`: Wheel defect severity classification indicator (Low vs Critical)
- `src/components/RootCause/`: Casting process parameters & root cause breakdown card
- `src/components/RiskPrediction/`: Casting machine risk score and failure probability gauge
- `src/components/Recommendation/`: Recommended corrective actions for die-casting / machining
- `src/components/Alerts/`: Active wheel batch quarantine alerts and notifications
- `src/components/BatchTable/`: Aluminium casting batch summary & yield tracking
- `src/components/MachineStatus/`: Die-casting machine & CNC line equipment health status
- `src/pages/`: Main application pages (`Dashboard`, `Inspection`, `Batches`, `Machines`)
- `src/services/api.js`: REST client for backend API communication

## 3. Running Locally
```bash
npm install
npm run dev
```
Development server will be active at `http://localhost:5188`.
