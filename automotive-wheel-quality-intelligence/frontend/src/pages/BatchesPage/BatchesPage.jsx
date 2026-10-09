import React from 'react';
import BatchTable from '../../components/BatchTable/BatchTable';
import MachineStatus from '../../components/MachineStatus/MachineStatus';
import Alerts from '../../components/Alerts/Alerts';
import HistoricalTrends from '../../components/HistoricalTrends/HistoricalTrends';
import './BatchesPage.css';

export default function BatchesPage() {
  return (
    <div className="batches-page-layout">
      <div className="page-header-strip">
        <div>
          <h2 className="page-main-heading">Batches & Machine Telemetry</h2>
          <p className="page-sub-heading">
            Live process metrics, historical defect trends, and casting workcell analytics.
          </p>
        </div>
      </div>

      <div className="batches-grid-row">
        <HistoricalTrends />
      </div>

      <div className="batches-grid-row">
        <BatchTable />
        <MachineStatus />
      </div>

      <div className="batches-grid-row">
        <Alerts />
      </div>
    </div>
  );
}
