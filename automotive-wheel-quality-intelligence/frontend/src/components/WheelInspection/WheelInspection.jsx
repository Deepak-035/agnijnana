import React, { useRef, useState } from 'react';
import './WheelInspection.css';

export default function WheelInspection({
  wheels,
  activeWheel,
  selectedWheelIndex,
  onSelectWheel,
  customImage,
  onUploadCustomImage,
  onResetCustomImage,
  onTriggerInspection,
  isAnalyzing,
  onOpenCertificate,
  onNotify,
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const fileInputRef = useRef(null);
  const currentWheel = activeWheel || wheels[selectedWheelIndex];

  const handleProcessFile = (file) => {
    if (!file) return;

    // Item 8: Secure data handling - file size limit (10MB max)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      if (onNotify) {
        onNotify(`File validation failed: ${file.name} (${sizeMB}MB) exceeds 10MB limit.`, 'error');
      }
      return;
    }

    // MIME type whitelist validation
    const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      if (onNotify) {
        onNotify(`Unsupported format (${file.type || 'unknown'}). Please provide a valid PNG, JPEG, or WebP image.`, 'error');
      }
      return;
    }

    // Sanitize file name to prevent directory traversal or injection
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const reader = new FileReader();
    reader.onload = (event) => {
      onUploadCustomImage(event.target.result, sanitizedName);
    };
    reader.onerror = () => {
      if (onNotify) onNotify('Error reading uploaded image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="glass-panel col-12 wheel-controls-card">
      {/* Top Cockpit Header */}
      <div className="controls-header">
        <div className="controls-title-group">
          <div className="station-icon-glow">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
          </div>
          <div>
            <div className="station-badge-row">
              <span className="live-telemetry-tag">
                <span className="pulse-dot pulse-pass"></span>
                <span>LINE A • CELL #02 LPDC</span>
              </span>
              <span className="station-mode-tag mono">INSPECTION NODE: ONLINE (34ms)</span>
            </div>
            <h2 className="controls-heading">Wheel Inspection Cockpit</h2>
            <p className="controls-sub">
              Automated Optical & Radioscopic Defect Inspection
            </p>
          </div>
        </div>

        <div className="header-action-group">
          {/* Certificate Generation Action */}
          {onOpenCertificate && (
            <button
              className="btn btn-secondary btn-sm cert-export-btn"
              onClick={onOpenCertificate}
              title="Generate Official ISO / IATF Quality Inspection Certificate"
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm3-4a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm3 2a1 1 0 10-2 0v4a1 1 0 102 0v-4z" clipRule="evenodd" />
              </svg>
              <span>Quality Certificate</span>
            </button>
          )}

          {/* Accessible File Upload Button */}
          <input
            id="wheel-specimen-file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
            className="visually-hidden-file-input"
            tabIndex={-1}
          />
          <label
            htmlFor="wheel-specimen-file-input"
            className="btn btn-secondary btn-sm upload-image-label-btn"
            title="Click or drag & drop to upload a custom wheel specimen"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Upload Image</span>
          </label>

          {customImage && (
            <button className="btn btn-secondary btn-sm" onClick={onResetCustomImage}>
              Reset Custom
            </button>
          )}

          {/* Trigger Scan Button */}
          <button
            className="btn btn-primary btn-sm inspect-trigger-btn"
            onClick={onTriggerInspection}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner-inline"></span>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Inspect Specimen</span>
                <kbd className="hotkey-hint">Space</kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Wheels Selector */}
      {wheels.length === 0 ? (
        <div className="preset-empty-notice-bar mono">
          <span className="pulse-beacon-cyan"></span>
          <span>⚡ LIVE INGESTION ACTIVE — Upload a specimen image above to run Rim & Tyre inspection.</span>
        </div>
      ) : (() => {
        const criticalCount = wheels.filter((w) => w.defect?.severity === 'Critical').length;
        const lowCount = wheels.filter((w) => w.defect?.severity === 'Low').length;
        const passCount = wheels.filter((w) => !w.defect).length;

        const filteredWheelsWithIdx = wheels
          .map((wheel, origIdx) => ({ wheel, origIdx }))
          .filter(({ wheel }) => {
            if (filterSeverity === 'CRITICAL') return wheel.defect?.severity === 'Critical';
            if (filterSeverity === 'LOW') return wheel.defect?.severity === 'Low';
            if (filterSeverity === 'PASS') return !wheel.defect;
            return true;
          });

        return (
          <div className="preset-selector-row">
            <div className="preset-title-col">
              <div className="preset-title-header">
                <span className="preset-label">14-DEFECT METROLOGY SPECIMENS</span>
                <span className="preset-sub-label">Select from verified automotive wheel defect classes:</span>
              </div>

              <div className="preset-filter-chips">
                <button
                  className={`filter-chip ${filterSeverity === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterSeverity('ALL')}
                >
                  All ({wheels.length})
                </button>
                <button
                  className={`filter-chip chip-crit ${filterSeverity === 'CRITICAL' ? 'active' : ''}`}
                  onClick={() => setFilterSeverity('CRITICAL')}
                >
                  Critical ({criticalCount})
                </button>
                <button
                  className={`filter-chip chip-warn ${filterSeverity === 'LOW' ? 'active' : ''}`}
                  onClick={() => setFilterSeverity('LOW')}
                >
                  Low / Rework ({lowCount})
                </button>
                <button
                  className={`filter-chip chip-pass ${filterSeverity === 'PASS' ? 'active' : ''}`}
                  onClick={() => setFilterSeverity('PASS')}
                >
                  Pass ({passCount})
                </button>
              </div>

              <div className="preset-dropdown-wrap">
                <span className="mono quick-jump-label">QUICK JUMP:</span>
                <select
                  className="quick-jump-select mono"
                  value={selectedWheelIndex}
                  onChange={(e) => {
                    onResetCustomImage();
                    onSelectWheel(parseInt(e.target.value, 10));
                  }}
                >
                  {wheels.map((w, idx) => (
                    <option key={w.wheel_id} value={idx}>
                      #{idx + 1} {w.defect ? `[${w.defect.severity.toUpperCase()}] ${w.defect.defect_type}` : '[PASS] Nominal Golden Pass'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="preset-buttons">
              {filteredWheelsWithIdx.map(({ wheel, origIdx }) => {
                const isSelected = selectedWheelIndex === origIdx && !customImage;
                const isCrit = wheel.defect?.severity === 'Critical';
                const isLow = wheel.defect?.severity === 'Low';
                const isPass = !wheel.defect;

                return (
                  <button
                    key={wheel.wheel_id}
                    className={`preset-btn ${isSelected ? 'active' : ''} ${isCrit ? 'btn-crit-border' : isLow ? 'btn-warn-border' : 'btn-pass-border'}`}
                    onClick={() => {
                      onResetCustomImage();
                      onSelectWheel(origIdx);
                    }}
                  >
                    <div className="preset-btn-top">
                      <span className={`status-pip ${isCrit ? 'crit' : isLow ? 'warn' : 'pass'}`}></span>
                      <span className="preset-id mono">{wheel.wheel_id}</span>
                      <span className={`preset-badge ${isCrit ? 'badge-crit' : isLow ? 'badge-warn' : 'badge-ok'}`}>
                        {isPass ? 'PASS' : wheel.defect.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="preset-btn-bottom">
                      <span className="preset-name">{wheel.defect ? wheel.defect.defect_type : 'Nominal Flawless Specimen'}</span>
                      <span className="preset-dim mono">{wheel.rim_diameter}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Inspected Component Metadata Ribbon */}
      <div className="wheel-meta-ribbon">
        <div className="meta-cell">
          <span className="meta-label">SPECIMEN ID</span>
          <span className="meta-value mono text-cyan">
            {customImage ? 'CUSTOM-UPLOAD-01' : currentWheel ? currentWheel.wheel_id : 'STANDBY'}
          </span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">ALLOY & GEOMETRY</span>
          <span className="meta-value">
            {currentWheel ? `${currentWheel.alloy} • ${currentWheel.rim_diameter} × ${currentWheel.rim_width}` : 'Dual Rim & Tyre Assembly'}
          </span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">PRODUCTION LOT</span>
          <span className="meta-value mono">{currentWheel ? currentWheel.batch_id : 'LIVE-INGESTION'}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">MACHINE CELL</span>
          <span className="meta-value">
            {currentWheel ? `${currentWheel.machine_id} (Cycle #${currentWheel.production_cycle})` : 'Line A • Cell #02'}
          </span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">SCAN MODALITY</span>
          <span className="meta-value">{customImage ? 'Custom Optical RGB' : currentWheel ? currentWheel.image_type : 'Optical + X-Ray Standby'}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">SAFETY GATE</span>
          <span className={`meta-badge-status ${!currentWheel ? 'status-pass' : currentWheel.defect?.severity === 'Critical' ? 'status-crit' : currentWheel.defect?.severity === 'Low' ? 'status-warn' : 'status-pass'}`}>
            {!currentWheel ? 'STANDBY' : currentWheel.status === 'PASSED' || !currentWheel.defect ? 'SAE J328 PASS' : currentWheel.defect?.severity === 'Critical' ? 'SCRAP CONTAINED' : 'REWORKABLE'}
          </span>
        </div>
      </div>
    </div>
  );
}
