/**
 * Wheel & Tyre Quality Intelligence — Data Contracts & Schemas
 * Track: AI-Based Automotive Component Quality Inspection — Singularity 2026
 *
 * Mock data has been removed. All collections are initialized as empty arrays
 * awaiting live FastAPI stream connectivity and SCADA ingestion.
 */

// Production Data Collections (Initialized empty for real-time / live API mode)
export const SAMPLE_WHEELS = [];
export const MACHINES_DATA = [];
export const BATCHES_DATA = [];
export const SYSTEM_ALERTS = [];
export const BATCH_PROPAGATION_FORECAST = [];

// Static Model Taxonomy: 9 Rim Defect Classes
export const RIM_DEFECT_CLASSES = [
  { id: 1, key: 'rim_defect', name: 'Rim Defect / Bead Seat Flaw', severity: 'Critical', category: 'Geometry' },
  { id: 2, key: 'scratch', name: 'Surface Handling Scratch', severity: 'Low', category: 'Handling' },
  { id: 3, key: 'blow_hole', name: 'Sub-Surface Blow Hole', severity: 'Critical', category: 'Casting' },
  { id: 4, key: 'incomplete_welding', name: 'Incomplete Rim Weld Seam', severity: 'Critical', category: 'Welding' },
  { id: 5, key: 'bent_rim', name: 'Bent Rim (Radial Runout)', severity: 'Critical', category: 'Runout' },
  { id: 6, key: 'crack', name: 'Casting / Structural Crack', severity: 'Critical', category: 'Casting' },
  { id: 7, key: 'porosity', name: 'Gas Porosity Cluster', severity: 'Critical', category: 'Degassing' },
  { id: 8, key: 'scuff', name: 'Outer Rim Lip Scuff', severity: 'Low', category: 'Finishing' },
  { id: 9, key: 'paint_damage', name: 'Clear-Coat / Paint Delamination', severity: 'Low', category: 'Coating' },
];

// Static Model Taxonomy: 14 Tyre Defect Classes (Classes 0 to 13)
export const TYRE_DEFECT_CLASSES = [
  { id: 0, key: 'Generic_Defect', name: 'Generic Tyre Defect', severity: 'Critical', description: 'Unclassified sidewall / tread structural anomaly' },
  { id: 1, key: 'Bulge', name: 'Sidewall Bulge', severity: 'Critical', description: 'Carcass ply rupture causing sidewall blister (blowout risk)' },
  { id: 2, key: 'Cracks', name: 'Sidewall / Tread Cracks', severity: 'Critical', description: 'Ozone weather checking or structural carcass flex fatigue' },
  { id: 3, key: 'Flat_Spots', name: 'Tread Flat Spot', severity: 'Low', description: 'High-speed emergency braking friction abrasion spot' },
  { id: 4, key: 'Good', name: 'Good Tyre', severity: 'Pass', description: 'Nominal conforming tyre carcass and tread profile' },
  { id: 5, key: 'Pitting', name: 'Rubber Tread Pitting', severity: 'Low', description: 'Superficial rubber compound surface micro-voids' },
  { id: 6, key: 'Puncture', name: 'Tread Puncture', severity: 'Critical', description: 'Sharp foreign object penetration through breaker belt' },
  { id: 7, key: 'Bad_Tire', name: 'Catastrophic Bad Tyre', severity: 'Critical', description: 'Severe casing failure requiring immediate quarantine' },
  { id: 8, key: 'Bald_Tire', name: 'Bald Tyre (Worn Tread)', severity: 'Critical', description: 'Tread depth below legal Tread Wear Indicator (<1.6mm)' },
  { id: 9, key: 'Normal_Tire', name: 'Normal Conforming Tyre', severity: 'Pass', description: 'Tread depth and carcass uniformity fully compliant' },
  { id: 10, key: 'Xray_Open', name: 'X-Ray Open Splice Defect', severity: 'Critical', description: 'Radioscopic internal body ply splice separation' },
  { id: 11, key: 'Cord_Defect', name: 'Carcass Cord Defect', severity: 'Critical', description: 'Displaced or severed internal polyester/steel radial cords' },
  { id: 12, key: 'Impurity', name: 'Trapped Foreign Impurity', severity: 'Critical', description: 'Foreign slag or metal particles embedded in tread rubber' },
  { id: 13, key: 'Belt_Defect', name: 'Steel Breaker Belt Defect', severity: 'Critical', description: 'Crown belt layer misalignment or edge separation' },
];

export const DEFECT_TAXONOMY = [...RIM_DEFECT_CLASSES];

export const PIPELINE_SPECS = {
  track: 'Track 3: AI-Based Automotive Component Quality Inspection',
  hackathon: 'SINGULARITY 2026',
  component_focus: 'Aluminium Alloy Rims & Tyre Assemblies (Dual-Inspection Architecture)',
  architecture: [
    { step: 1, title: 'Wheel Assembly Optical & X-Ray Ingestion', latency: '12 ms', desc: 'Captures high-res rim surface image and radioscopic tyre density scan with synchronized machine metadata.' },
    { step: 2, title: 'Dual-Stream Defect Detection', latency: '38 ms', desc: 'Runs 9-class Rim Defect localization and 14-class Tyre Defect (0-13) classification in parallel.' },
    { step: 3, title: 'Sub-Assembly & Unified Quality Gate', latency: '8 ms', desc: 'Evaluates individual rim and tyre severity, then computes the combined wheel assembly verdict.' },
    { step: 4, title: 'Process Telemetry Ingestion (SCADA/PLC)', latency: '5 ms', desc: 'Syncs furnace temperatures, injection pressures, plunger speeds, and curing telemetry.' },
    { step: 5, title: 'Process Root Cause Analysis (RCA)', latency: '22 ms', desc: 'Computes parameter attribution linking casting and vulcanization anomalies.' },
    { step: 6, title: 'Predictive Defect Risk Forecasting', latency: '15 ms', desc: 'Forecasts probability of defect recurrence in subsequent cycles.' },
    { step: 7, title: 'Prescriptive Countermeasures & SOP', latency: '10 ms', desc: 'Auto-dispatches Standard Operating Procedure codes and maintenance containment locks.' },
  ],
  team: [
    { name: 'Ashish', role: 'Backend & FastAPI Lead', focus: 'FastAPI microservices, REST endpoints, DB transactions, validation.' },
    { name: 'Ganesh', role: 'Frontend & UI Lead', focus: 'React Quality Inspection Cockpit, Dual-stream Rim + Tyre inspection UX, metrology, and dashboards.' },
    { name: 'Deepak', role: 'Database & Schema Lead', focus: 'PostgreSQL 15 domain schema, relational entities (machines, batches, components, defects, process_data, alerts).' },
    { name: 'Vijeath', role: 'Data & Modeling Lead', focus: 'Wheel & Tyre dataset curation, CV detection models, severity rules, tabular RCA attribution, and risk forecasting.' },
  ],
};
