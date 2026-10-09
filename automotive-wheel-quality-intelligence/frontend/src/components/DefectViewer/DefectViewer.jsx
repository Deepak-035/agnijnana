import React, { useState, useRef } from 'react';
import { RIM_DEFECT_CLASSES, TYRE_DEFECT_CLASSES } from '../../data/mockData';
import './DefectViewer.css';

export default function DefectViewer({ wheel, customImage, onUploadCustomImage, onNotify }) {
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showReticle, setShowReticle] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHoveredBox, setIsHoveredBox] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({ x: 250, y: 250, mmX: 0, mmY: 0, angle: 0 });
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [subAssemblyTab, setSubAssemblyTab] = useState('COMBINED'); // 'COMBINED' | 'RIM' | 'TYRE'

  const viewportRef = useRef(null);

  const rimInspection = wheel?.rim_inspection;
  const tyreInspection = wheel?.tyre_inspection;

  let defect = wheel?.defect;
  if (subAssemblyTab === 'RIM') {
    defect = rimInspection ? {
      ...rimInspection,
      defect_type: rimInspection.defect_name || rimInspection.detected_defect,
    } : wheel?.defect;
  } else if (subAssemblyTab === 'TYRE') {
    defect = tyreInspection ? {
      ...tyreInspection,
      defect_type: tyreInspection.defect_name || `Class #${tyreInspection.class_id}: ${tyreInspection.detected_defect}`,
    } : null;
  }

  const handleMouseMove = (e) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const relY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    // Convert to 500x500 CAD coordinate space
    const cadX = (relX / rect.width) * 500;
    const cadY = (relY / rect.height) * 500;

    // Convert to mm relative to wheel hub center (250, 250)
    const mmX = ((cadX - 250) * 0.96).toFixed(1);
    const mmY = ((250 - cadY) * 0.96).toFixed(1);
    const rad = Math.atan2(cadY - 250, cadX - 250);
    const deg = Math.round(((rad * 180) / Math.PI + 360) % 360);

    setCursorCoords({ x: cadX, y: cadY, mmX, mmY, angle: deg });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && onUploadCustomImage) {
      if (file.size > 10 * 1024 * 1024) {
        if (onNotify) onNotify(`File validation failed: ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds 10MB limit.`, 'error');
        return;
      }
      const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowed.includes(file.type.toLowerCase())) {
        if (onNotify) onNotify(`Unsupported image format. Please drop a valid PNG, JPEG, or WebP.`, 'error');
        return;
      }
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const reader = new FileReader();
      reader.onload = (event) => {
        onUploadCustomImage(event.target.result, sanitizedName);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel col-7 defect-viewer-panel">
      {/* Viewer Header */}
      <div className="viewer-header">
        <div className="viewer-title-group">
          <div className="viewer-status-pulsar">
            <span className="pulsar-dot"></span>
          </div>
          <div>
            <h3 className="panel-title">Defect Localization & CAD Metrology</h3>
            <span className="mono view-mode-badge">
              {customImage ? 'CUSTOM RGB CAMERA' : wheel ? wheel.image_type : 'Optical + X-Ray Standby'} • 4096×3072 UHD
            </span>
          </div>
        </div>

        {/* View Controls Toolbar */}
        <div className="viewer-controls">
          <button
            className={`tool-toggle-btn ${showBoundingBox ? 'active' : ''}`}
            onClick={() => setShowBoundingBox(!showBoundingBox)}
            title="Toggle Defect Bounding Box [B]"
          >
            <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l3.293 3.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-3.293 3.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l3.293-3.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-3.293-3.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            B-Box
          </button>

          <button
            className={`tool-toggle-btn ${showHeatmap ? 'active' : ''}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
            title="Toggle Radioscopic Density Heatmap [H]"
          >
            <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.316.492-.533 1.035-.688 1.581a8.552 8.552 0 00-.236 1.134 6.892 6.892 0 00-.148.97c-.017.158-.027.317-.031.477l-.001.037v.006s0 .003 0 0c-.01.124-.038.257-.087.391a1.238 1.238 0 01-.295.467c-.206.206-.497.323-.812.323s-.606-.117-.812-.323a1.238 1.238 0 01-.295-.467c-.049-.134-.077-.267-.087-.391 0 0 0-.003 0 0v-.006l-.001-.037a7.027 7.027 0 00-.031-.477 6.893 6.893 0 00-.148-.97 8.552 8.552 0 00-.236-1.134c-.155-.546-.372-1.089-.688-1.581-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385A9.99 9.99 0 002 9c0 5.523 4.477 10 10 10s10-4.477 10-10a9.99 9.99 0 00-.605-6.447z" clipRule="evenodd" />
            </svg>
            Heatmap
          </button>

          <button
            className={`tool-toggle-btn ${showReticle ? 'active' : ''}`}
            onClick={() => setShowReticle(!showReticle)}
            title="Toggle Crosshair Metrology Loupe"
          >
            <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm-1 3v2H7v2h2v2h2v-2h2V9h-2V7H9z" />
            </svg>
            Reticle
          </button>

          <button
            className={`tool-toggle-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Inspection Zone Grid"
          >
            <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" clipRule="evenodd" />
            </svg>
            CAD Grid
          </button>

          <div className="zoom-btn-group">
            <button
              className="zoom-btn"
              onClick={() => setZoomLevel(Math.max(1, +(zoomLevel - 0.25).toFixed(2)))}
              title="Zoom Out"
            >
              -
            </button>
            <span className="mono zoom-label">{(zoomLevel * 100).toFixed(0)}%</span>
            <button
              className="zoom-btn"
              onClick={() => setZoomLevel(Math.min(2.5, +(zoomLevel + 0.25).toFixed(2)))}
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Dual Sub-Assembly Stream Selector */}
      <div className="subassembly-stream-selector">
        <button
          className={`stream-tab-btn ${subAssemblyTab === 'COMBINED' ? 'active' : ''}`}
          onClick={() => setSubAssemblyTab('COMBINED')}
        >
          <span className="stream-badge-dot dot-combined"></span>
          <span>Unified Quality Gate</span>
          {wheel?.combined_verdict && (
            <span className="stream-tag-verdict">{wheel.combined_verdict.overall_severity}</span>
          )}
        </button>

        <button
          className={`stream-tab-btn ${subAssemblyTab === 'RIM' ? 'active' : ''}`}
          onClick={() => setSubAssemblyTab('RIM')}
        >
          <span className="stream-badge-dot dot-rim"></span>
          <span>Rim Sub-Assembly (9 Classes)</span>
          {wheel?.rim_inspection && (
            <span className="stream-tag-defect">{wheel.rim_inspection.detected_defect}</span>
          )}
        </button>

        <button
          className={`stream-tab-btn ${subAssemblyTab === 'TYRE' ? 'active' : ''}`}
          onClick={() => setSubAssemblyTab('TYRE')}
        >
          <span className="stream-badge-dot dot-tyre"></span>
          <span>Tyre Sub-Assembly (14 Classes: 0–13)</span>
          {wheel?.tyre_inspection && (
            <span className="stream-tag-defect">#{wheel.tyre_inspection.class_id} {wheel.tyre_inspection.detected_defect}</span>
          )}
        </button>
      </div>

      {/* Main Wheel Visual Display with Coordinate HUD */}
      <div
        ref={viewportRef}
        className={`viewer-viewport ${isDraggingOver ? 'drag-over' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPointerInside(true)}
        onMouseLeave={() => setIsPointerInside(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
      >
        {/* Metrology Precision Readout Ribbon */}
        {isPointerInside && (
          <div className="metrology-live-hud mono">
            <span className="hud-coord-pill">X: {cursorCoords.mmX} mm</span>
            <span className="hud-coord-pill">Y: {cursorCoords.mmY} mm</span>
            <span className="hud-coord-pill">θ: {cursorCoords.angle}° Rim Angle</span>
            <span className="hud-coord-pill text-cyan">FOV: 65° OPTICAL</span>
          </div>
        )}

        <div
          className="viewport-inner"
          style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease' }}
        >
          {customImage ? (
            <div className="custom-image-wrapper">
              <img src={customImage} alt="Inspected Wheel" className="custom-wheel-img" />
              
              {/* Dual Bounding Boxes according to selected stream */}
              {subAssemblyTab === 'COMBINED' ? (
                <>
                  {rimInspection && showBoundingBox && (
                    <div
                      className="defect-box box-rim"
                      style={{
                        left: `${rimInspection.location.x}%`,
                        top: `${rimInspection.location.y}%`,
                        width: `${rimInspection.location.width}%`,
                        height: `${rimInspection.location.height}%`,
                      }}
                      onMouseEnter={() => setIsHoveredBox(true)}
                      onMouseLeave={() => setIsHoveredBox(false)}
                    >
                      <div className="box-tag">
                        <span className="box-type">RIM: {rimInspection.defect_name || rimInspection.detected_defect}</span>
                        <span className="box-conf">{(rimInspection.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  )}

                  {tyreInspection && showBoundingBox && (
                    <div
                      className="defect-box box-tyre"
                      style={{
                        left: `${tyreInspection.location.x}%`,
                        top: `${tyreInspection.location.y}%`,
                        width: `${tyreInspection.location.width}%`,
                        height: `${tyreInspection.location.height}%`,
                      }}
                      onMouseEnter={() => setIsHoveredBox(true)}
                      onMouseLeave={() => setIsHoveredBox(false)}
                    >
                      <div className="box-tag">
                        <span className="box-type">TYRE: #{tyreInspection.class_id} {tyreInspection.detected_defect}</span>
                        <span className="box-conf">{(tyreInspection.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  )}

                  {!rimInspection && !tyreInspection && defect && showBoundingBox && (
                    <div
                      className={`defect-box ${defect.severity === 'Critical' ? 'box-crit' : 'box-warn'}`}
                      style={{
                        left: `${defect.location.x}%`,
                        top: `${defect.location.y}%`,
                        width: `${defect.location.width}%`,
                        height: `${defect.location.height}%`,
                      }}
                      onMouseEnter={() => setIsHoveredBox(true)}
                      onMouseLeave={() => setIsHoveredBox(false)}
                    >
                      <div className="box-tag">
                        <span className="box-type">{defect.defect_type}</span>
                        <span className="box-conf">{(defect.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                defect && showBoundingBox && (
                  <div
                    className={`defect-box ${subAssemblyTab === 'RIM' ? 'box-rim' : 'box-tyre'}`}
                    style={{
                      left: `${defect.location.x}%`,
                      top: `${defect.location.y}%`,
                      width: `${defect.location.width}%`,
                      height: `${defect.location.height}%`,
                    }}
                    onMouseEnter={() => setIsHoveredBox(true)}
                    onMouseLeave={() => setIsHoveredBox(false)}
                  >
                    <div className="box-tag">
                      <span className="box-type">{subAssemblyTab}: {defect.defect_type}</span>
                      <span className="box-conf">{(defect.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="svg-wheel-container">
              <svg viewBox="0 0 500 500" className="cad-wheel-svg" width="100%" height="100%">
                <defs>
                  <radialGradient id="rim-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="65%" stopColor="#0f172a" />
                    <stop offset="85%" stopColor="#1e293b" />
                    <stop offset="96%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#64748b" />
                  </radialGradient>

                  <radialGradient id="hub-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="45%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </radialGradient>

                  {/* Heatmap overlay radial */}
                  <radialGradient id="defect-heatmap-grad" cx="72%" cy="28%" r="35%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.55" />
                    <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background CAD Metrology Grid */}
                {showGrid && (
                  <g stroke="rgba(56, 189, 248, 0.14)" strokeWidth="0.8" strokeDasharray="3 3">
                    <line x1="250" y1="10" x2="250" y2="490" />
                    <line x1="10" y1="250" x2="490" y2="250" />
                    <circle cx="250" cy="250" r="60" fill="none" />
                    <circle cx="250" cy="250" r="120" fill="none" />
                    <circle cx="250" cy="250" r="180" fill="none" />
                    <circle cx="250" cy="250" r="230" fill="none" />
                  </g>
                )}

                {/* Outer Wheel Rim Flange */}
                <circle cx="250" cy="250" r="225" fill="none" stroke="#475569" strokeWidth="12" />
                <circle cx="250" cy="250" r="215" fill="url(#rim-gradient)" stroke="#64748b" strokeWidth="4" />
                <circle cx="250" cy="250" r="195" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="6 3" />
                <circle cx="250" cy="250" r="185" fill="none" stroke="#1e293b" strokeWidth="3" />

                {/* Wheel Spokes (Diamond-Cut Alloy Y-Spoke Geometry) */}
                <g stroke="#64748b" strokeWidth="18" strokeLinecap="round" opacity="0.92">
                  <line x1="250" y1="250" x2="250" y2="60" />
                  <line x1="250" y1="250" x2="430" y2="190" />
                  <line x1="250" y1="250" x2="360" y2="410" />
                  <line x1="250" y1="250" x2="140" y2="410" />
                  <line x1="250" y1="250" x2="70" y2="190" />
                </g>

                {/* Machined Spoke Accent Highlights */}
                <g stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round">
                  <line x1="250" y1="230" x2="250" y2="70" />
                  <line x1="240" y1="240" x2="415" y2="195" />
                  <line x1="242" y1="255" x2="350" y2="400" />
                  <line x1="258" y1="255" x2="150" y2="400" />
                  <line x1="260" y1="240" x2="85" y2="195" />
                </g>

                {/* Inner Drop Center & Center Hub Bore */}
                <circle cx="250" cy="250" r="75" fill="url(#hub-gradient)" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="250" cy="250" r="35" fill="#070b14" stroke="#00f0ff" strokeWidth="2" />
                <circle cx="250" cy="250" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />

                {/* 5-Lug Bolt Pattern */}
                <circle cx="250" cy="205" r="8" fill="#070b14" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="293" cy="236" r="8" fill="#070b14" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="276" cy="286" r="8" fill="#070b14" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="224" cy="286" r="8" fill="#070b14" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="207" cy="236" r="8" fill="#070b14" stroke="#94a3b8" strokeWidth="2" />

                {/* Thermal Density Heatmap (Toggleable) */}
                {showHeatmap && (
                  <circle cx="250" cy="250" r="215" fill="url(#defect-heatmap-grad)" pointerEvents="none" />
                )}

                {/* Bounding Box & Target Overlay */}
                {defect && showBoundingBox && (
                  <g
                    className="defect-svg-overlay"
                    onMouseEnter={() => setIsHoveredBox(true)}
                    onMouseLeave={() => setIsHoveredBox(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Bounding Rectangle */}
                    <rect
                      x={`${defect.location.x * 5}`}
                      y={`${defect.location.y * 5}`}
                      width={`${defect.location.width * 5}`}
                      height={`${defect.location.height * 5}`}
                      fill={defect.severity === 'Critical' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}
                      stroke={defect.severity === 'Critical' ? '#ef4444' : '#f59e0b'}
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                    />

                    {/* Corner Target Brackets */}
                    <path
                      d={`M${defect.location.x * 5 - 5} ${defect.location.y * 5 + 10} v-15 h15`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                    <path
                      d={`M${defect.location.x * 5 + defect.location.width * 5 + 5} ${defect.location.y * 5 + 10} v-15 h-15`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                    <path
                      d={`M${defect.location.x * 5 - 5} ${defect.location.y * 5 + defect.location.height * 5 - 10} v15 h15`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                    <path
                      d={`M${defect.location.x * 5 + defect.location.width * 5 + 5} ${defect.location.y * 5 + defect.location.height * 5 - 10} v15 h-15`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />

                    {/* Pulsing Target Center */}
                    <circle
                      cx={`${(defect.location.x + defect.location.width / 2) * 5}`}
                      cy={`${(defect.location.y + defect.location.height / 2) * 5}`}
                      r="8"
                      fill="none"
                      stroke={defect.severity === 'Critical' ? '#ef4444' : '#f59e0b'}
                      strokeWidth="2.5"
                      className="pulse-reticle"
                    />

                    {/* Millimeter Measurement Dimension Tag */}
                    <text
                      x={`${defect.location.x * 5}`}
                      y={`${defect.location.y * 5 - 8}`}
                      fill={defect.severity === 'Critical' ? '#fca5a5' : '#fde68a'}
                      fontSize="11"
                      fontFamily="var(--mono)"
                      fontWeight="bold"
                    >
                      {defect.dimensions.length_mm} mm × {defect.dimensions.depth_est_mm} mm
                    </text>
                  </g>
                )}

                {/* Reticle Crosshair tracking cursor */}
                {showReticle && isPointerInside && (
                  <g pointerEvents="none">
                    <line x1={cursorCoords.x} y1="0" x2={cursorCoords.x} y2="500" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="0" y1={cursorCoords.y} x2="500" y2={cursorCoords.y} stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={cursorCoords.x} cy={cursorCoords.y} r="18" fill="none" stroke="rgba(0, 240, 255, 0.7)" strokeWidth="1.2" />
                    <circle cx={cursorCoords.x} cy={cursorCoords.y} r="3" fill="#00f0ff" />
                  </g>
                )}
              </svg>
            </div>
          )}
        </div>

        {/* Floating Defect Zone Callout Badge */}
        {defect ? (
          <div className="zone-callout-overlay">
            <div className="zone-tag">
              <span className={`zone-dot pulse-dot ${defect.severity === 'Critical' ? 'pulse-critical' : 'pulse-warning'}`}></span>
              <span>{subAssemblyTab === 'COMBINED' ? defect.zone : `[${subAssemblyTab}] ${defect.zone}`}</span>
            </div>
            <div className="zone-coords mono">
              LOC: X: {defect.location.x}% | Y: {defect.location.y}% | {defect.dimensions?.area_mm2 || 0} mm²
            </div>
          </div>
        ) : !wheel ? (
          <div className="zone-callout-overlay passed">
            <span className="pulse-dot" style={{ backgroundColor: '#00f0ff' }}></span>
            <span>AWAITING SPECIMEN • UPLOAD IMAGE TO RUN DUAL-STREAM INSPECTION</span>
          </div>
        ) : (
          <div className="zone-callout-overlay passed">
            <span className="pulse-dot pulse-pass"></span>
            <span>100% SPEC CONFORMANCE • NO FLAWS IN {subAssemblyTab} STREAM</span>
          </div>
        )}
      </div>

      {/* Footer Metrology Metrics Strip */}
      <div className="viewer-footer-meta">
        <div className="meta-metric">
          <span className="metric-label">{subAssemblyTab} CLASSIFIER</span>
          <span className="metric-val text-white">{defect ? defect.defect_type : 'Nominal Flawless'}</span>
        </div>
        <div className="meta-metric">
          <span className="metric-label">CONFIDENCE</span>
          <span className="metric-val text-cyan">{defect ? `${(defect.confidence * 100).toFixed(1)}%` : '99.8%'}</span>
        </div>
        <div className="meta-metric">
          <span className="metric-label">DEFECT AREA</span>
          <span className="metric-val mono">{defect ? `${defect.dimensions?.area_mm2 || 0} mm²` : '0.0 mm²'}</span>
        </div>
        <div className="meta-metric">
          <span className="metric-label">DEPTH ESTIMATION</span>
          <span className="metric-val mono">{defect ? `~${defect.dimensions?.depth_est_mm || 0} mm` : '0.0 mm'}</span>
        </div>
        <div className="meta-metric">
          <span className="metric-label">INSPECTION TIME</span>
          <span className="metric-val mono text-emerald">&lt; 34 ms</span>
        </div>
      </div>
    </div>
  );
}
