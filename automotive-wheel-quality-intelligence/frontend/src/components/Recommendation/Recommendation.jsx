import React from 'react';
import './Recommendation.css';

export default function Recommendation({ wheel, onDispatchAction }) {
  const rec = wheel?.recommendation;

  if (!rec) {
    return (
      <div className="glass-panel col-6 recommendation-panel">
        <div className="rec-header">
          <div className="rec-title-wrap">
            <span className="section-eyebrow">COUNTERMEASURES</span>
            <h3 className="rec-heading">Corrective Action</h3>
          </div>
          <span className="badge badge-info mono">SOP STANDBY</span>
        </div>
        <div className="rec-body-card" style={{ borderStyle: 'dashed' }}>
          <div className="rec-meta-top">
            <span className="rec-title">Standard Operating Procedure Dispatcher</span>
            <span className="badge badge-info">AWAITING SPECIMEN</span>
          </div>
          <p className="rec-action-text mono text-cyan">
            ⚡ Prescriptive maintenance countermeasures and automated work orders will generate upon defect detection.
          </p>
        </div>
      </div>
    );
  }

  const isImmediate = rec.priority === 'IMMEDIATE';
  const isShift = rec.priority === 'SCHEDULED_SHIFT_END';

  return (
    <div className="glass-panel col-6 recommendation-panel">
      <div className="rec-header">
        <div className="rec-title-wrap">
          <span className="section-eyebrow">COUNTERMEASURES</span>
          <h3 className="rec-heading">Corrective Action</h3>
        </div>
        <div className="sop-badge-wrap">
          <span className="mono sop-badge">{rec.sop_code}</span>
        </div>
      </div>

      <div className="rec-body-card">
        <div className="rec-meta-top">
          <span className="rec-title">{rec.title}</span>
          <span className={`badge ${isImmediate ? 'badge-critical' : isShift ? 'badge-warning' : 'badge-pass'}`}>
            PRIORITY: {rec.priority}
          </span>
        </div>

        <p className="rec-action-text">{rec.action}</p>

        <div className="rec-params-grid">
          <div className="rec-param-item">
            <span className="param-label">ASSIGNED TO</span>
            <span className="param-val">{rec.assigned_team}</span>
          </div>
          <div className="rec-param-item">
            <span className="param-label">EST. DOWNTIME</span>
            <span className="param-val mono">{rec.estimated_downtime_min} Min</span>
          </div>
          <div className="rec-param-item">
            <span className="param-label">MACHINE</span>
            <span className="param-val mono">{wheel.machine_id}</span>
          </div>
          <div className="rec-param-item">
            <span className="param-label">BATCH</span>
            <span className="param-val mono">{wheel.batch_id}</span>
          </div>
        </div>
      </div>

      <div className="rec-action-footer">
        <button
          className={`btn ${isImmediate ? 'btn-danger' : 'btn-primary'} btn-full`}
          onClick={() => onDispatchAction(rec.sop_code)}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Dispatch Work Order ({rec.sop_code})
        </button>
      </div>
    </div>
  );
}
