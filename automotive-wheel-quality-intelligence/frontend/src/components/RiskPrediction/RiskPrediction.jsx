import React from 'react';
import './RiskPrediction.css';

export default function RiskPrediction({ wheel }) {
  const risk = wheel.risk;
  const isHighRisk = risk.future_risk_score > 0.6;
  const isMedRisk = risk.future_risk_score >= 0.25 && risk.future_risk_score <= 0.6;

  return (
    <div className="glass-panel col-6 risk-panel">
      <div className="risk-header">
        <div className="risk-title-wrap">
          <span className="section-eyebrow">RISK FORECAST</span>
          <h3 className="risk-heading">Defect Risk Prediction</h3>
        </div>
        <span className={`badge ${isHighRisk ? 'badge-critical' : isMedRisk ? 'badge-warning' : 'badge-pass'}`}>
          {risk.risk_level.toUpperCase()}
        </span>
      </div>

      {/* Main Gauge & Degradation Block */}
      <div className="risk-gauge-block">
        <div className="gauge-metric-circle">
          <svg viewBox="0 0 100 100" width="90" height="90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={isHighRisk ? '#ef4444' : isMedRisk ? '#f59e0b' : '#10b981'}
              strokeWidth="8"
              strokeDasharray={`${risk.future_risk_score * 264} 264`}
              strokeDashoffset="66"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="gauge-text-overlay">
            <span className="gauge-pct mono">{(risk.future_risk_score * 100).toFixed(0)}%</span>
            <span className="gauge-sub">NEXT 10 SHOTS</span>
          </div>
        </div>

        <div className="gauge-details">
          <div className="health-status-row">
            <span className="health-label">HEALTH:</span>
            <span className={`health-val mono ${isHighRisk ? 'text-critical' : isMedRisk ? 'text-warning' : 'text-pass'}`}>
              {risk.machine_health_status}
            </span>
          </div>
          <div className="cycles-remaining-row">
            <span className="cycles-label">EST. CYCLES TO MAINTENANCE:</span>
            <span className="cycles-val mono">~{risk.cycles_until_maintenance} Cycles</span>
          </div>
          <p className="forecast-advisory-msg">
            {risk.forecast_message}
          </p>
        </div>
      </div>

      {/* Trend History Sparkline */}
      <div className="risk-trend-container">
        <div className="trend-header">
          <span className="trend-title">DEFECT PROBABILITY TREND</span>
          <span className="trend-legend mono">Past 5 Cycles</span>
        </div>

        <div className="trend-bars-row">
          {risk.trend.map((val, idx) => (
            <div key={idx} className="trend-col">
              <div className="trend-bar-track">
                <div
                  className={`trend-bar-fill ${val > 60 ? 'bar-crit' : val > 30 ? 'bar-warn' : 'bar-ok'}`}
                  style={{ height: `${val}%` }}
                ></div>
              </div>
              <span className="trend-bar-label mono">C-{idx + 1}</span>
              <span className="trend-bar-val mono">{val}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
