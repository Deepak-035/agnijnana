import React, { useState } from 'react';
import { SAMPLE_WHEELS } from '../../data/mockData';
import './Landing.css';

export default function Landing({ onLaunchDashboard, onOpenFlowchart, onSelectSample }) {
  const [activeDefectIndex, setActiveDefectIndex] = useState(0);
  const sample = SAMPLE_WHEELS[activeDefectIndex];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-orb hero-glow-1"></div>
        <div className="hero-glow-orb hero-glow-2"></div>

        <div className="hero-container">
          <div className="hero-badge">
            <span className="pulse-dot pulse-pass"></span>
            <span>ALUMINIUM ALLOY WHEEL & RIM INTELLIGENCE</span>
          </div>

          <h1 className="hero-title">
            AI Quality Intelligence for{' '}
            <span className="gradient-text">Aluminium Wheels</span>
          </h1>

          <p className="hero-description">
            Automated defect detection, root-cause analysis, and predictive scrap prevention for automotive alloy wheels.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={onLaunchDashboard}>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Open Inspection Cockpit
            </button>
            <button className="btn btn-secondary btn-lg" onClick={onOpenFlowchart}>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
              Quality Inspection Flowchart →
            </button>
          </div>

          {/* Quick Stat Strip */}
          <div className="hero-stats-grid">
            <div className="hero-stat-card">
              <div className="stat-value">&lt; 38 ms</div>
              <div className="stat-label">Inference Latency</div>
              <div className="stat-sub">Real-time edge localization</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-value text-cyan">99.2%</div>
              <div className="stat-label">Critical Recall</div>
              <div className="stat-sub">Zero defect escape rate</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-value text-emerald">-38%</div>
              <div className="stat-label">Scrap Reduction</div>
              <div className="stat-sub">Early process drift detection</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-value text-amber">100%</div>
              <div className="stat-label">Lot Traceability</div>
              <div className="stat-sub">Melt heat to finished rim</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Defect Showcase */}
      <section className="showcase-section">
        <div className="section-header">
          <div className="section-eyebrow">LIVE DEFECT PRESETS</div>
          <h2 className="section-heading">Multi-Modal Defect Inspection</h2>
          <p className="section-sub">
            Cycle through simulated specimens across casting, machining, and rim finishing lines.
          </p>
        </div>

        <div className="preset-tabs-row">
          {SAMPLE_WHEELS.map((w, idx) => (
            <button
              key={w.wheel_id}
              className={`preset-tab-pill ${activeDefectIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveDefectIndex(idx)}
            >
              <span className={`status-indicator-dot ${w.status === 'PASS' || w.status === 'PASSED' || !w.defect ? 'dot-pass' : 'dot-crit'}`}></span>
              <span className="mono">{w.wheel_id}</span>
              <span className="tab-defect-name">{w.defect ? w.defect.defect_type : 'Nominal Pass'}</span>
            </button>
          ))}
        </div>

        {/* Selected Sample Deep Dive */}
        <div className="glass-panel showcase-card">
          <div className="showcase-grid">
            {/* Visual Preview */}
            <div className="showcase-visual-wrapper">
              <div className="showcase-mock-rim">
                <svg viewBox="0 0 300 300" className="mock-rim-svg">
                  <circle cx="150" cy="150" r="140" fill="#0f172a" stroke="#334155" strokeWidth="12" />
                  <circle cx="150" cy="150" r="128" fill="#1e293b" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
                  <circle cx="150" cy="150" r="115" fill="#0b1329" stroke="#64748b" strokeWidth="4" />
                  
                  {/* Wheel Spokes */}
                  <g stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" opacity="0.9">
                    <line x1="150" y1="150" x2="150" y2="40" />
                    <line x1="150" y1="150" x2="255" y2="115" />
                    <line x1="150" y1="150" x2="215" y2="240" />
                    <line x1="150" y1="150" x2="85" y2="240" />
                    <line x1="150" y1="150" x2="45" y2="115" />
                  </g>
                  
                  <circle cx="150" cy="150" r="42" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="150" cy="150" r="14" fill="#0284c7" />

                  {/* Defect Bounding Box if not nominal pass */}
                  {sample.defect && (
                    <g className="showcase-defect-marker">
                      <rect
                        x={`${sample.defect.location.x * 2.6}`}
                        y={`${sample.defect.location.y * 2.6}`}
                        width={`${sample.defect.location.width * 2.6}`}
                        height={`${sample.defect.location.height * 2.6}`}
                        fill="rgba(239, 68, 68, 0.25)"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <circle
                        cx={`${(sample.defect.location.x + sample.defect.location.width / 2) * 2.6}`}
                        cy={`${(sample.defect.location.y + sample.defect.location.height / 2) * 2.6}`}
                        r="5"
                        fill="#ef4444"
                      />
                    </g>
                  )}
                </svg>

                <div className="showcase-status-badge">
                  {!sample.defect || sample.status === 'PASS' || sample.status === 'PASSED' ? (
                    <span className="badge-pass">PASS • NOMINAL RELEASE</span>
                  ) : (
                    <span className="badge-crit">DEFECT DETECTED • {sample.defect.severity.toUpperCase()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Specimen Telemetry Brief */}
            <div className="showcase-info-wrapper">
              <div className="showcase-header">
                <div>
                  <h3 className="showcase-title">{sample.wheel_model}</h3>
                  <div className="showcase-meta mono">
                    <span>{sample.wheel_id}</span> • <span>{sample.alloy}</span> • <span>{sample.rim_diameter}</span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectSample(activeDefectIndex)}
                >
                  Load in Cockpit →
                </button>
              </div>

              {sample.defect ? (
                <div className="showcase-defect-details">
                  <div className="detail-item">
                    <label>Defect Classification</label>
                    <div className="detail-value text-rose">{sample.defect.defect_type}</div>
                  </div>
                  <div className="detail-grid-2">
                    <div className="detail-item">
                      <label>Severity Level</label>
                      <div className="detail-value text-amber">{sample.defect.severity}</div>
                    </div>
                    <div className="detail-item">
                      <label>Confidence</label>
                      <div className="detail-value mono text-cyan">
                        {(sample.defect.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Structural Impact</label>
                    <p className="detail-desc">{sample.defect.safety_impact}</p>
                  </div>
                  <div className="detail-item">
                    <label>RCA Attributed Parameter</label>
                    <div className="detail-value text-emerald">{sample.rca.root_cause}</div>
                  </div>
                </div>
              ) : (
                <div className="showcase-pass-details">
                  <div className="pass-icon-check">✓</div>
                  <h4>Zero Anomaly Defect Free Specimen</h4>
                  <p>
                    All multi-angle camera scans and rim runout tolerances comply with SAE J328 fatigue and dimensional requirements.
                  </p>
                  <div className="pass-tags">
                    <span className="tag">Radial Runout: &lt; 0.3mm</span>
                    <span className="tag">Porosity Index: 0.00</span>
                    <span className="tag">Rim Balance: Nominal</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Pillars */}
      <section className="pillars-section">
        <div className="section-header">
          <div className="section-eyebrow">CORE CAPABILITIES</div>
          <h2 className="section-heading">End-to-End Quality Architecture</h2>
          <p className="section-sub">
            From casting defect localization to explainable telemetry attribution.
          </p>
        </div>

        <div className="pillars-grid">
          <div className="glass-panel pillar-card">
            <div className="pillar-icon icon-cyan">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20M2 12h20" />
              </svg>
            </div>
            <h3>Computer Vision</h3>
            <p>
              Localizes casting cracks, gas porosities, shrinkage voids, and machining edge burrs under 38ms.
            </p>
            <div className="pillar-meta mono">Edge Inference</div>
          </div>

          <div className="glass-panel pillar-card">
            <div className="pillar-icon icon-rose">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
              </svg>
            </div>
            <h3>Severity Classifier</h3>
            <p>
              Differentiates reworkable surface blemishes from fatal structural cracks under SAE J328 standards.
            </p>
            <div className="pillar-meta mono">Scrap Containment</div>
          </div>

          <div className="glass-panel pillar-card">
            <div className="pillar-icon icon-amber">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20V10M18 20V4M6 20v-4" />
              </svg>
            </div>
            <h3>Explainable RCA</h3>
            <p>
              Correlates machine parameters with SHAP attributions to identify exact die temperature or pressure drops.
            </p>
            <div className="pillar-meta mono">Root-Cause Analysis</div>
          </div>

          <div className="glass-panel pillar-card">
            <div className="pillar-icon icon-violet">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Prescriptive Actions</h3>
            <p>
              Generates maintenance instructions and SOP codes for quick parameter recalibration and tool replacement.
            </p>
            <div className="pillar-meta mono">SOP Generation</div>
          </div>

          <div className="glass-panel pillar-card">
            <div className="pillar-icon icon-emerald">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3>Batch Alerts</h3>
            <p>
              Dispatches instant alerts to isolate compromised casting batches before wheels reach paint and assembly lines.
            </p>
            <div className="pillar-meta mono">Automated Quarantine</div>
          </div>
        </div>
      </section>

      {/* Quality Inspection Flowchart Gateway Section */}
      <section id="flowchart-gateway" className="flowchart-gateway-section">
        <div className="glass-panel flowchart-gateway-card">
          <div className="flowchart-gateway-content">
            <div className="section-eyebrow">DETERMINISTIC PIPELINE</div>
            <h2 className="gateway-heading">Quality Inspection Flowchart</h2>
            <p className="gateway-description">
              Explore the sub-second deterministic inspection workflow. View how edge camera ingestion, spatial defect localization, TreeSHAP root-cause telemetry, and closed-loop MES containment operate synchronously.
            </p>

            <div className="gateway-metrics-row">
              <div className="gateway-metric">
                <span className="gateway-num text-cyan">&lt; 108 ms</span>
                <span className="gateway-lbl">Full Pipeline Latency</span>
              </div>
              <div className="gateway-metric">
                <span className="gateway-num text-emerald">99.2%</span>
                <span className="gateway-lbl">Critical Defect Recall</span>
              </div>
              <div className="gateway-metric">
                <span className="gateway-num text-amber">8 Nodes</span>
                <span className="gateway-lbl">Deterministic Stages</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={onOpenFlowchart}>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
              View Full Flowchart →
            </button>
          </div>

          <div className="flowchart-mini-preview" onClick={onOpenFlowchart}>
            <div className="mini-preview-header">
              <span className="pulse-dot pulse-pass"></span>
              <span>LIVE PIPELINE TOPOLOGY</span>
            </div>
            <div className="mini-step">
              <span className="mini-num">01</span>
              <span className="mini-title">Optical / X-Ray Line Ingestion</span>
              <span className="mini-latency">12ms</span>
            </div>
            <div className="mini-arrow">↓</div>
            <div className="mini-step active-step">
              <span className="mini-num">02</span>
              <span className="mini-title">AI Defect Detection & B-Box</span>
              <span className="mini-latency">38ms</span>
            </div>
            <div className="mini-arrow">↓</div>
            <div className="mini-step">
              <span className="mini-num">03</span>
              <span className="mini-title">Dual-Stage Severity Classification</span>
              <span className="mini-latency">8ms</span>
            </div>
            <div className="mini-arrow">↓</div>
            <div className="mini-step">
              <span className="mini-num">06</span>
              <span className="mini-title">Explainable TreeSHAP RCA</span>
              <span className="mini-latency">22ms</span>
            </div>
            <div className="mini-preview-overlay">
              <span>Click to Open Flowchart</span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Enterprise Footer */}
      <footer className="enterprise-landing-footer">
        <div className="footer-columns-grid">
          {/* Brand Info Column */}
          <div className="footer-col brand-col">
            <div className="footer-brand-title">
              <div className="footer-logo-icon">
                <svg viewBox="0 0 40 40" width="24" height="24" fill="none">
                  <circle cx="20" cy="20" r="16" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                  <circle cx="20" cy="20" r="10" stroke="#00f0ff" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="4" fill="#38bdf8" />
                </svg>
              </div>
              <span>WHEEL QUALITY INTELLIGENCE</span>
            </div>
            <p className="footer-brand-tagline">
              Inspect. Detect. Predict. Prevent.
            </p>
            <p className="footer-brand-description">
              AI-driven visual inspection, explainable root-cause telemetry attribution, and predictive scrap prevention for automotive aluminium alloy wheels & rims.
            </p>
          </div>

          {/* Platform Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-heading">PLATFORM</h4>
            <ul className="footer-links-list">
              <li><button onClick={onLaunchDashboard} className="footer-link-btn">Inspection Cockpit</button></li>
              <li><button onClick={onOpenFlowchart} className="footer-link-btn">Quality Inspection Flowchart</button></li>
              <li><a href="#showcase" className="footer-link-btn">Defect Presets & Taxonomy</a></li>
              <li><a href="#flowchart-gateway" className="footer-link-btn">Deterministic Pipeline</a></li>
            </ul>
          </div>

          {/* Industry Standards */}
          <div className="footer-col">
            <h4 className="footer-col-heading">INDUSTRY STANDARDS</h4>
            <ul className="footer-links-list">
              <li><span className="footer-static-item">SAE J328 Radial Fatigue</span></li>
              <li><span className="footer-static-item">ISO 3002 Machining Tolerances</span></li>
              <li><span className="footer-static-item">ASTM E155 Casting Reference</span></li>
              <li><span className="footer-static-item">IATF 16949 Automotive Quality</span></li>
            </ul>
          </div>

          {/* System Telemetry & Performance */}
          <div className="footer-col">
            <h4 className="footer-col-heading">SYSTEM HEALTH</h4>
            <div className="footer-health-card">
              <div className="health-row">
                <span className="health-label">Inference Engine:</span>
                <span className="health-val text-cyan">TensorRT FP16</span>
              </div>
              <div className="health-row">
                <span className="health-label">Latency Ceiling:</span>
                <span className="health-val text-emerald">&lt; 38 ms</span>
              </div>
              <div className="health-row">
                <span className="health-label">Recall Benchmark:</span>
                <span className="health-val text-amber">99.2%</span>
              </div>
              <div className="health-status-badge">
                <span className="pulse-dot pulse-pass"></span>
                <span>ZERO ESCAPE PROTOCOL ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © 2026 Wheel Quality Intelligence Systems. Industrial Vision Automation.
          </div>
          <div className="footer-bottom-links">
            <span>Automotive Wheel Quality Platform</span>
            <span>•</span>
            <span>Production Grade Deployment</span>
            <span>•</span>
            <button className="footer-link-btn" onClick={onLaunchDashboard}>Launch Console</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
