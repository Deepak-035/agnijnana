import React, { useState } from 'react';
import WheelInspection from '../../components/WheelInspection/WheelInspection';
import DefectViewer from '../../components/DefectViewer/DefectViewer';
import SeverityCard from '../../components/SeverityCard/SeverityCard';
import RootCause from '../../components/RootCause/RootCause';
import RiskPrediction from '../../components/RiskPrediction/RiskPrediction';
import Recommendation from '../../components/Recommendation/Recommendation';
import Alerts from '../../components/Alerts/Alerts';
import BatchTable from '../../components/BatchTable/BatchTable';
import MachineStatus from '../../components/MachineStatus/MachineStatus';
import { SAMPLE_WHEELS } from '../../data/mockData';
import './Dashboard.css';

export default function Dashboard({
  selectedWheelIndex,
  setSelectedWheelIndex,
  onNotify,
}) {
  const [customImage, setCustomImage] = useState(null);
  const [customWheelData, setCustomWheelData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Active wheel either from custom image or preset
  const activeWheel = customWheelData || SAMPLE_WHEELS[selectedWheelIndex];

  const handleUploadCustomImage = (dataUrl, fileName) => {
    setCustomImage(dataUrl);
    setIsAnalyzing(true);
    if (onNotify) {
      onNotify(`Uploaded ${fileName}. Running vision defect detection and RCA...`, 'info');
    }

    // Simulate AI inference pipeline
    setTimeout(() => {
      setCustomWheelData({
        wheel_id: `UPLOAD-${Math.floor(1000 + Math.random() * 9000)}`,
        wheel_model: 'Custom Aluminium Alloy Wheel / Rim',
        alloy: 'Aluminium A356.2 T6',
        rim_diameter: '19 inch',
        rim_width: '8.5J',
        spoke_count: 5,
        batch_id: 'BATCH-AL-2026-X89',
        machine_id: 'HPDC-Unit-02',
        production_cycle: 14220,
        inspection_timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        image_type: 'Optical Camera Line Station',
        status: 'DEFECT_DETECTED',
        defect: {
          defect_id: 'DEF-USR-01',
          defect_type: 'Rim Surface Inclusion & Casting Micro-Fissure',
          severity: 'Critical',
          zone: 'Outer Rim Lip Sector 4',
          confidence: 0.932,
          location: { x: 58, y: 26, width: 16, height: 18 },
          dimensions: { length_mm: 16.2, depth_est_mm: 2.1, area_mm2: 34.0 },
          safety_impact: 'Radial fatigue risk exceeds allowable containment limits under SAE J328 test standards.',
          disposition: 'IMMEDIATE_SCRAP',
        },
        rca: {
          root_cause: 'Secondary oxide inclusion entrainment during high-speed plunger shot phase.',
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
      if (onNotify) {
        onNotify('Vision defect localized & root-cause attributed with 89.5% confidence!', 'success');
      }
    }, 900);
  };

  const handleResetCustom = () => {
    setCustomImage(null);
    setCustomWheelData(null);
  };

  const handleTriggerInspection = () => {
    setIsAnalyzing(true);
    if (onNotify) {
      onNotify('Simulating real-time wheel optical scan & edge inference...', 'info');
    }
    setTimeout(() => {
      setIsAnalyzing(false);
      if (onNotify) {
        onNotify('Inspection complete! Edge inference finished in 34ms.', 'success');
      }
    }, 750);
  };

  const handleDispatchAction = (sopCode) => {
    if (onNotify) {
      onNotify(`Dispatched Work Order for ${sopCode} to MES & Maintenance Crew!`, 'success');
    }
  };

  const handleTriggerDisposition = (actionType) => {
    if (onNotify) {
      if (actionType === 'SCRAP_QUARANTINE') {
        onNotify('Component marked as SCRAP. Batch BATCH-AL-2026-X89 locked in MES quarantine pool.', 'error');
      } else if (actionType === 'ROBOTIC_REWORK') {
        onNotify('Component routed to robotic deburring cell #3 for automated polish.', 'warning');
      } else {
        onNotify('Component quality approved! Line release signal dispatched.', 'success');
      }
    }
  };

  return (
    <div className="dashboard-page">
      {/* Top Controls & Metadata Bar */}
      <WheelInspection
        wheels={SAMPLE_WHEELS}
        selectedWheelIndex={selectedWheelIndex}
        onSelectWheel={setSelectedWheelIndex}
        customImage={customImage}
        onUploadCustomImage={handleUploadCustomImage}
        onResetCustomImage={handleResetCustom}
        onTriggerInspection={handleTriggerInspection}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Inspection & Severity Row */}
      <div className="dashboard-grid-row">
        <DefectViewer wheel={activeWheel} customImage={customImage} />
        <SeverityCard wheel={activeWheel} onTriggerDisposition={handleTriggerDisposition} />
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

      {/* Production Traceability & Machine Fleet */}
      <div className="dashboard-grid-row">
        <BatchTable />
        <MachineStatus />
      </div>
    </div>
  );
}
