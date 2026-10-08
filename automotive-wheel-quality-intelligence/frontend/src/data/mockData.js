/**
 * Mock Data for Aluminium Alloy Automotive Wheel Quality Intelligence System
 * Track: AI-Based Automotive Component Quality Inspection — Singularity 2026
 *
 * All parameters match the project architecture:
 * - Wheel Entities (wheel_id, wheel_model, batch_id, machine_id, cycle, alloy, dimensions)
 * - Defect Detection (defect_type, bounding box [x,y,w,h], confidence, zone, dimensions)
 * - Defect Severity (Low vs Critical, safety rationale, SAE/ISO impact standard)
 * - Process Root-Cause Analysis (Die temp, injection pressure, plunger speed, degassing flow, SHAP attribution)
 * - Future Risk Forecasting (machine failure probability, cycle trend)
 * - Corrective Recommendations (SOP code, actionable maintenance procedure, priority)
 * - Batch Quarantine & Equipment Telemetry (HPDC/LPDC/CNC machines, melt batches)
 */

export const SAMPLE_WHEELS = [
  {
    wheel_id: 'WH-8041-A356',
    wheel_model: 'Apex-Forged 19" Diamond-Cut Y-Spoke',
    alloy: 'Aluminium A356.2-T6',
    rim_diameter: '19 inch',
    rim_width: '8.5J',
    spoke_count: 10,
    batch_id: 'BATCH-AL-2026-X89',
    machine_id: 'HPDC-Unit-02',
    production_cycle: 14208,
    inspection_timestamp: '2026-10-08 15:42:10 UTC',
    image_type: 'Optical + Polarized Surface Laser',
    status: 'DEFECT_DETECTED',
    
    // Defect Localization & Classification
    defect: {
      defect_id: 'DEF-8041-01',
      defect_type: 'Rim Casting Crack',
      severity: 'Critical',
      zone: 'Outer Rim Bead (2 o\'clock position)',
      confidence: 0.968,
      location: { x: 68, y: 22, width: 14, height: 18 }, // percentages
      dimensions: { length_mm: 18.4, depth_est_mm: 2.8, area_mm2: 42.6 },
      safety_impact: 'Catastrophic dynamic rim fracture risk during high-speed cornering load (SAE J328 violation). Cannot be reworked.',
      disposition: 'IMMEDIATE_SCRAP',
    },

    // Process Root-Cause Analysis (RCA)
    rca: {
      root_cause: 'Premature Die Chilling (<610°C) during cavity filling phase leading to cold shut and thermal tensile fracture.',
      confidence: 0.924,
      sensor_telemetry: [
        { name: 'Die Cavity Temp', value: 604, unit: '°C', normal_min: 670, normal_max: 710, status: 'CRITICAL_LOW' },
        { name: 'Hydraulic Injection Pressure', value: 142, unit: 'bar', normal_min: 110, normal_max: 125, status: 'HIGH' },
        { name: 'Plunger Shot Velocity', value: 2.7, unit: 'm/s', normal_min: 3.1, normal_max: 3.4, status: 'LOW' },
        { name: 'Melt Degassing Nitrogen Flow', value: 18.2, unit: 'L/min', normal_min: 16.0, normal_max: 20.0, status: 'NORMAL' },
        { name: 'Cooling Gate #2 Flow', value: 14.8, unit: 'L/min', normal_min: 10.0, normal_max: 12.0, status: 'HIGH_CHILL' },
        { name: 'Spindle Vibration RMS', value: 1.2, unit: 'mm/s', normal_min: 0.8, normal_max: 1.8, status: 'NORMAL' },
      ],
      shap_attributions: [
        { feature: 'Die Cavity Temp Drop', impact: 48, direction: 'negative' },
        { feature: 'Injection Pressure Spike', impact: 29, direction: 'negative' },
        { feature: 'Cooling Gate #2 Over-chill', impact: 16, direction: 'negative' },
        { feature: 'Plunger Velocity Lags', impact: 7, direction: 'negative' },
      ],
    },

    // Predictive Risk
    risk: {
      future_risk_score: 0.78, // 78% risk for subsequent cycles
      machine_health_status: 'DEGRADED',
      risk_level: 'High Risk',
      cycles_until_maintenance: 18,
      trend: [62, 65, 71, 74, 78],
      forecast_message: 'HPDC-Unit-02 thermal jacket showing 14% cooling valve hysteresis. High probability of recurring cold shuts in next 10 cycles.',
    },

    // Corrective Recommendation
    recommendation: {
      sop_code: 'SOP-AL-CAST-042',
      title: 'Die Thermal Calibration & Gate Coolant Recalibration',
      action: 'Increase thermal jacket setpoint on Die Cavity Sector 2 to 690°C. Throttle cooling circuit gate #2 by 25%. Inspect hydraulic valve proportional response on plunger unit.',
      priority: 'IMMEDIATE',
      assigned_team: 'HPDC Die Maintenance Crew #A',
      estimated_downtime_min: 25,
    },

    affected_batches: ['BATCH-AL-2026-X89'],
    quarantine_count: 14,
  },

  {
    wheel_id: 'WH-9204-A356',
    wheel_model: 'Sport-Turbine 18" Gloss Anthracite',
    alloy: 'Aluminium A356.2',
    rim_diameter: '18 inch',
    rim_width: '8.0J',
    spoke_count: 5,
    batch_id: 'BATCH-AL-2026-X89',
    machine_id: 'HPDC-Unit-02',
    production_cycle: 14214,
    inspection_timestamp: '2026-10-08 15:46:30 UTC',
    image_type: 'X-Ray Radioscopic Sub-Surface Scan',
    status: 'DEFECT_DETECTED',
    
    defect: {
      defect_id: 'DEF-9204-01',
      defect_type: 'Gas Porosity Cluster',
      severity: 'Critical',
      zone: 'Spoke #3 Root Junction (Structural Load Path)',
      confidence: 0.945,
      location: { x: 38, y: 55, width: 16, height: 14 },
      dimensions: { length_mm: 12.1, depth_est_mm: 3.4, area_mm2: 38.2 },
      safety_impact: 'Internal microporosity exceeds ASTM E505 Level 2 threshold. Spoke fatigue failure under radial impact test.',
      disposition: 'IMMEDIATE_SCRAP',
    },

    rca: {
      root_cause: 'Dissolved Hydrogen gas entrapment caused by depleted rotary degassing lance in holding furnace.',
      confidence: 0.912,
      sensor_telemetry: [
        { name: 'Die Cavity Temp', value: 682, unit: '°C', normal_min: 670, normal_max: 710, status: 'NORMAL' },
        { name: 'Hydraulic Injection Pressure', value: 118, unit: 'bar', normal_min: 110, normal_max: 125, status: 'NORMAL' },
        { name: 'Plunger Shot Velocity', value: 3.2, unit: 'm/s', normal_min: 3.1, normal_max: 3.4, status: 'NORMAL' },
        { name: 'Melt Degassing Nitrogen Flow', value: 9.4, unit: 'L/min', normal_min: 16.0, normal_max: 20.0, status: 'CRITICAL_LOW' },
        { name: 'Cooling Gate #2 Flow', value: 11.2, unit: 'L/min', normal_min: 10.0, normal_max: 12.0, status: 'NORMAL' },
        { name: 'Melt Density Index', value: 1.84, unit: '%', normal_min: 0.9, normal_max: 1.2, status: 'HIGH_GAS' },
      ],
      shap_attributions: [
        { feature: 'Degassing Nitrogen Flow Deficit', impact: 54, direction: 'negative' },
        { feature: 'Melt Density Index Variance', impact: 31, direction: 'negative' },
        { feature: 'Holding Furnace Dwell Time', impact: 11, direction: 'negative' },
        { feature: 'Ambient Humidity Elevation', impact: 4, direction: 'negative' },
      ],
    },

    risk: {
      future_risk_score: 0.85,
      machine_health_status: 'DEGRADED',
      risk_level: 'High Risk',
      cycles_until_maintenance: 8,
      trend: [58, 69, 74, 81, 85],
      forecast_message: 'Ladle #4 melt degassing efficiency dropped below 50%. Entire current lot at risk of sub-surface gas porosity.',
    },

    recommendation: {
      sop_code: 'SOP-MNT-DEG-019',
      title: 'Rotary Degassing Rotor Inspection & Flux Injection',
      action: 'Purge degassing rotor lance with 99.99% dry Argon/Nitrogen at 22 L/min. Inject secondary cleaning flux into holding well #2. Halt ladle transfer until D-Index < 1.1%.',
      priority: 'IMMEDIATE',
      assigned_team: 'Metallurgy Melt Quality Team',
      estimated_downtime_min: 18,
    },

    affected_batches: ['BATCH-AL-2026-X89', 'BATCH-AL-2026-X90'],
    quarantine_count: 26,
  },

  {
    wheel_id: 'WH-7719-A356',
    wheel_model: 'Monoblock Aero-Mesh 20" Forged Style',
    alloy: 'AlSi7Mg0.3 (A356)',
    rim_diameter: '20 inch',
    rim_width: '9.0J',
    spoke_count: 15,
    batch_id: 'BATCH-AL-2026-X88',
    machine_id: 'CNC-Lathe-04',
    production_cycle: 8432,
    inspection_timestamp: '2026-10-08 15:30:15 UTC',
    image_type: 'High-Res Optical Rim Lip Camera',
    status: 'DEFECT_DETECTED',
    
    defect: {
      defect_id: 'DEF-7719-01',
      defect_type: 'Machining Edge Burr',
      severity: 'Low',
      zone: 'Outer Rim Lip Flange (Circumferential edge)',
      confidence: 0.941,
      location: { x: 52, y: 15, width: 22, height: 8 },
      dimensions: { length_mm: 24.0, depth_est_mm: 0.4, area_mm2: 9.6 },
      safety_impact: 'Cosmetic edge roughness. Does not compromise structural tensile integrity or bead seal. Suitable for robotic deburring station rework.',
      disposition: 'REWORK_REPAIR',
    },

    rca: {
      root_cause: 'CNC turning insert flank wear (VB > 0.28mm) and chip recutting on outer rim bevel contour.',
      confidence: 0.887,
      sensor_telemetry: [
        { name: 'Die Cavity Temp', value: 24, unit: '°C', normal_min: 20, normal_max: 30, status: 'NORMAL' },
        { name: 'CNC Spindle Speed', value: 2150, unit: 'RPM', normal_min: 2200, normal_max: 2400, status: 'SLIGHT_LOW' },
        { name: 'Cutting Feed Rate', value: 0.22, unit: 'mm/rev', normal_min: 0.18, normal_max: 0.20, status: 'HIGH' },
        { name: 'Spindle Vibration RMS', value: 2.8, unit: 'mm/s', normal_min: 0.8, normal_max: 1.5, status: 'WARNING_HIGH' },
        { name: 'Coolant Flow Rate', value: 34, unit: 'L/min', normal_min: 35, normal_max: 42, status: 'NORMAL' },
        { name: 'Tool Edge Wear Index', value: 0.32, unit: 'mm', normal_min: 0.05, normal_max: 0.25, status: 'EXCEEDED' },
      ],
      shap_attributions: [
        { feature: 'Diamond Insert Flank Wear', impact: 52, direction: 'negative' },
        { feature: 'Spindle High-Freq Vibration', impact: 28, direction: 'negative' },
        { feature: 'Excess Cutting Feed', impact: 14, direction: 'negative' },
        { feature: 'Coolant Jet Alignment', impact: 6, direction: 'negative' },
      ],
    },

    risk: {
      future_risk_score: 0.42,
      machine_health_status: 'CALIBRATION_WARNING',
      risk_level: 'Medium Risk',
      cycles_until_maintenance: 34,
      trend: [22, 28, 34, 39, 42],
      forecast_message: 'CNC-Lathe-04 tool insert pocket #3 reached 94% wear life. Tool indexing recommended within 40 cuts.',
    },

    recommendation: {
      sop_code: 'SOP-CNC-TOOL-008',
      title: 'CNC Indexable Insert Indexing & Flange Deburr Cycle',
      action: 'Rotate PCD diamond insert index on Station 4. Dispatch wheel WH-7719 to secondary automated nylon-brush deburring station for 45s buffing cycle.',
      priority: 'SCHEDULED_SHIFT_END',
      assigned_team: 'CNC Machining Operations',
      estimated_downtime_min: 5,
    },

    affected_batches: ['BATCH-AL-2026-X88'],
    quarantine_count: 3,
  },

  {
    wheel_id: 'WH-6512-A356',
    wheel_model: 'Split-5 Spoke Cast Wheel 17" Raw Cast',
    alloy: 'Aluminium A356.2',
    rim_diameter: '17 inch',
    rim_width: '7.5J',
    spoke_count: 5,
    batch_id: 'BATCH-AL-2026-X87',
    machine_id: 'LPDC-Unit-03',
    production_cycle: 9104,
    inspection_timestamp: '2026-10-08 15:15:40 UTC',
    image_type: 'Industrial Radioscopic CT Scan',
    status: 'DEFECT_DETECTED',
    
    defect: {
      defect_id: 'DEF-6512-01',
      defect_type: 'Hub Shrinkage Cavity',
      severity: 'Critical',
      zone: 'Center Hub Bore / Bolt Circle Web',
      confidence: 0.952,
      location: { x: 44, y: 43, width: 14, height: 14 },
      dimensions: { length_mm: 14.8, depth_est_mm: 4.1, area_mm2: 52.0 },
      safety_impact: 'Volumetric shrinkage void within bolt seat webbing. Extreme risk of hub shearing during lug-nut torque application (SAE J2530 failure).',
      disposition: 'IMMEDIATE_SCRAP',
    },

    rca: {
      root_cause: 'Secondary intensification pressure cutoff prematurely before solidification of thick hub cross-section.',
      confidence: 0.938,
      sensor_telemetry: [
        { name: 'Die Cavity Temp', value: 672, unit: '°C', normal_min: 670, normal_max: 710, status: 'NORMAL' },
        { name: 'LPDC Holding Pressure', value: 0.82, unit: 'bar', normal_min: 0.95, normal_max: 1.15, status: 'CRITICAL_LOW' },
        { name: 'Solidification Hold Time', value: 82, unit: 's', normal_min: 110, normal_max: 130, status: 'CRITICAL_LOW' },
        { name: 'Stalker Tube Temp', value: 728, unit: '°C', normal_min: 720, normal_max: 745, status: 'NORMAL' },
        { name: 'Top Die Chill Pressure', value: 4.8, unit: 'bar', normal_min: 4.5, normal_max: 5.5, status: 'NORMAL' },
        { name: 'Cycle Time', value: 165, unit: 's', normal_min: 190, normal_max: 215, status: 'ABNORMAL_FAST' },
      ],
      shap_attributions: [
        { feature: 'Hold Pressure Duration Deficit', impact: 59, direction: 'negative' },
        { feature: 'Low Pressure Stalker Feed', impact: 23, direction: 'negative' },
        { feature: 'Hub Chill Flow Rate', impact: 12, direction: 'negative' },
        { feature: 'Pouring Melt Superheat', impact: 6, direction: 'negative' },
      ],
    },

    risk: {
      future_risk_score: 0.74,
      machine_health_status: 'DEGRADED',
      risk_level: 'High Risk',
      cycles_until_maintenance: 12,
      trend: [45, 52, 63, 68, 74],
      forecast_message: 'LPDC-Unit-03 PLC pressure profile timer drifting by -28s. Premature depressurization causing recurrent central shrinkage.',
    },

    recommendation: {
      sop_code: 'SOP-LPDC-PRESS-021',
      title: 'Holding Pressure Profile Reset & Stalker Seal Inspection',
      action: 'Restore solidification hold timer from 82s to 120s on PLC parameter 408. Check pneumatic seal ring on furnace riser stalker tube.',
      priority: 'IMMEDIATE',
      assigned_team: 'Low Pressure Casting Automation Specialist',
      estimated_downtime_min: 15,
    },

    affected_batches: ['BATCH-AL-2026-X87'],
    quarantine_count: 18,
  },

  {
    wheel_id: 'WH-5100-A356',
    wheel_model: 'Track-Spec 19" Ultra-Lightweight Monoblock',
    alloy: 'Aluminium A356.2-T6',
    rim_diameter: '19 inch',
    rim_width: '9.5J',
    spoke_count: 7,
    batch_id: 'BATCH-AL-2026-X91',
    machine_id: 'HPDC-Unit-01',
    production_cycle: 15890,
    inspection_timestamp: '2026-10-08 15:52:00 UTC',
    image_type: 'Multi-Angle Laser Profilometry + Visual RGB',
    status: 'PASSED',
    
    defect: null, // Nominal quality — zero defects detected

    rca: {
      root_cause: 'All process parameters fully nominal and within CPK > 1.67 gold standard quality band.',
      confidence: 0.992,
      sensor_telemetry: [
        { name: 'Die Cavity Temp', value: 688, unit: '°C', normal_min: 670, normal_max: 710, status: 'OPTIMAL' },
        { name: 'Hydraulic Injection Pressure', value: 116, unit: 'bar', normal_min: 110, normal_max: 125, status: 'OPTIMAL' },
        { name: 'Plunger Shot Velocity', value: 3.25, unit: 'm/s', normal_min: 3.1, normal_max: 3.4, status: 'OPTIMAL' },
        { name: 'Melt Degassing Nitrogen Flow', value: 18.5, unit: 'L/min', normal_min: 16.0, normal_max: 20.0, status: 'OPTIMAL' },
        { name: 'Cooling Gate #2 Flow', value: 11.0, unit: 'L/min', normal_min: 10.0, normal_max: 12.0, status: 'OPTIMAL' },
        { name: 'Spindle Vibration RMS', value: 0.95, unit: 'mm/s', normal_min: 0.8, normal_max: 1.8, status: 'OPTIMAL' },
      ],
      shap_attributions: [
        { feature: 'Thermal Equilibrium', impact: 42, direction: 'positive' },
        { feature: 'Degassing Purity Index', impact: 36, direction: 'positive' },
        { feature: 'Velocity Profiling', impact: 22, direction: 'positive' },
      ],
    },

    risk: {
      future_risk_score: 0.05,
      machine_health_status: 'OPTIMAL',
      risk_level: 'Minimal Risk',
      cycles_until_maintenance: 1240,
      trend: [6, 5, 4, 6, 5],
      forecast_message: 'HPDC-Unit-01 running within nominal process envelope. Expected yield > 99.1% for current lot.',
    },

    recommendation: {
      sop_code: 'SOP-STD-RELEASE-001',
      title: 'Automated Line Release & Laser Serialization',
      action: 'Release component WH-5100 to robotic clear-coat painting and dynamic wheel balance testing station. Tag with QR serialization code.',
      priority: 'MONITOR',
      assigned_team: 'Automated Line Quality Gate',
      estimated_downtime_min: 0,
    },

    affected_batches: [],
    quarantine_count: 0,
  },
];

export const MACHINES_DATA = [
  {
    id: 1,
    machine_code: 'HPDC-Unit-01',
    name: 'High Pressure Die Casting Cell #1',
    type: 'Bühler 2800T Carat HPDC',
    line_identifier: 'Line A — Cast Foundry',
    status: 'OPERATIONAL',
    health_score: 96,
    die_temp_c: 688,
    injection_pressure_bar: 116,
    vibration_rms: 0.95,
    cycle_time_s: 72,
    total_shots_today: 482,
    defect_rate: 0.8,
  },
  {
    id: 2,
    machine_code: 'HPDC-Unit-02',
    name: 'High Pressure Die Casting Cell #2',
    type: 'Idra 3200T GigaPress HPDC',
    line_identifier: 'Line A — Cast Foundry',
    status: 'DEGRADED',
    health_score: 64,
    die_temp_c: 604,
    injection_pressure_bar: 142,
    vibration_rms: 1.65,
    cycle_time_s: 79,
    total_shots_today: 430,
    defect_rate: 5.8,
  },
  {
    id: 3,
    machine_code: 'LPDC-Unit-03',
    name: 'Low Pressure Casting Cell #3',
    type: 'Kurtz AL18-16 LPDC System',
    line_identifier: 'Line B — Premium Rims',
    status: 'MAINTENANCE_REQUIRED',
    health_score: 58,
    die_temp_c: 672,
    injection_pressure_bar: 0.82,
    vibration_rms: 1.12,
    cycle_time_s: 165,
    total_shots_today: 210,
    defect_rate: 4.2,
  },
  {
    id: 4,
    machine_code: 'CNC-Lathe-04',
    name: 'CNC Wheel Turning & Milling Station #4',
    type: 'Doosan PUMA 5100LY Dual Spindle',
    line_identifier: 'Line C — Precision Machining',
    status: 'CALIBRATION_WARNING',
    health_score: 78,
    die_temp_c: 24,
    injection_pressure_bar: 70,
    vibration_rms: 2.8,
    cycle_time_s: 114,
    total_shots_today: 340,
    defect_rate: 2.1,
  },
];

export const BATCHES_DATA = [
  {
    id: 101,
    batch_number: 'BATCH-AL-2026-X89',
    alloy: 'Aluminium A356.2 (7.0% Si, 0.35% Mg)',
    melt_heat_no: 'HEAT-9842-T6',
    machine_id: 'HPDC-Unit-02',
    status: 'QUARANTINED',
    inspected_count: 86,
    passed_count: 72,
    scrapped_count: 14,
    rework_count: 0,
    scrap_rate: '16.3%',
    start_time: '2026-10-08 14:00',
    primary_issue: 'Thermal chilling & gas porosity',
  },
  {
    id: 102,
    batch_number: 'BATCH-AL-2026-X90',
    alloy: 'Aluminium A356.2',
    melt_heat_no: 'HEAT-9843-T6',
    machine_id: 'HPDC-Unit-02',
    status: 'UNDER_REVIEW',
    inspected_count: 42,
    passed_count: 36,
    scrapped_count: 6,
    rework_count: 0,
    scrap_rate: '14.2%',
    start_time: '2026-10-08 15:00',
    primary_issue: 'Rotary degassing deficit',
  },
  {
    id: 103,
    batch_number: 'BATCH-AL-2026-X88',
    alloy: 'AlSi7Mg0.3',
    melt_heat_no: 'HEAT-9839-T6',
    machine_id: 'CNC-Lathe-04',
    status: 'IN_PROGRESS',
    inspected_count: 120,
    passed_count: 115,
    scrapped_count: 0,
    rework_count: 5,
    scrap_rate: '0.0%',
    start_time: '2026-10-08 12:30',
    primary_issue: 'Outer lip cosmetic edge burr (reworked)',
  },
  {
    id: 104,
    batch_number: 'BATCH-AL-2026-X91',
    alloy: 'Aluminium A356.2-T6',
    melt_heat_no: 'HEAT-9845-T6',
    machine_id: 'HPDC-Unit-01',
    status: 'RELEASED',
    inspected_count: 140,
    passed_count: 139,
    scrapped_count: 1,
    rework_count: 0,
    scrap_rate: '0.7%',
    start_time: '2026-10-08 13:15',
    primary_issue: 'Nominal quality pass',
  },
];

export const SYSTEM_ALERTS = [
  {
    id: 'ALT-901',
    timestamp: '2 mins ago',
    severity: 'CRITICAL',
    title: 'Batch Quarantine Initiated — BATCH-AL-2026-X89',
    message: '14 consecutive wheels failed SAE J328 fatigue criteria due to rim casting cracks and spoke porosity. Line A diverted.',
    source: 'Vision Defect + Severity Engine',
    machine_id: 'HPDC-Unit-02',
  },
  {
    id: 'ALT-902',
    timestamp: '8 mins ago',
    severity: 'WARNING',
    title: 'Process Drift: Melt Degassing Nitrogen Flow Depleted',
    message: 'Nitrogen gas lance delivery dropped to 9.4 L/min (min threshold 16 L/min). Hydrogen porosity risk at 85%.',
    source: 'RCA Parameter Correlator',
    machine_id: 'HPDC-Unit-02',
  },
  {
    id: 'ALT-903',
    timestamp: '18 mins ago',
    severity: 'WARNING',
    title: 'Tool Wear Alert — CNC-Lathe-04 Insert #4',
    message: 'Spindle vibration RMS reached 2.8 mm/s on outer lip turning pass. Cosmetic burr threshold reached.',
    source: 'Predictive Risk Forecaster',
    machine_id: 'CNC-Lathe-04',
  },
  {
    id: 'ALT-904',
    timestamp: '35 mins ago',
    severity: 'INFO',
    title: 'Production Lot BATCH-AL-2026-X91 Cleared',
    message: '139 / 140 alloy wheels passed full multi-angle inspection. CPK = 1.72. Released for powder coat.',
    source: 'MES Gatekeeper',
    machine_id: 'HPDC-Unit-01',
  },
];

export const PIPELINE_SPECS = {
  track: 'Track 3: AI-Based Automotive Component Quality Inspection',
  hackathon: 'SINGULARITY 2026',
  component_focus: 'Aluminium Alloy Wheels & Rims (High-Pressure Die Cast, LPDC, CNC Machined)',
  architecture: [
    { step: 1, title: 'Wheel Optical / X-Ray Line Ingestion', latency: '12 ms', desc: 'Captures high-res rim surface image or radioscopic density scan with synchronized machine shot metadata.' },
    { step: 2, title: 'AI Defect Detection & Localization', latency: '38 ms', desc: 'Spatial bounding box and segmentation overlay with confidence scores for cracks, porosities, cavities, and burrs.' },
    { step: 3, title: 'Dual-Stage Severity Classifier', latency: '8 ms', desc: 'Classifies defects into Low (reworkable cosmetic) vs Critical (immediate wheel scrap based on structural safety).' },
    { step: 4, title: 'Process Telemetry Ingestion (SCADA/PLC)', latency: '5 ms', desc: 'Syncs synchronized furnace temps, injection pressure curves, plunger shot speeds, and degassing flows.' },
    { step: 5, title: 'Explainable Root Cause Analysis (RCA)', latency: '22 ms', desc: 'Physics-informed tabular model computes SHAP attribution to identify the exact machine/casting anomaly.' },
    { step: 6, title: 'Predictive Defect Risk Forecasting', latency: '15 ms', desc: 'Forecasts probability of defect recurrence in subsequent cycles and evaluates machine health degradation.' },
    { step: 7, title: 'Prescriptive Countermeasures & SOP', latency: '10 ms', desc: 'Auto-generates Standard Operating Procedure codes and dispatches maintenance tickets and batch quarantines.' },
  ],
  team: [
    { name: 'Ashish', role: 'Backend & FastAPI Lead', focus: 'FastAPI microservices, REST contracts (/inspection, /defects, /root-cause), DB transactions, RBAC validation.' },
    { name: 'Ganesh', role: 'Frontend & UI Lead', focus: 'React + Vite Quality Intelligence Cockpit, defect bounding overlays, interactive RCA, operator UX, and telemetry dashboards.' },
    { name: 'Deepak', role: 'Database & Schema Lead', focus: 'PostgreSQL 15 domain schema, relational entities (machines, batches, components, defects, process_data, alerts).' },
    { name: 'Vijeath', role: 'Data & AI/ML Lead', focus: 'Aluminium wheel dataset curation, CV detection models, severity rules, tabular RCA attribution, and risk forecasting.' },
  ],
};
