import React, { useState } from 'react';
import { PIPELINE_SPECS } from '../../data/mockData';
import './FlowchartPage.css';

const FLOW_STAGES = [
  {
    id: 'stage-1',
    number: '01',
    category: 'HARDWARE & INGESTION',
    title: 'Wheel Optical / X-Ray Line Ingestion',
    latency: '12 ms',
    icon: '📷',
    type: 'process',
    badge: 'Station Camera',
    description: 'High-speed industrial optical camera & radioscopic X-ray line captures multi-angle alloy rim imagery synced with PLC machine shot timestamp.',
    inputs: ['Raw Wheel Specimen on Conveyor', 'Shot Trigger Pulse', 'Machine ID & Melt Heat #'],
    outputs: ['Calibrated Optical Surface Frame (2048x2048)', 'Density Radiograph', 'Normalized Specimen JSON'],
    modelSpecs: 'Hardware Triggered GigE Vision + Frame Grabber via OpenCV C++ Pipeline',
    safetyMargin: 'Hardware hardware buffer < 15ms latency ceiling',
  },
  {
    id: 'stage-2',
    number: '02',
    category: 'COMPUTER VISION AI',
    title: 'Defect Detection & Spatial Localization',
    latency: '38 ms',
    icon: '🎯',
    type: 'process',
    badge: 'YOLOv8-Edge',
    description: 'Spatial bounding box detection and pixel-level semantic segmentation identifying casting cracks, gas porosities, shrinkage cavities, and edge burrs.',
    inputs: ['Normalized Optical / Radiograph Frame', 'Wheel Geometry Template (19" 8.5J)'],
    outputs: ['Defect Class (Crack, Porosity, Burr, Cavity)', 'Bounding Box Coordinates (x,y,w,h)', 'Confidence Probability (0.0 - 1.0)'],
    modelSpecs: 'TensorRT FP16 Optimized Convolutional Network on NVIDIA Jetson AGX / T4',
    safetyMargin: 'Critical defect recall benchmark: 99.2%',
  },
  {
    id: 'stage-3',
    number: '03',
    category: 'DECISION GATEWAY',
    title: 'Defect Presence Verification',
    latency: '2 ms',
    icon: '⚡',
    type: 'decision',
    badge: 'Edge Logic',
    description: 'Evaluates if any candidate defect exceeds the background threshold (>85% confidence). Routes clear specimens to nominal line clearance.',
    branches: [
      { label: 'Nominal Pass', condition: 'No defect detected or confidence < 0.15', route: 'Line Release & Powder Coating Clearance' },
      { label: 'Defect Detected', condition: 'Confidence >= 0.85', route: 'Proceed to Dual-Stage Severity Engine' },
    ],
  },
  {
    id: 'stage-4',
    number: '04',
    category: 'STRUCTURAL ASSESSMENT',
    title: 'Dual-Stage Severity Classifier',
    latency: '8 ms',
    icon: '⚖️',
    type: 'process',
    badge: 'SAE J328 Rules',
    description: 'Assesses fatigue risk and structural safety under SAE J328 & ISO standards. Categorizes into Low (cosmetic rework) vs Critical (immediate scrap).',
    inputs: ['Defect Geometry & Surface Area (mm²)', 'Wheel Zone Location (Hub, Spoke, Rim Lip)', 'Alloy Composition (A356.2-T6)'],
    outputs: ['Disposition: IMMEDIATE_SCRAP vs ROBOTIC_REWORK vs LINE_RELEASE', 'Containment Urgency Level'],
    modelSpecs: 'Deterministic Geometric Rule Engine + Multi-Layer Perceptron',
    safetyMargin: 'Zero-tolerance safety escape protocol for radial wheel cracks',
  },
  {
    id: 'stage-5',
    number: '05',
    category: 'SCADA / IOT INGESTION',
    title: 'Process Telemetry Synchronization',
    latency: '5 ms',
    icon: '📊',
    type: 'process',
    badge: 'OPC-UA / MQTT',
    description: 'Ingests synchronized real-time casting and machining parameters: die temperatures, hydraulic injection pressures, plunger shot speeds, and degassing flows.',
    inputs: ['OPC-UA Sensor Streams', 'Die Thermocouple Array (640-710°C)', 'Hydraulic Transducers', 'Spindle Accelerometers'],
    outputs: ['Normalized Parameter Vector (6 Process Features)', 'Z-Score Anomaly Indicators'],
    modelSpecs: 'TimescaleDB / Kafka Real-Time Ingest Pipeline (100Hz telemetry)',
    safetyMargin: 'Sensor drift alert tolerance: +/- 3 sigma',
  },
  {
    id: 'stage-6',
    number: '06',
    category: 'EXPLAINABLE AI',
    title: 'Explainable Root Cause Analysis (RCA)',
    latency: '22 ms',
    icon: '🔍',
    type: 'process',
    badge: 'TreeSHAP Attribution',
    description: 'Physics-informed tabular ML model explains the root-cause by attributing exact percentage contributions to casting or machining telemetry anomalies.',
    inputs: ['Synchronized Telemetry Feature Vector', 'Defect Type Classification', 'Historical Anomaly Matrices'],
    outputs: ['Primary Root Cause Diagnostic', 'SHAP Attribution Impact Weights (%)', 'Confidence Score'],
    modelSpecs: 'LightGBM Classifier + FastTreeSHAP Exact Feature Attribution Engine',
    safetyMargin: 'Physically plausible bounds verification against casting thermodynamics',
  },
  {
    id: 'stage-7',
    number: '07',
    category: 'PREDICTIVE ML',
    title: 'Predictive Defect Risk Forecasting',
    latency: '15 ms',
    icon: '🔮',
    type: 'process',
    badge: 'Temporal Risk',
    description: 'Forecasts probability of subsequent defect recurrence over the next 50 cycles and computes the continuous machine health degradation index.',
    inputs: ['Past 10-cycle Machine Telemetry Trend', 'Tool Wear Index / Plunger Sleeve Friction', 'Thermal Drift Velocity'],
    outputs: ['Future Risk Score (0.00 - 1.00)', 'Machine Health Status (HEALTHY, DEGRADED, CRITICAL)', 'Estimated Cycles Until Next Failure'],
    modelSpecs: 'Temporal Convolutional Network (TCN) + Weibull Survival Estimator',
    safetyMargin: 'Early warning trigger when risk exceeds 0.55 threshold',
  },
  {
    id: 'stage-8',
    number: '08',
    category: 'CLOSED-LOOP MES',
    title: 'Prescriptive Countermeasures & SOP',
    latency: '10 ms',
    icon: '🛡️',
    type: 'endpoint',
    badge: 'MES Dispatch',
    description: 'Auto-generates Standard Operating Procedure (SOP) work orders, locks affected production batches in MES quarantine pool, and dispatches maintenance alerts.',
    inputs: ['RCA Diagnostic Output', 'Risk Forecast Horizon', 'Active Batch Traceability ID'],
    outputs: ['SOP Work Order Code (e.g., SOP-AL-CAST-071)', 'MES Batch Quarantine Lock', 'Crew Dispatch Notification'],
    modelSpecs: 'Rule-Based Expert System + MES REST Webhook Dispatcher',
    safetyMargin: 'Guaranteed quarantine lockout within 250ms of critical defect detection',
  },
];

export default function FlowchartPage({ onLaunchDashboard }) {
  const [selectedStage, setSelectedStage] = useState(FLOW_STAGES[1]);
  const [activeSimulationIndex, setActiveSimulationIndex] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStartSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveSimulationIndex(0);
    setSelectedStage(FLOW_STAGES[0]);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < FLOW_STAGES.length) {
        setActiveSimulationIndex(current);
        setSelectedStage(FLOW_STAGES[current]);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setActiveSimulationIndex(-1);
      }
    }, 1200);
  };

  return (
    <div className="flowchart-page-container">
      {/* Header Banner */}
      <div className="flowchart-header">
        <div className="flowchart-badge">
          <span className="pulse-dot pulse-pass"></span>
          <span>DETERMINISTIC INFERENCE WORKFLOW</span>
        </div>
        <h1 className="flowchart-title">Quality Inspection Flowchart</h1>
        <p className="flowchart-subtitle">
          Sub-second deterministic workflow spanning high-speed optical ingestion, vision AI, explainable root-cause telemetry, and closed-loop MES containment.
        </p>

        {/* Latency & Accuracy KPI Bar */}
        <div className="flowchart-kpis-strip">
          <div className="kpi-box">
            <span className="kpi-value">&lt; 108 ms</span>
            <span className="kpi-label">Total End-to-End Latency</span>
          </div>
          <div className="kpi-box">
            <span className="kpi-value text-cyan">38 ms</span>
            <span className="kpi-label">Vision Edge Inference</span>
          </div>
          <div className="kpi-box">
            <span className="kpi-value text-emerald">99.2%</span>
            <span className="kpi-label">Defect Recall Standard</span>
          </div>
          <div className="kpi-box">
            <span className="kpi-value text-amber">8 Stages</span>
            <span className="kpi-label">Deterministic Pipeline</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flowchart-controls-row">
          <button
            className={`btn ${isSimulating ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleStartSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <>
                <span className="spinner-mini"></span>
                Simulating Inspection Pulse...
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Simulate Specimen Flow
              </>
            )}
          </button>

          {onLaunchDashboard && (
            <button className="btn btn-secondary" onClick={onLaunchDashboard}>
              Open Inspection Cockpit →
            </button>
          )}
        </div>
      </div>

      {/* Main Flowchart & Detail Pane Split */}
      <div className="flowchart-workspace-grid">
        {/* Left Column: Visual Interactive Flowchart Nodes */}
        <div className="flowchart-diagram-col">
          <div className="diagram-scroll-wrapper">
            {FLOW_STAGES.map((stage, idx) => {
              const isSelected = selectedStage.id === stage.id;
              const isSimActive = activeSimulationIndex === idx;

              return (
                <React.Fragment key={stage.id}>
                  {/* Flowchart Node Card */}
                  <div
                    className={`flow-node-card ${stage.type} ${isSelected ? 'selected' : ''} ${isSimActive ? 'sim-active' : ''}`}
                    onClick={() => setSelectedStage(stage)}
                  >
                    <div className="node-card-left">
                      <div className="node-step-badge">{stage.number}</div>
                      <div className="node-icon">{stage.icon}</div>
                    </div>

                    <div className="node-card-body">
                      <div className="node-meta-row">
                        <span className="node-category">{stage.category}</span>
                        <span className="node-badge-chip">{stage.badge}</span>
                      </div>
                      <h3 className="node-title">{stage.title}</h3>
                      <p className="node-desc">{stage.description}</p>

                      {stage.type === 'decision' && stage.branches && (
                        <div className="decision-branches-preview">
                          {stage.branches.map((b, bIdx) => (
                            <div key={bIdx} className="branch-pill">
                              <span className="branch-dot"></span>
                              <strong>{b.label}:</strong> {b.route}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="node-card-right">
                      <div className="node-latency-pill">
                        <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {stage.latency}
                      </div>
                    </div>
                  </div>

                  {/* Flowchart Connector Line / Arrow */}
                  {idx < FLOW_STAGES.length - 1 && (
                    <div className={`flow-connector-bar ${isSimActive ? 'pulse-forward' : ''}`}>
                      <div className="connector-line"></div>
                      <div className="connector-arrow">▼</div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Stage Deep-Dive Inspector */}
        <div className="flowchart-inspector-col">
          <div className="inspector-sticky-card">
            <div className="inspector-header">
              <div>
                <span className="inspector-eyebrow">NODE {selectedStage.number} SPECIFICATION</span>
                <h2 className="inspector-title">{selectedStage.title}</h2>
              </div>
              <div className="inspector-latency-tag">
                {selectedStage.latency}
              </div>
            </div>

            <div className="inspector-section">
              <label className="inspector-label">ENGINE & MODEL SPECIFICATION</label>
              <div className="spec-highlight-box">
                {selectedStage.modelSpecs || 'Deterministic Logic Execution'}
              </div>
            </div>

            <div className="inspector-section">
              <label className="inspector-label">FUNCTIONAL OVERVIEW</label>
              <p className="inspector-text">{selectedStage.description}</p>
            </div>

            {selectedStage.inputs && (
              <div className="inspector-section">
                <label className="inspector-label">INPUT DATA STREAM</label>
                <ul className="spec-list">
                  {selectedStage.inputs.map((inItem, i) => (
                    <li key={i}>
                      <span className="bullet bullet-in">▶</span>
                      {inItem}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedStage.outputs && (
              <div className="inspector-section">
                <label className="inspector-label">OUTPUT CONTRACTS & PAYLOAD</label>
                <ul className="spec-list">
                  {selectedStage.outputs.map((outItem, i) => (
                    <li key={i}>
                      <span className="bullet bullet-out">✓</span>
                      {outItem}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedStage.safetyMargin && (
              <div className="inspector-section">
                <label className="inspector-label">FAIL-SAFE & QUALITY GUARANTEE</label>
                <div className="failsafe-box">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{selectedStage.safetyMargin}</span>
                </div>
              </div>
            )}

            <div className="inspector-footer">
              <button
                className="btn btn-secondary btn-block"
                onClick={() => {
                  const currentIdx = FLOW_STAGES.findIndex((s) => s.id === selectedStage.id);
                  const nextIdx = (currentIdx + 1) % FLOW_STAGES.length;
                  setSelectedStage(FLOW_STAGES[nextIdx]);
                }}
              >
                Inspect Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
