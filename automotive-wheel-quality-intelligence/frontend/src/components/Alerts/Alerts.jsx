import React, { useState } from 'react';
import { SYSTEM_ALERTS, BATCH_PROPAGATION_FORECAST } from '../../data/mockData';
import './Alerts.css';

export default function Alerts({ onAcknowledgeAlert }) {
  const [alertsList, setAlertsList] = useState(SYSTEM_ALERTS);
  const [propagationLots, setPropagationLots] = useState(BATCH_PROPAGATION_FORECAST);
  const [heldBatch, setHeldBatch] = useState(null);

  const handleDismiss = (id) => {
    setAlertsList(alertsList.filter((a) => a.id !== id));
    if (onAcknowledgeAlert) {
      onAcknowledgeAlert(id);
    }
  };

  const handlePreemptiveHold = (batchId) => {
    setHeldBatch(batchId);
    setPropagationLots((prev) =>
      prev.map((lot) =>
        lot.batch_id === batchId ? { ...lot, status: 'PREEMPTIVELY_CONTAINED', action: 'LINE_LOCKED_IN_MES' } : lot
      )
    );
    setTimeout(() => setHeldBatch(null), 3000);
  };

  return (
    <div className="glass-panel col-12 alerts-panel">
      <div className="alerts-header">
        <div className="alerts-title-wrap">
          <span className="section-eyebrow">QUALITY ASSURANCE ESCALATION</span>
          <h3 className="alerts-heading">Live Alerts & Batch Propagation Risk</h3>
        </div>
        <div className="alerts-header-pills">
          <span className="badge badge-critical">{alertsList.length} Active System Alerts</span>
          <span className="badge badge-warning">Cross-Batch Risk Monitored</span>
        </div>
      </div>

      {/* Item 7: Cross-Batch Contamination Propagation Warning Strip */}
      <div className="batch-propagation-alert-box">
        <div className="propagation-header">
          <div className="prop-icon-title">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" className="text-warning">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="prop-heading mono">CROSS-BATCH DEFECT PROPAGATION FORECAST (SHARED LADLE & TOOL WEAR)</span>
          </div>
          {heldBatch && (
            <span className="held-toast mono text-cyan">
              ✓ Preemptive MES containment lock dispatched for {heldBatch}!
            </span>
          )}
        </div>

        <div className="propagation-cards-grid">
          {propagationLots.length === 0 ? (
            <div className="mono text-center" style={{ padding: '0.9rem', color: '#64748b', gridColumn: '1 / -1', fontSize: '0.74rem' }}>
              ⚡ No cross-batch propagation containment risks detected • All melt heat vectors nominal
            </div>
          ) : (
            propagationLots.map((lot) => {
            const isLocked = lot.status.includes('CONTAINED') || lot.status.includes('QUARANTINED');
            const isHigh = lot.risk_score >= 0.7;

            return (
              <div
                key={lot.batch_id}
                className={`propagation-card ${isHigh ? 'prop-card-crit' : 'prop-card-warn'}`}
              >
                <div className="prop-card-top">
                  <div className="prop-id-row">
                    <span className="pulse-dot" style={{ backgroundColor: isHigh ? '#ef4444' : '#f59e0b' }}></span>
                    <strong className="mono lot-id">{lot.batch_id}</strong>
                  </div>
                  <span className={`prop-risk-tag mono ${isHigh ? 'text-critical' : 'text-warning'}`}>
                    {lot.propagation_risk} Risk
                  </span>
                </div>

                <p className="prop-vector-desc">{lot.vector}</p>

                <div className="prop-action-row">
                  <span className="prop-status-label mono">{lot.status.replace(/_/g, ' ')}</span>
                  {!isLocked && (
                    <button
                      className="btn-preemptive-hold"
                      onClick={() => handlePreemptiveHold(lot.batch_id)}
                      title="Preemptively lock batch in MES before defects escape to assembly"
                    >
                      Preemptive Hold
                    </button>
                  )}
                  {isLocked && (
                    <span className="locked-pill mono">✓ MES LOCKED</span>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Main Alerts Feed */}
      <div className="alerts-feed-grid">
        {alertsList.length === 0 ? (
          <div className="mono text-center" style={{ padding: '1.5rem', color: '#64748b', gridColumn: '1 / -1', fontSize: '0.78rem' }}>
            ⚡ Zero Active SCADA Alarms • Plant quality within nominal operating envelope
          </div>
        ) : (
          alertsList.map((item) => {
          const isCrit = item.severity === 'CRITICAL';
          const isWarn = item.severity === 'WARNING';

          return (
            <div
              key={item.id}
              className={`alert-feed-card ${isCrit ? 'card-crit' : isWarn ? 'card-warn' : 'card-info'}`}
            >
              <div className="alert-card-top">
                <div className="alert-badge-group">
                  <span className={`pulse-dot ${isCrit ? 'pulse-critical' : isWarn ? 'pulse-warn' : 'pulse-ok'}`}></span>
                  <span className="alert-id mono">{item.id}</span>
                  <span className={`badge ${isCrit ? 'badge-critical' : isWarn ? 'badge-warning' : 'badge-pass'}`}>
                    {item.severity}
                  </span>
                </div>
                <div className="alert-time-source">
                  <span className="alert-time">{item.timestamp}</span>
                  <button className="dismiss-btn" onClick={() => handleDismiss(item.id)} title="Dismiss">
                    ✕
                  </button>
                </div>
              </div>

              <h4 className="alert-title">{item.title}</h4>
              <p className="alert-msg">{item.message}</p>

              <div className="alert-card-footer">
                <span className="alert-source">Source: {item.source}</span>
                <span className="alert-machine mono">Machine: {item.machine_id}</span>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
