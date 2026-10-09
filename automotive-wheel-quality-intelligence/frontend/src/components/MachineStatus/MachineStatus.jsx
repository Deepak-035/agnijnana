import React from 'react';
import { MACHINES_DATA } from '../../data/mockData';
import './MachineStatus.css';

export default function MachineStatus() {
  return (
    <div className="glass-panel col-5 machine-status-panel">
      <div className="machine-header">
        <div className="machine-title-wrap">
          <span className="section-eyebrow">EQUIPMENT</span>
          <h3 className="machine-heading">Machine Fleet</h3>
        </div>
        <span className="badge badge-info">{MACHINES_DATA.length} Units Active</span>
      </div>

      <div className="machines-list">
        {MACHINES_DATA.length === 0 ? (
          <div className="mono text-center" style={{ padding: '2rem 1rem', color: '#64748b' }}>
            ⚡ SCADA Telemetry Gateway Standby • No active machine fleet units connected
          </div>
        ) : (
          MACHINES_DATA.map((machine) => {
          const isOper = machine.status === 'OPERATIONAL';
          const isDegraded = machine.status === 'DEGRADED';
          const isMaint = machine.status === 'MAINTENANCE_REQUIRED';

          return (
            <div
              key={machine.id}
              className={`machine-cell-card ${isDegraded ? 'm-degraded' : isMaint ? 'm-maint' : isOper ? 'm-oper' : 'm-warn'}`}
            >
              <div className="m-card-top">
                <div className="m-title-block">
                  <div className="m-code-row">
                    <span className="pulse-dot" style={{ backgroundColor: isOper ? '#10b981' : isDegraded ? '#ef4444' : '#f59e0b' }}></span>
                    <h4 className="mono m-code">{machine.machine_code}</h4>
                  </div>
                  <span className="m-name">{machine.name}</span>
                </div>

                <div className="m-health-score">
                  <span className="health-pct mono">{machine.health_score}%</span>
                  <span className="health-lbl">HEALTH</span>
                </div>
              </div>

              <div className="m-telemetry-strip">
                <div className="m-telem-item">
                  <span className="m-lbl">DIE TEMP</span>
                  <span className="m-val mono">{machine.die_temp_c}°C</span>
                </div>
                <div className="m-telem-item">
                  <span className="m-lbl">PRESSURE</span>
                  <span className="m-val mono">{machine.injection_pressure_bar} bar</span>
                </div>
                <div className="m-telem-item">
                  <span className="m-lbl">VIBRATION</span>
                  <span className="m-val mono">{machine.vibration_rms} mm/s</span>
                </div>
                <div className="m-telem-item">
                  <span className="m-lbl">CYCLE</span>
                  <span className="m-val mono">{machine.cycle_time_s}s</span>
                </div>
              </div>

              <div className="m-card-footer">
                <span className="m-line-id">{machine.line_identifier}</span>
                <span
                  className={`badge ${isOper ? 'badge-pass' : isDegraded ? 'badge-critical' : 'badge-warning'}`}
                >
                  {machine.status}
                </span>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
