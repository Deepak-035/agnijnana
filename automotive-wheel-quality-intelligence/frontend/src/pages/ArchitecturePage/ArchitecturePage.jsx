import React from 'react';
import { PIPELINE_SPECS } from '../../data/mockData';
import './ArchitecturePage.css';

export default function ArchitecturePage({ onLaunchDashboard }) {
  return (
    <div className="architecture-page-layout">
      <div className="page-header-strip">
        <div>
          <div className="section-eyebrow">ENTERPRISE ARCHITECTURE</div>
          <h2 className="page-main-heading">System Architecture & Data Contracts</h2>
          <p className="page-sub-heading">
            API schemas and pipeline contracts for the wheel & tyre quality system.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onLaunchDashboard}>
          Open Cockpit →
        </button>
      </div>

      {/* Contracts & Schemas Matrix */}
      <div className="arch-cards-grid">
        <div className="glass-panel arch-card">
          <h3 className="arch-card-title">1. Vision Defect Output Contract</h3>
          <p className="arch-card-desc">
            Output schema for spatial localization:
          </p>
          <pre className="arch-code-block mono">
{`{
  "wheel_id": "WH-8041-A356",
  "defect_detected": true,
  "defect_type": "Rim Casting Crack",
  "location": { "x": 68, "y": 22, "width": 14, "height": 18 },
  "defect_confidence": 0.968,
  "zone": "Outer Rim Bead (2 o'clock)",
  "dimensions": { "length_mm": 18.4, "depth_est_mm": 2.8 }
}`}
          </pre>
        </div>

        <div className="glass-panel arch-card">
          <h3 className="arch-card-title">2. Root-Cause & Risk Prediction Contract</h3>
          <p className="arch-card-desc">
            Output schema for root-cause and risk forecasting:
          </p>
          <pre className="arch-code-block mono">
{`{
  "wheel_id": "WH-8041-A356",
  "root_cause": "Premature Die Chilling (<610°C)",
  "root_cause_confidence": 0.924,
  "future_risk": 0.78,
  "recommended_action": "SOP-AL-CAST-042",
  "affected_batches": ["BATCH-AL-2026-X89"]
}`}
          </pre>
        </div>
      </div>

      {/* End-to-End Pipeline */}
      <div className="glass-panel pipeline-arch-container">
        <h3 className="arch-card-title">Industrial Quality Pipeline</h3>
        <div className="pipeline-flow-diagram">
          {PIPELINE_SPECS.architecture.map((s) => (
            <div key={s.step} className="flow-step-item">
              <div className="flow-step-dot">{s.step}</div>
              <div className="flow-step-title">{s.title}</div>
              <div className="flow-step-lat mono">{s.latency}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
