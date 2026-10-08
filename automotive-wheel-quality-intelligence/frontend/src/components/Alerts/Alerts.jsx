import React, { useState } from 'react';
import { SYSTEM_ALERTS } from '../../data/mockData';
import './Alerts.css';

export default function Alerts({ onAcknowledgeAlert }) {
  const [alertsList, setAlertsList] = useState(SYSTEM_ALERTS);

  const handleDismiss = (id) => {
    setAlertsList(alertsList.filter((a) => a.id !== id));
    if (onAcknowledgeAlert) {
      onAcknowledgeAlert(id);
    }
  };

  return (
    <div className="glass-panel col-12 alerts-panel">
      <div className="alerts-header">
        <div className="alerts-title-wrap">
          <span className="section-eyebrow">SYSTEM ALERTS</span>
          <h3 className="alerts-heading">Live Quality Alerts</h3>
        </div>
        <span className="badge badge-info">
          {alertsList.length} Active
        </span>
      </div>

      <div className="alerts-feed-grid">
        {alertsList.map((item) => {
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
        })}
      </div>
    </div>
  );
}
