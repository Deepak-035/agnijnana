import React from 'react';
import './RootCause.css';

export default function RootCause({ wheel }) {
  const rca = wheel.rca;

  return (
    <div className="glass-panel col-6 root-cause-panel">
      <div className="rca-header">
        <div className="rca-title-wrap">
          <span className="section-eyebrow">ROOT CAUSE</span>
          <h3 className="rca-main-title">Root Cause Analysis</h3>
        </div>
        <div className="rca-confidence-chip">
          <span className="conf-label mono">CONFIDENCE</span>
          <span className="conf-val mono">{(rca.confidence * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Primary Root Cause Statement */}
      <div className="rca-diagnosis-banner">
        <div className="diagnosis-icon">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="diagnosis-body">
          <span className="diagnosis-label">DIAGNOSIS</span>
          <p className="diagnosis-text">{rca.root_cause}</p>
        </div>
      </div>

      {/* Telemetry Sensor Gauges Grid */}
      <div className="telemetry-section-title">
        <span>PROCESS SENSORS</span>
      </div>

      <div className="telemetry-gauges-grid">
        {rca.sensor_telemetry.map((sensor) => {
          const isNormal = sensor.status === 'NORMAL' || sensor.status === 'OPTIMAL';
          const isWarning = sensor.status.includes('WARNING') || sensor.status.includes('SLIGHT');
          const isCritical = sensor.status.includes('CRITICAL') || sensor.status.includes('HIGH') || sensor.status.includes('EXCEEDED');

          return (
            <div
              key={sensor.name}
              className={`telemetry-cell ${isCritical ? 'cell-crit' : isWarning ? 'cell-warn' : 'cell-ok'}`}
            >
              <div className="sensor-name-row">
                <span className="sensor-name">{sensor.name}</span>
                <span className={`status-pill ${isCritical ? 'pill-crit' : isWarning ? 'pill-warn' : 'pill-ok'}`}>
                  {sensor.status}
                </span>
              </div>

              <div className="sensor-val-row">
                <span className="sensor-value mono">{sensor.value}</span>
                <span className="sensor-unit">{sensor.unit}</span>
              </div>

              <div className="sensor-limits mono">
                Target: {sensor.normal_min} – {sensor.normal_max} {sensor.unit}
              </div>
            </div>
          );
        })}
      </div>

      {/* SHAP Feature Attribution Weight Breakdown */}
      <div className="shap-breakdown-card">
        <div className="shap-title-row">
          <span className="shap-label">FEATURE ATTRIBUTION</span>
          <span className="shap-note mono">Contribution %</span>
        </div>

        <div className="shap-bars-list">
          {rca.shap_attributions.map((item) => (
            <div key={item.feature} className="shap-bar-item">
              <div className="shap-bar-meta">
                <span className="shap-feature-name">{item.feature}</span>
                <span className="shap-feature-val mono">
                  {item.direction === 'negative' ? `+${item.impact}% Risk` : `+${item.impact}% Stability`}
                </span>
              </div>
              <div className="shap-progress-track">
                <div
                  className={`shap-progress-fill ${item.direction === 'negative' ? 'fill-neg' : 'fill-pos'}`}
                  style={{ width: `${item.impact}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
