import React from 'react';
import './SeverityCard.css';

export default function SeverityCard({ wheel, onTriggerDisposition }) {
  const defect = wheel.defect;
  const isCrit = defect?.severity === 'Critical';
  const isLow = defect?.severity === 'Low';
  const isPass = !defect;

  return (
    <div className={`glass-panel col-5 severity-card-panel ${isCrit ? 'panel-critical' : isLow ? 'panel-warning' : 'panel-pass'}`}>
      <div className="severity-header">
        <span className="section-eyebrow">SEVERITY ASSESSMENT</span>
        <span className={`badge ${isCrit ? 'badge-critical' : isLow ? 'badge-warning' : 'badge-pass'}`}>
          {isPass ? 'PASS' : defect.severity.toUpperCase()}
        </span>
      </div>

      <div className="severity-status-display">
        <div className="severity-icon-badge">
          {isCrit ? (
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ef4444" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : isLow ? (
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#f59e0b" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#10b981" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <div className="severity-title-block">
          <h3 className="severity-status-heading">
            {isCrit ? 'CRITICAL (SCRAP)' : isLow ? 'LOW (REWORKABLE)' : 'WITHIN SPECIFICATION'}
          </h3>
          <div className="disposition-code mono">
            ACTION: {isPass ? 'RELEASE' : defect.disposition}
          </div>
        </div>
      </div>

      {/* Safety Rationale */}
      <div className="safety-rationale-box">
        <div className="rationale-label">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          SAFETY IMPACT
        </div>
        <p className="rationale-text">
          {isPass
            ? 'Meets structural requirements under SAE J328 fatigue standards. Zero surface cracks detected.'
            : defect.safety_impact}
        </p>
      </div>

      {/* Disposition Controls */}
      <div className="disposition-action-row">
        {isCrit && (
          <button
            className="btn btn-danger btn-full"
            onClick={() => onTriggerDisposition('SCRAP_QUARANTINE')}
          >
            Quarantine Wheel
          </button>
        )}
        {isLow && (
          <button
            className="btn btn-secondary btn-full"
            onClick={() => onTriggerDisposition('ROBOTIC_REWORK')}
          >
            Route to Rework
          </button>
        )}
        {isPass && (
          <button
            className="btn btn-primary btn-full"
            onClick={() => onTriggerDisposition('LINE_RELEASE')}
          >
            Release Wheel
          </button>
        )}
      </div>
    </div>
  );
}
