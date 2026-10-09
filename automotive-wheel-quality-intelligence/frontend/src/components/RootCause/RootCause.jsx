import React from 'react';
import './RootCause.css';

export default function RootCause({ wheel }) {
  const rca = wheel?.rca;

  if (!rca) {
    return (
      <div className="glass-panel col-6 root-cause-panel">
        <div className="rca-header">
          <div className="rca-title-wrap">
            <span className="section-eyebrow">PROCESS DIAGNOSTICS</span>
            <h3 className="rca-main-title">Root Cause Analysis (RCA)</h3>
          </div>
          <span className="badge badge-info mono">STANDBY</span>
        </div>
        <div className="rca-diagnosis-banner" style={{ borderStyle: 'dashed' }}>
          <div className="diagnosis-body">
            <span className="diagnosis-label">PRIMARY PROCESS ROOT CAUSE</span>
            <p className="diagnosis-text mono text-cyan">
              ⚡ Process causality engine ready. Ingest specimen image to compute telemetry parameter attribution.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel col-6 root-cause-panel">
      <div className="rca-header">
        <div className="rca-title-wrap">
          <span className="section-eyebrow">PROCESS DIAGNOSTICS</span>
          <h3 className="rca-main-title">Root Cause Analysis (RCA)</h3>
        </div>
        <div className="rca-confidence-chip">
          <span className="conf-label mono">ATTRIBUTION CONFIDENCE</span>
          <span className="conf-val mono">{(rca.confidence * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Primary Diagnosis Banner */}
      <div className="rca-diagnosis-banner">
        <div className="diagnosis-icon-ring">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="diagnosis-body">
          <span className="diagnosis-label">PRIMARY PROCESS ROOT CAUSE</span>
          <p className="diagnosis-text">{rca.root_cause}</p>
        </div>
      </div>

      {/* Telemetry Sensor Gauges with Interactive Range Bars */}
      <div className="telemetry-section-title">
        <span>SCADA / PLC REAL-TIME DIE CAST TELEMETRY</span>
        <span className="mono status-hint">NOMINAL TOLERANCE RANGE</span>
      </div>

      <div className="telemetry-gauges-grid">
        {rca.sensor_telemetry.map((sensor) => {
          const isNormal = sensor.status === 'NORMAL' || sensor.status === 'OPTIMAL';
          const isWarning = sensor.status.includes('WARNING') || sensor.status.includes('SLIGHT');
          const isCritical = sensor.status.includes('CRITICAL') || sensor.status.includes('HIGH') || sensor.status.includes('EXCEEDED');

          // Compute relative position on bar (0% to 100%)
          const range = sensor.normal_max - sensor.normal_min || 1;
          const minDisplay = sensor.normal_min - range * 0.3;
          const maxDisplay = sensor.normal_max + range * 0.3;
          const pct = Math.max(5, Math.min(95, ((sensor.value - minDisplay) / (maxDisplay - minDisplay)) * 100));

          return (
            <div
              key={sensor.name}
              className={`telemetry-cell ${isCritical ? 'cell-crit' : isWarning ? 'cell-warn' : 'cell-ok'}`}
            >
              <div className="sensor-name-row">
                <span className="sensor-name">{sensor.name}</span>
                <span className={`status-pill ${isCritical ? 'pill-crit' : isWarning ? 'pill-warn' : 'pill-ok'}`}>
                  {sensor.status.replace('_', ' ')}
                </span>
              </div>

              <div className="sensor-val-row">
                <span className="sensor-value mono">{sensor.value}</span>
                <span className="sensor-unit">{sensor.unit}</span>
              </div>

              {/* Dynamic Range Track Bar */}
              <div className="sensor-range-track">
                <div
                  className="range-nominal-band"
                  style={{
                    left: '25%',
                    width: '50%',
                  }}
                  title={`Nominal: ${sensor.normal_min} - ${sensor.normal_max} ${sensor.unit}`}
                />
                <div
                  className={`range-cursor-pip ${isCritical ? 'pip-crit' : isWarning ? 'pip-warn' : 'pip-ok'}`}
                  style={{ left: `${pct}%` }}
                />
              </div>

              <div className="sensor-limits-row mono">
                <span>Min: {sensor.normal_min}</span>
                <span>Max: {sensor.normal_max} {sensor.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SHAP Feature Impact Section */}
      {rca.shap_attributions && (
        <div className="shap-attributions-block">
          <div className="shap-block-header">
            <span className="shap-title mono">PARAMETER ATTRIBUTION (PROCESS IMPACT)</span>
            <span className="shap-sub mono">Δ DEFECT RISK CONTRIBUTION</span>
          </div>
          <div className="shap-bars-list">
            {rca.shap_attributions.map((item) => (
              <div key={item.feature} className="shap-bar-row">
                <span className="shap-feature-name">{item.feature}</span>
                <div className="shap-bar-track">
                  <div
                    className={`shap-bar-fill ${item.direction === 'negative' ? 'shap-fill-neg' : 'shap-fill-pos'}`}
                    style={{ width: `${item.impact}%` }}
                  />
                </div>
                <span className="shap-impact-val mono">+{item.impact}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
