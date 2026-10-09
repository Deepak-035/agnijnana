import React, { useState, useEffect } from 'react';
import WheelInspection from '../../components/WheelInspection/WheelInspection';
import DefectViewer from '../../components/DefectViewer/DefectViewer';
import SeverityCard from '../../components/SeverityCard/SeverityCard';
import RootCause from '../../components/RootCause/RootCause';
import RiskPrediction from '../../components/RiskPrediction/RiskPrediction';
import Recommendation from '../../components/Recommendation/Recommendation';
import Alerts from '../../components/Alerts/Alerts';
import BatchTable from '../../components/BatchTable/BatchTable';
import MachineStatus from '../../components/MachineStatus/MachineStatus';
import HistoricalTrends from '../../components/HistoricalTrends/HistoricalTrends';
import InspectionCertificateModal from '../../components/InspectionCertificateModal/InspectionCertificateModal';
import { SAMPLE_WHEELS } from '../../data/mockData';
import './Dashboard.css';

// Audio feedback helper using Web Audio API (zero external assets needed)
function playIndustrialTone(type = 'chime') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'pass') {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'crit') {
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // Audio context not allowed or unsupported
  }
}

export default function Dashboard({
  selectedWheelIndex,
  setSelectedWheelIndex,
  onNotify,
}) {
  const [customImage, setCustomImage] = useState(null);
  const [customWheelData, setCustomWheelData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Active wheel either from custom image or preset
  const activeWheel = customWheelData || SAMPLE_WHEELS[selectedWheelIndex];

  // Hotkey Navigation Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleTriggerInspection();
      } else if (e.key === 'a' || e.key === 'A') {
        handleTriggerDisposition('LINE_RELEASE');
      } else if (e.key === 'x' || e.key === 'X') {
        handleTriggerDisposition('SCRAP_QUARANTINE');
      } else if (e.key === 'w' || e.key === 'W') {
        handleTriggerDisposition('ROBOTIC_REWORK');
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < SAMPLE_WHEELS.length) {
          handleResetCustom();
          setSelectedWheelIndex(idx);
          playIndustrialTone('click');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWheelIndex]);

  const handleUploadCustomImage = (dataUrl, fileName) => {
    setCustomImage(dataUrl);
    setIsAnalyzing(true);
    playIndustrialTone('click');
    if (onNotify) {
      onNotify(`Uploaded ${fileName}. Running vision defect detection and RCA...`, 'info');
    }

    // Simulate AI dual-stream inference pipeline (Rim Classifier + Tyre Classifier -> Combined Verdict)
    setTimeout(() => {
      setCustomWheelData({
        wheel_id: `UPLOAD-${Math.floor(1000 + Math.random() * 9000)}`,
        wheel_model: 'Alloy Wheel & Tyre Assembly',
        alloy: 'Aluminium A356.2 T6 / Radial Ply Casing',
        rim_diameter: '19 inch',
        rim_width: '8.5J',
        spoke_count: 5,
        batch_id: 'BATCH-AL-2026-X89',
        machine_id: 'HPDC-Unit-02',
        production_cycle: 14220,
        inspection_timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        image_type: 'Optical RGB + Radioscopic Ingestion',
        status: 'DEFECT_DETECTED',
        // Dual Sub-Assembly Inferences
        rim_inspection: {
          sub_assembly: 'Rim Sub-Assembly',
          classifier: '9-Class Rim Inspection Model',
          detected_defect: 'porosity',
          defect_name: 'Gas Porosity Cluster',
          severity: 'Critical',
          confidence: 0.942,
          zone: 'Outer Rim Lip Sector 4',
          location: { x: 58, y: 26, width: 16, height: 18 },
          dimensions: { length_mm: 14.8, depth_est_mm: 1.9, area_mm2: 28.1 },
        },
        tyre_inspection: {
          sub_assembly: 'Tyre Sub-Assembly',
          classifier: '14-Class Tyre Inspection Model (0–13)',
          class_id: 1,
          detected_defect: 'Bulge',
          defect_name: 'Sidewall Bulge (Carcass Rupture)',
          severity: 'Critical',
          confidence: 0.915,
          zone: 'Lower Sidewall Quadrant 1',
          location: { x: 74, y: 48, width: 14, height: 16 },
          dimensions: { length_mm: 22.4, depth_est_mm: 3.2, area_mm2: 45.6 },
        },
        combined_verdict: {
          overall_status: 'DEFECT_DETECTED',
          overall_severity: 'Critical',
          verdict_summary: 'QUARANTINE: Both Rim (Porosity) & Tyre (Bulge) breached structural thresholds.',
          release_authorized: false,
          disposition: 'IMMEDIATE_SCRAP',
        },
        defect: {
          defect_id: 'DEF-USR-DUAL-01',
          defect_type: 'Rim Gas Porosity & Tyre Sidewall Bulge',
          severity: 'Critical',
          zone: 'Rim Bead Seat & Tyre Sidewall',
          confidence: 0.942,
          location: { x: 58, y: 26, width: 16, height: 18 },
          dimensions: { length_mm: 16.2, depth_est_mm: 2.1, area_mm2: 34.0 },
          safety_impact: 'Radial fatigue risk exceeds allowable containment limits under SAE J328 & FMVSS-139.',
          disposition: 'IMMEDIATE_SCRAP',
        },
        rca: {
          root_cause: 'Secondary oxide inclusion during shot phase combined with carcass ply vulcanization defect.',
          confidence: 0.895,
          sensor_telemetry: [
            { name: 'Die Cavity Temp', value: 642, unit: '°C', normal_min: 670, normal_max: 710, status: 'SLIGHT_LOW' },
            { name: 'Hydraulic Injection Pressure', value: 135, unit: 'bar', normal_min: 110, normal_max: 125, status: 'HIGH' },
            { name: 'Plunger Shot Velocity', value: 3.45, unit: 'm/s', normal_min: 3.1, normal_max: 3.4, status: 'SLIGHT_HIGH' },
            { name: 'Melt Degassing Nitrogen Flow', value: 14.5, unit: 'L/min', normal_min: 16.0, normal_max: 20.0, status: 'WARNING_LOW' },
            { name: 'Cooling Gate #2 Flow', value: 12.1, unit: 'L/min', normal_min: 10.0, normal_max: 12.0, status: 'NORMAL' },
            { name: 'Spindle Vibration RMS', value: 1.15, unit: 'mm/s', normal_min: 0.8, normal_max: 1.8, status: 'NORMAL' },
          ],
          shap_attributions: [
            { feature: 'Plunger Shot Turbulence', impact: 46, direction: 'negative' },
            { feature: 'Degassing Nitrogen Flow Deficit', impact: 32, direction: 'negative' },
            { feature: 'Die Temperature Variance', impact: 22, direction: 'negative' },
          ],
        },
        risk: {
          future_risk_score: 0.68,
          machine_health_status: 'DEGRADED',
          risk_level: 'High Risk',
          cycles_until_maintenance: 16,
          trend: [48, 54, 61, 65, 68],
          forecast_message: 'High shot turbulence on HPDC-Unit-02 plunger sleeve. Oxide inclusions likely to recur.',
        },
        recommendation: {
          sop_code: 'SOP-AL-CAST-071',
          title: 'Plunger Velocity Profile Smoothing & Dross Skimming',
          action: 'Recalibrate Phase-2 plunger transition point. Perform ladle surface dross skimming before next pour.',
          priority: 'IMMEDIATE',
          assigned_team: 'HPDC Die Maintenance Crew #A',
          estimated_downtime_min: 15,
        },
        affected_batches: ['BATCH-AL-2026-X89'],
        quarantine_count: 14,
      });
      setIsAnalyzing(false);
      playIndustrialTone('crit');
      if (onNotify) {
        onNotify('Dual-stream classification complete: Rim & Tyre evaluated individually and synthesized!', 'success');
      }
    }, 900);
  };

  const handleResetCustom = () => {
    setCustomImage(null);
    setCustomWheelData(null);
  };

  const handleTriggerInspection = () => {
    setIsAnalyzing(true);
    playIndustrialTone('click');
    if (onNotify) {
      onNotify('Running optical scan & defect analysis...', 'info');
    }
    setTimeout(() => {
      setIsAnalyzing(false);
      const isDefect = !!activeWheel?.defect;
      playIndustrialTone(isDefect ? 'crit' : 'pass');
      if (onNotify) {
        onNotify(
          activeWheel
            ? 'Inspection complete! Dual-stream analysis finished in 34ms.'
            : 'Inspection scanner standby: Please upload a specimen image to inspect.',
          activeWheel ? 'success' : 'info'
        );
      }
    }, 750);
  };

  const handleDispatchAction = (sopCode) => {
    playIndustrialTone('pass');
    if (onNotify) {
      onNotify(`Dispatched Work Order for ${sopCode} to MES & Maintenance Crew!`, 'success');
    }
  };

  const handleTriggerDisposition = (actionType) => {
    if (actionType === 'SCRAP_QUARANTINE') {
      playIndustrialTone('crit');
      if (onNotify) {
        onNotify('Component marked as SCRAP. Batch locked in MES quarantine pool.', 'error');
      }
    } else if (actionType === 'ROBOTIC_REWORK') {
      playIndustrialTone('click');
      if (onNotify) {
        onNotify('Component routed to robotic deburring cell #3 for polish.', 'warning');
      }
    } else {
      playIndustrialTone('pass');
      if (onNotify) {
        onNotify('Component quality approved! Line release signal dispatched.', 'success');
      }
    }
  };

  return (
    <div className="dashboard-page">
      {/* Live Plant Telemetry Ribbon */}
      <div className="cockpit-live-telemetry-bar">
        <div className="telemetry-bar-left">
          <div className="pulse-indicator">
            <span className="telemetry-beacon"></span>
            <span className="telemetry-status-text mono">PLANT SCADA: ACTIVE</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">TAKT:</span>
            <span className="chip-val text-emerald">34ms</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">LINE SPEED:</span>
            <span className="chip-val text-cyan">142 RIMS/HR</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">MELT / DIE:</span>
            <span className="chip-val">682°C • 122 BAR</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">YIELD:</span>
            <span className="chip-val text-emerald">97.8% FPY</span>
          </div>
        </div>

        <div className="telemetry-bar-right">
          <div className="hotkeys-guide-pill mono">
            <span>SHORTCUTS:</span>
            <kbd>Space</kbd> Scan • <kbd>A</kbd> Pass • <kbd>X</kbd> Scrap • <kbd>W</kbd> Rework
          </div>
        </div>
      </div>

      {/* Top Controls & Metadata Bar */}
      <WheelInspection
        wheels={SAMPLE_WHEELS}
        activeWheel={activeWheel}
        selectedWheelIndex={selectedWheelIndex}
        onSelectWheel={setSelectedWheelIndex}
        customImage={customImage}
        onUploadCustomImage={handleUploadCustomImage}
        onResetCustomImage={handleResetCustom}
        onTriggerInspection={handleTriggerInspection}
        isAnalyzing={isAnalyzing}
        onOpenCertificate={() => setIsCertModalOpen(true)}
        onNotify={onNotify}
      />

      {/* Main Inspection & Severity Row */}
      <div className="dashboard-grid-row">
        <DefectViewer
          wheel={activeWheel}
          customImage={customImage}
          onUploadCustomImage={handleUploadCustomImage}
          onNotify={onNotify}
        />
        <SeverityCard
          wheel={activeWheel}
          onTriggerDisposition={handleTriggerDisposition}
          onNotify={onNotify}
        />
      </div>

      {/* Root-Cause & Risk Forecasting Row */}
      <div className="dashboard-grid-row">
        <RootCause wheel={activeWheel} />
        <RiskPrediction wheel={activeWheel} />
      </div>

      {/* Prescriptive Countermeasures */}
      <div className="dashboard-grid-row">
        <Recommendation wheel={activeWheel} onDispatchAction={handleDispatchAction} />
        <Alerts />
      </div>

      {/* Inspection Quality Certificate Modal */}
      {isCertModalOpen && (
        <InspectionCertificateModal
          wheel={activeWheel}
          onClose={() => setIsCertModalOpen(false)}
        />
      )}
    </div>
  );
}
