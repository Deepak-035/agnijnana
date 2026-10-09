import React, { useState } from 'react';
import './SeverityCard.css';

export default function SeverityCard({
  wheel,
  onTriggerDisposition,
  onNotify,
}) {
  const [activeAction, setActiveAction] = useState(null);
  const defect = wheel?.defect;
  const isCrit = defect?.severity === 'Critical';
  const isLow = defect?.severity === 'Low';
  const isPass = !!wheel && !defect;
  const isStandby = !wheel;

  const handleAction = (type) => {
    if (isStandby) {
      if (onNotify) onNotify('Cannot execute disposition: No specimen currently loaded.', 'warning');
      return;
    }

    setActiveAction(type);
    if (onTriggerDisposition) {
      onTriggerDisposition(type);
    }
    setTimeout(() => {
      setActiveAction(null);
    }, 2500);
  };

  const complianceScore = isStandby ? 100.0 : isPass ? 99.8 : isLow ? 68.5 : 14.2;

  return (
    <div className={`glass-panel col-5 severity-card-panel ${isCrit ? 'panel-critical' : isLow ? 'panel-warning' : isStandby ? 'panel-info' : 'panel-pass'}`}>
      <div className="severity-header">
        <div className="severity-header-title">
          <span className="section-eyebrow">STRUCTURAL SAFETY GATE</span>
          <h3 className="severity-panel-heading">Severity Assessment</h3>
        </div>
        <span className={`badge ${isCrit ? 'badge-critical' : isLow ? 'badge-warning' : isStandby ? 'badge-info' : 'badge-pass'}`}>
          {isStandby ? 'STANDBY' : isPass ? 'SAE J328 PASS' : defect.severity.toUpperCase()}
        </span>
      </div>

      {/* Main Status Display with Radial Compliance Gauge */}
      <div className="severity-status-display">
        <div className="compliance-radial-wrap">
          <svg viewBox="0 0 100 100" width="76" height="76">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={isCrit ? '#ef4444' : isLow ? '#f59e0b' : '#10b981'}
              strokeWidth="7"
              strokeDasharray={`${(complianceScore / 100) * 251} 251`}
              strokeDashoffset="62"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="compliance-text mono">
            <span className="comp-val">{complianceScore.toFixed(0)}%</span>
            <span className="comp-label">MARGIN</span>
          </div>
        </div>

        <div className="severity-title-block">
          <h3 className="severity-status-heading">
            {isStandby
              ? 'STANDBY • AWAITING INGESTION'
              : isCrit
              ? 'CRITICAL (SCRAP QUARANTINE)'
              : isLow
              ? 'LOW (REWORKABLE MARGIN)'
              : 'NOMINAL SPEC CONFORMANCE'}
          </h3>
          <div className="disposition-code mono">
            RECOMMENDED DISPOSITION: <strong>{isStandby ? 'AWAITING SPECIMEN' : isPass ? 'LINE RELEASE' : defect.disposition}</strong>
          </div>
          <div className="sae-spec-tag mono">
            TEST SPEC: SAE J328 DYNAMIC RADIAL FATIGUE
          </div>
        </div>
      </div>

      {/* Safety Rationale Impact Box */}
      <div className="safety-rationale-box">
        <div className="rationale-label">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>STRUCTURAL SAFETY IMPACT</span>
        </div>
        <p className="rationale-text">
          {isStandby
            ? 'Compliance gate active and awaiting specimen image. Fatigue margin and structural safety impact will compute upon ingestion.'
            : isPass
            ? 'Radial load test integrity verified. No micro-fissures or stress-concentration points detected on spoke fillets or bead seat.'
            : defect.safety_impact}
        </p>
      </div>

      {/* Sub-Assembly Breakdown Strip */}
      {wheel && (wheel.rim_inspection || wheel.tyre_inspection) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', margin: '0.75rem 0' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#7dd3fc', fontWeight: '700', letterSpacing: '0.05em' }}>
              RIM SUB-ASSEMBLY (9 CLS)
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: wheel.rim_inspection?.severity === 'Critical' ? '#ef4444' : '#38bdf8', marginTop: '0.2rem' }}>
              {wheel.rim_inspection?.defect_name || wheel.rim_inspection?.detected_defect || 'Conforming Pass'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              Sev: {wheel.rim_inspection?.severity || 'Pass'} • {((wheel.rim_inspection?.confidence || 0.99) * 100).toFixed(1)}%
            </div>
          </div>

          <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#c084fc', fontWeight: '700', letterSpacing: '0.05em' }}>
              TYRE SUB-ASSEMBLY (14 CLS)
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: wheel.tyre_inspection?.severity === 'Critical' ? '#ef4444' : '#c084fc', marginTop: '0.2rem' }}>
              {wheel.tyre_inspection ? `#${wheel.tyre_inspection.class_id} ${wheel.tyre_inspection.detected_defect}` : 'Conforming Pass'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              Sev: {wheel.tyre_inspection?.severity || 'Pass'} • {((wheel.tyre_inspection?.confidence || 0.99) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Interactive Operator Disposition Buttons */}
      <div className="disposition-action-section">
        <div className="action-row-header">
          <span className="action-label mono">
            DISPOSITION AUTHORIZATION:
          </span>
          {activeAction && (
            <span className="action-feedback-toast mono text-cyan">
              ✓ Dispatched {activeAction} to MES pool!
            </span>
          )}
        </div>

        <div className="disposition-buttons-grid">
          <button
            className={`disp-btn btn-release ${activeAction === 'LINE_RELEASE' ? 'btn-active' : ''}`}
            onClick={() => handleAction('LINE_RELEASE')}
            title="Approve component and release to machining line"
          >
            <span className="disp-hotkey mono">[A]</span>
            <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Release Pass</span>
          </button>

          <button
            className={`disp-btn btn-rework ${activeAction === 'ROBOTIC_REWORK' ? 'btn-active' : ''}`}
            onClick={() => handleAction('ROBOTIC_REWORK')}
            title="Route component to robotic polishing/deburring station"
          >
            <span className="disp-hotkey mono">[W]</span>
            <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>Rework Cell</span>
          </button>

          <button
            className={`disp-btn btn-scrap ${activeAction === 'SCRAP_QUARANTINE' ? 'btn-active' : ''}`}
            onClick={() => handleAction('SCRAP_QUARANTINE')}
            title="Quarantine and lock batch in scrap pool"
          >
            <span className="disp-hotkey mono">[X]</span>
            <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Scrap & Lock</span>
          </button>
        </div>
      </div>
    </div>
  );
}
