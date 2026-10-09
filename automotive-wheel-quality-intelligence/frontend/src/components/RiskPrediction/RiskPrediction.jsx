import React from 'react';
import { MACHINES_DATA, BATCH_PROPAGATION_FORECAST } from '../../data/mockData';
import './RiskPrediction.css';

export default function RiskPrediction({ wheel }) {
  const risk = wheel?.risk || {
    future_risk_score: 0.05,
    risk_level: 'Minimal Risk',
    cycles_until_maintenance: 1200,
    trend: [5, 5, 5, 5, 5],
    forecast_message: 'SCADA Telemetry standby • Awaiting specimen inspection.',
    machine_health_status: 'STANDBY',
  };
  const isHighRisk = risk.future_risk_score > 0.6;
  const isMedRisk = risk.future_risk_score >= 0.25 && risk.future_risk_score <= 0.6;

  // Generate SVG points for trend line
  const trend = risk.trend || [5, 5, 5, 5, 5];
  const maxVal = 100;
  const points = trend.map((val, idx) => {
    const x = (idx / (trend.length - 1)) * 160 + 10;
    const y = 60 - (val / maxVal) * 45;
    return `${x},${y}`;
  }).join(' ');

  // Sort machines by predicted defect probability (Item 4: predict which machine or batch has next defect)
  const sortedFleet = [...MACHINES_DATA].sort((a, b) => b.predicted_defect_probability - a.predicted_defect_probability);

  return (
    <div className="glass-panel col-6 risk-panel">
      <div className="risk-header">
        <div className="risk-title-wrap">
          <span className="section-eyebrow">PREDICTIVE DEFECT & FLEET FORECAST</span>
          <h3 className="risk-heading">Next Machine & Batch Defect Predictor</h3>
        </div>
        <span className={`badge ${isHighRisk ? 'badge-critical' : isMedRisk ? 'badge-warning' : 'badge-pass'}`}>
          {risk.risk_level.toUpperCase()}
        </span>
      </div>

      {/* Main Gauge & Degradation Block */}
      <div className="risk-gauge-block">
        <div className="gauge-metric-circle">
          <svg viewBox="0 0 100 100" width="105" height="105">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="8" />
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
              className="gauge-circle-stroke"
            />
          </svg>
          <div className="gauge-text-overlay">
            <span className="gauge-pct mono">{(risk.future_risk_score * 100).toFixed(0)}%</span>
            <span className="gauge-sub">ACTIVE SHOT RISK</span>
          </div>
        </div>

        <div className="gauge-details">
          <div className="health-status-row">
            <span className="health-label mono">MACHINE HEALTH STATUS:</span>
            <span className={`health-val mono ${isHighRisk ? 'text-critical' : isMedRisk ? 'text-warning' : 'text-pass'}`}>
              <span className={`health-pip ${isHighRisk ? 'pip-crit' : isMedRisk ? 'pip-warn' : 'pip-ok'}`}></span>
              {risk.machine_health_status}
            </span>
          </div>
          <div className="cycles-remaining-row">
            <span className="cycles-label mono">CYCLES TO PREVENTIVE SERVICING:</span>
            <span className="cycles-val mono">~{risk.cycles_until_maintenance} Die Shots</span>
          </div>
          <div className="forecast-advisory-msg">
            <span className="advisory-title mono">PRIMARY DEFECT PREDICTION:</span>
            <p>{risk.forecast_message}</p>
          </div>
        </div>
      </div>

      {/* Item 4: Machine Fleet Defect Probability Ranking (Ranked by Failure Likelihood) */}
      <div className="fleet-prediction-card">
        <div className="fleet-card-header">
          <span className="mono fleet-header-title">MACHINE FLEET DEFECT PROBABILITY RANKING</span>
          <span className="mono text-cyan">SORTED BY DEFECT FREQUENCY & DRIFT</span>
        </div>
        <div className="fleet-ranking-list">
          {sortedFleet.length === 0 ? (
            <div className="mono text-center" style={{ padding: '0.9rem', color: '#64748b', fontSize: '0.74rem' }}>
              ⚡ SCADA Telemetry Standby • No active machine fleet drift anomalies
            </div>
          ) : (
            sortedFleet.map((m, index) => {
              const isTopRisk = index === 0;
              const prob = m.predicted_defect_probability;
              return (
                <div key={m.id} className={`fleet-rank-row ${isTopRisk ? 'rank-row-top' : ''}`}>
                  <div className="rank-badge mono">#{index + 1}</div>
                  <div className="rank-machine-info">
                    <div className="rank-machine-code-row">
                      <span className="rank-code mono">{m.machine_code}</span>
                      <span className="rank-name">{m.name}</span>
                    </div>
                    <span className="rank-defect-predicted">{m.predicted_defect_type}</span>
                  </div>
                  <div className="rank-prob-col">
                    <div className="rank-prob-bar-track">
                      <div
                        className={`rank-prob-bar-fill ${prob > 60 ? 'bar-crit' : prob > 30 ? 'bar-warn' : 'bar-ok'}`}
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                    <span className={`rank-prob-val mono ${prob > 60 ? 'text-critical' : prob > 30 ? 'text-warning' : 'text-pass'}`}>
                      {prob}% Risk
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Item 4 & 7: Next At-Risk Batches Forecaster */}
      <div className="batch-forecast-strip">
        <div className="batch-strip-header">
          <span className="mono batch-strip-title">NEXT AT-RISK PRODUCTION BATCHES</span>
          <span className="mono text-emerald">SHARED MELT HEAT ATTRIBUTION</span>
        </div>
        <div className="batch-forecast-grid">
          {BATCH_PROPAGATION_FORECAST.length === 0 ? (
            <div className="mono text-center" style={{ padding: '0.8rem', color: '#64748b', gridColumn: '1 / -1', fontSize: '0.74rem' }}>
              ⚡ Containment Stream Standby • Zero contaminated batches detected
            </div>
          ) : (
            BATCH_PROPAGATION_FORECAST.map((b) => (
              <div key={b.batch_id} className={`batch-forecast-card ${b.severity === 'CRITICAL' ? 'card-crit' : 'card-warn'}`}>
                <div className="b-card-top">
                  <span className="b-id mono">{b.batch_id}</span>
                  <span className="b-risk-pct mono">{b.propagation_risk} Risk</span>
                </div>
                <span className="b-vector">{b.vector}</span>
                <span className="b-action mono">{b.action.replace('_', ' ')}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Risk Trajectory Sparkline Card */}
      <div className="risk-trend-box">
        <div className="trend-box-header">
          <span className="trend-title mono">5-CYCLE ESCALATION TRAJECTORY</span>
          <span className="trend-curr mono">
            Current Trend: +{(risk.future_risk_score * 100).toFixed(0)}%
          </span>
        </div>

        <div className="sparkline-wrapper">
          <svg viewBox="0 0 180 70" width="100%" height="60">
            <defs>
              <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isHighRisk ? '#ef4444' : isMedRisk ? '#f59e0b' : '#10b981'} stopOpacity="0.35" />
                <stop offset="100%" stopColor={isHighRisk ? '#ef4444' : isMedRisk ? '#f59e0b' : '#10b981'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="10" y1="15" x2="170" y2="15" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
            <line x1="10" y1="37" x2="170" y2="37" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
            <line x1="10" y1="60" x2="170" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />

            <polygon points={`10,60 ${points} 170,60`} fill="url(#trend-grad)" />

            <polyline
              points={points}
              fill="none"
              stroke={isHighRisk ? '#ef4444' : isMedRisk ? '#f59e0b' : '#10b981'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {trend.map((val, idx) => {
              const x = (idx / (trend.length - 1)) * 160 + 10;
              const y = 60 - (val / maxVal) * 45;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#070b14"
                  stroke={isHighRisk ? '#ef4444' : isMedRisk ? '#f59e0b' : '#10b981'}
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
