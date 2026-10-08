import React, { useRef } from 'react';
import './WheelInspection.css';

export default function WheelInspection({
  wheels,
  selectedWheelIndex,
  onSelectWheel,
  customImage,
  onUploadCustomImage,
  onResetCustomImage,
  onTriggerInspection,
  isAnalyzing,
}) {
  const fileInputRef = useRef(null);
  const currentWheel = wheels[selectedWheelIndex];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUploadCustomImage(event.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel col-12 wheel-controls-card">
      <div className="controls-header">
        <div className="controls-title-group">
          <div className="station-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="controls-heading">Wheel Inspection Station</h2>
            <p className="controls-sub">
              Optical & Radioscopic AI Defect Detection
            </p>
          </div>
        </div>

        <div className="header-action-group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
            title="Upload custom wheel image"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Upload Image
          </button>

          {customImage && (
            <button className="btn btn-secondary btn-sm" onClick={onResetCustomImage}>
              Reset
            </button>
          )}

          <button
            className="btn btn-primary btn-sm"
            onClick={onTriggerInspection}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner-inline"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Inspect Specimen
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Wheels Selector */}
      <div className="preset-selector-row">
        <span className="preset-label">SAMPLES:</span>
        <div className="preset-buttons">
          {wheels.map((wheel, idx) => {
            const isSelected = selectedWheelIndex === idx && !customImage;
            const isCrit = wheel.defect?.severity === 'Critical';
            const isLow = wheel.defect?.severity === 'Low';
            return (
              <button
                key={wheel.wheel_id}
                className={`preset-btn ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onResetCustomImage();
                  onSelectWheel(idx);
                }}
              >
                <span className={`status-pip ${isCrit ? 'crit' : isLow ? 'warn' : 'pass'}`}></span>
                <span className="preset-id mono">{wheel.wheel_id.split('-')[0]}-{wheel.wheel_id.split('-')[1]}</span>
                <span className="preset-name">{wheel.defect ? wheel.defect.defect_type : 'Nominal Pass'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspected Component Metadata Ribbon */}
      <div className="wheel-meta-ribbon">
        <div className="meta-cell">
          <span className="meta-label">WHEEL ID</span>
          <span className="meta-value mono">{currentWheel.wheel_id}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">ALLOY</span>
          <span className="meta-value">{currentWheel.alloy} ({currentWheel.rim_diameter})</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">BATCH</span>
          <span className="meta-value mono">{currentWheel.batch_id}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">MACHINE</span>
          <span className="meta-value">{currentWheel.machine_id}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">CYCLE</span>
          <span className="meta-value mono">#{currentWheel.production_cycle}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">MODALITY</span>
          <span className="meta-value">{customImage ? 'Custom Upload' : currentWheel.image_type}</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">STATUS</span>
          <span className={`badge ${currentWheel.defect?.severity === 'Critical' ? 'badge-critical' : currentWheel.defect?.severity === 'Low' ? 'badge-warning' : 'badge-pass'}`}>
            {currentWheel.status === 'PASSED' ? 'APPROVED' : currentWheel.defect?.severity.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
