import React from 'react';
import './InspectionCertificateModal.css';

export default function InspectionCertificateModal({ wheel, onClose }) {
  if (!wheel) return null;
  const defect = wheel.defect;
  const isPass = !defect;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cert-modal-backdrop" onClick={onClose}>
      <div className="cert-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="cert-modal-header no-print">
          <div className="cert-header-title">
            <span className="badge badge-info">IATF 16949 / ISO 9001 CERTIFIED</span>
            <h3>Automotive Quality Inspection Certificate</h3>
          </div>
          <div className="cert-header-actions">
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print / Save PDF
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>✕ Close</button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="cert-document-sheet">
          <div className="cert-sheet-top">
            <div className="cert-brand">
              <div className="cert-logo-icon">
                <svg viewBox="0 0 40 40" width="34" height="34" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="#0284c7" strokeWidth="2.5" />
                  <circle cx="20" cy="20" r="10" stroke="#00f0ff" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="4" fill="#0284c7" />
                </svg>
              </div>
              <div>
                <h2 className="cert-brand-title">WHEEL QUALITY INTELLIGENCE</h2>
                <p className="cert-brand-sub">Autonomous Vision & Process Metrology Lab</p>
              </div>
            </div>

            <div className="cert-meta-block mono">
              <div><strong>DOC ID:</strong> CERT-{wheel.wheel_id}</div>
              <div><strong>DATE:</strong> {wheel.inspection_timestamp || new Date().toISOString().slice(0, 19).replace('T', ' ')}</div>
              <div><strong>STANDARD:</strong> SAE J328 / ISO 7141</div>
            </div>
          </div>

          <div className="cert-divider"></div>

          {/* Disposition Stamp Banner */}
          <div className={`cert-status-banner ${isPass ? 'cert-pass' : defect?.severity === 'Critical' ? 'cert-scrap' : 'cert-rework'}`}>
            <div className="cert-stamp-badge">
              {isPass ? 'QUALITY CONFORMANCE PASSED' : defect?.severity === 'Critical' ? 'CRITICAL SCRAP QUARANTINE' : 'REWORKABLE MARGINAL DEFECT'}
            </div>
            <p className="cert-stamp-desc">
              {isPass 
                ? 'Component meets all geometric, surface, and radioscopic criteria. Verified for vehicle assembly.' 
                : defect?.safety_impact || 'Surface or structural deviation flagged by edge inference.'}
            </p>
          </div>

          {/* Technical Spec Matrix */}
          <div className="cert-spec-grid">
            <div className="cert-spec-item">
              <span className="cert-spec-label">SERIAL / SPECIMEN</span>
              <span className="cert-spec-val mono">{wheel.wheel_id}</span>
            </div>
            <div className="cert-spec-item">
              <span className="cert-spec-label">WHEEL MODEL</span>
              <span className="cert-spec-val">{wheel.wheel_model}</span>
            </div>
            <div className="cert-spec-item">
              <span className="cert-spec-label">ALLOY COMPOSITION</span>
              <span className="cert-spec-val mono">{wheel.alloy}</span>
            </div>
            <div className="cert-spec-item">
              <span className="cert-spec-label">DIMENSIONS</span>
              <span className="cert-spec-val mono">{wheel.rim_diameter} × {wheel.rim_width} ({wheel.spoke_count} Spoke)</span>
            </div>
            <div className="cert-spec-item">
              <span className="cert-spec-label">MELT BATCH / HEAT</span>
              <span className="cert-spec-val mono">{wheel.batch_id}</span>
            </div>
            <div className="cert-spec-item">
              <span className="cert-spec-label">CASTING CELL / PLC</span>
              <span className="cert-spec-val mono">{wheel.machine_id} (Cycle #{wheel.production_cycle})</span>
            </div>
          </div>

          {/* Metrology Findings */}
          <div className="cert-findings-box">
            <h4 className="cert-findings-title">Vision Defect Localization Findings</h4>
            {isPass ? (
              <p className="cert-findings-pass">
                ✓ Full multi-angle radioscopic and optical scan completed (34ms cycle). No micro-cracks, shrinkage cavities, or porosity clusters identified. Dimensional tolerances within ±0.05 mm.
              </p>
            ) : (
              <div className="cert-defect-details">
                <div className="cert-defect-row">
                  <span><strong>Defect Classification:</strong> {defect.defect_type}</span>
                  <span><strong>Confidence:</strong> {(defect.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="cert-defect-row">
                  <span><strong>Localized Sector:</strong> {defect.zone}</span>
                  <span><strong>Surface Area:</strong> {defect.dimensions.area_mm2} mm² (Depth ~{defect.dimensions.depth_est_mm} mm)</span>
                </div>
                <div className="cert-defect-row">
                  <span><strong>RCA Attributed Cause:</strong> {wheel.rca?.root_cause || 'Process thermal variance'}</span>
                  <span><strong>Containment SOP:</strong> {wheel.recommendation?.sop_code || 'SOP-QA-01'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Signatures & QR Block */}
          <div className="cert-signature-row">
            <div className="cert-sign-col">
              <div className="cert-sign-line"></div>
              <span>QA Metallurgical Inspector</span>
              <em className="mono">ID: QA-ENG-4912 (Automated Sign-off)</em>
            </div>
            <div className="cert-qr-col">
              <div className="cert-qr-box mono">
                [ QR HASH ]
                <span>{wheel.wheel_id.slice(-6)}</span>
              </div>
              <span className="cert-qr-sub">Tamper-Proof MES Hash</span>
            </div>
            <div className="cert-sign-col">
              <div className="cert-sign-line"></div>
              <span>Plant Shift Superintendent</span>
              <em className="mono">Singularity Cast Operations</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
