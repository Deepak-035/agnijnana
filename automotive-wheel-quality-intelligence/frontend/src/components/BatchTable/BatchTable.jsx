import React, { useState } from 'react';
import { BATCHES_DATA } from '../../data/mockData';
import './BatchTable.css';

export default function BatchTable() {
  const [filter, setFilter] = useState('ALL');

  const filteredBatches = BATCHES_DATA.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'QUARANTINED') return b.status === 'QUARANTINED';
    if (filter === 'RELEASED') return b.status === 'RELEASED';
    return true;
  });

  return (
    <div className="glass-panel col-7 batch-table-panel">
      <div className="batch-header">
        <div className="batch-title-wrap">
          <span className="section-eyebrow">BATCH MONITORING</span>
          <h3 className="batch-heading">Casting Batches</h3>
        </div>

        <div className="batch-filter-btns">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All ({BATCHES_DATA.length})
          </button>
          <button
            className={`filter-btn ${filter === 'QUARANTINED' ? 'active' : ''}`}
            onClick={() => setFilter('QUARANTINED')}
          >
            Quarantined ({BATCHES_DATA.filter((b) => b.status === 'QUARANTINED').length})
          </button>
          <button
            className={`filter-btn ${filter === 'RELEASED' ? 'active' : ''}`}
            onClick={() => setFilter('RELEASED')}
          >
            Released ({BATCHES_DATA.filter((b) => b.status === 'RELEASED').length})
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="batch-table">
          <thead>
            <tr>
              <th>BATCH / HEAT</th>
              <th>ALLOY</th>
              <th>MACHINE</th>
              <th>STATUS</th>
              <th>INSPECTED</th>
              <th>SCRAP</th>
              <th>DIAGNOSIS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }} className="mono">
                  ⚡ Awaiting MES production lot synchronization • Zero mock records active
                </td>
              </tr>
            ) : (
              filteredBatches.map((batch) => {
              const isQuarantined = batch.status === 'QUARANTINED';
              const isReview = batch.status === 'UNDER_REVIEW';
              const isReleased = batch.status === 'RELEASED';

              return (
                <tr key={batch.id} className="batch-row">
                  <td>
                    <div className="batch-id-cell">
                      <span className="mono batch-num">{batch.batch_number}</span>
                      <span className="mono heat-num">{batch.melt_heat_no}</span>
                    </div>
                  </td>
                  <td className="alloy-cell">{batch.alloy}</td>
                  <td className="mono unit-cell">{batch.machine_id}</td>
                  <td>
                    <span
                      className={`badge ${isQuarantined ? 'badge-critical' : isReview ? 'badge-warning' : isReleased ? 'badge-pass' : 'badge-info'}`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="mono count-cell">
                    <span className="text-primary">{batch.inspected_count}</span>
                    <span className="text-muted"> ({batch.passed_count}P / {batch.scrapped_count}S)</span>
                  </td>
                  <td>
                    <span className={`mono scrap-rate ${isQuarantined ? 'text-critical' : isReleased ? 'text-pass' : 'text-warning'}`}>
                      {batch.scrap_rate}
                    </span>
                  </td>
                  <td className="issue-cell">{batch.primary_issue}</td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
