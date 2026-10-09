import React, { useState } from 'react';
import './HistoricalTrends.css';

const PARETO_DEFECT_DATA = [
  { defect: 'Gas Porosity Cluster', count: 48, percentage: 26.2, severity: 'Critical', category: 'Casting' },
  { defect: 'Rim Casting Crack', count: 39, percentage: 21.3, severity: 'Critical', category: 'Casting' },
  { defect: 'Sub-Surface Blow Hole', count: 28, percentage: 15.3, severity: 'Critical', category: 'Casting' },
  { defect: 'Machining Edge Burr', count: 22, percentage: 12.0, severity: 'Low', category: 'CNC Machining' },
  { defect: 'Surface Scratch / Scuff', count: 19, percentage: 10.4, severity: 'Low', category: 'Handling' },
  { defect: 'Incomplete Rim Weld Seam', count: 14, percentage: 7.7, severity: 'Critical', category: 'Welding' },
  { defect: 'Hub Shrinkage Cavity', count: 9, percentage: 4.9, severity: 'Critical', category: 'Solidification' },
  { defect: 'Other (Flash, Dent, Paint)', count: 4, percentage: 2.2, severity: 'Low', category: 'Finishing' },
];

const DAILY_TREND_DATA = [
  { date: 'Oct 02', fpy: 98.4, scrap: 1.2, inspected: 1120 },
  { date: 'Oct 03', fpy: 98.1, scrap: 1.4, inspected: 1180 },
  { date: 'Oct 04', fpy: 97.9, scrap: 1.6, inspected: 1240 },
  { date: 'Oct 05', fpy: 98.6, scrap: 0.9, inspected: 1190 },
  { date: 'Oct 06', fpy: 96.8, scrap: 2.8, inspected: 1210 },
  { date: 'Oct 07', fpy: 95.4, scrap: 4.1, inspected: 1150 },
  { date: 'Oct 08', fpy: 97.2, scrap: 2.1, inspected: 1280 },
];

const SHIFT_COMPARISON = [
  { shift: 'Shift A (Morning 06:00 - 14:00)', lead: 'R. Kulkarni', fpy: '98.2%', scrap: '1.4%', volume: '440 Rims', status: 'OPTIMAL' },
  { shift: 'Shift B (Evening 14:00 - 22:00)', lead: 'S. Nambiar', fpy: '96.1%', scrap: '3.4%', volume: '430 Rims', status: 'DRIFT_DETECTED' },
  { shift: 'Shift C (Night 22:00 - 06:00)', lead: 'M. Verma', fpy: '97.5%', scrap: '2.1%', volume: '410 Rims', status: 'MONITOR' },
];

export default function HistoricalTrends() {
  const [activeTimeframe, setActiveTimeframe] = useState('7D');
  const [hoveredDay, setHoveredDay] = useState(null);

  return (
    <div className="glass-panel col-12 historical-trends-panel">
      {/* Header with Title and Timeframe Toggle */}
      <div className="trends-header">
        <div className="trends-title-group">
          <div className="trends-icon-glow">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M19 9l-5 5-4-4-6 6" />
            </svg>
          </div>
          <div>
            <div className="section-eyebrow">QUALITY METROLOGY INTELLIGENCE</div>
            <h3 className="trends-heading">Historical Defect & Yield Analytics</h3>
          </div>
        </div>

        <div className="trends-actions">
          <div className="timeframe-pill mono">
            {['24H', '7D', '30D', 'YTD'].map((tf) => (
              <button
                key={tf}
                className={`tf-btn ${activeTimeframe === tf ? 'active' : ''}`}
                onClick={() => setActiveTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="trends-content-grid">
        {/* Left Column: 7-Day FPY & Scrap Trend Chart */}
        <div className="trend-card trend-chart-card">
          <div className="card-top-header">
            <div>
              <span className="card-mini-title">FIRST PASS YIELD (FPY) & SCRAP TREND</span>
              <p className="card-sub-info">7-Day rolling plant quality trajectory</p>
            </div>
            <div className="legend-pills mono">
              <span className="legend-item"><span className="legend-dot dot-emerald"></span> FPY %</span>
              <span className="legend-item"><span className="legend-dot dot-rose"></span> Scrap %</span>
            </div>
          </div>

          {/* SVG Multi-Day Curve & Bar Chart */}
          <div className="trend-svg-container">
            <svg viewBox="0 0 500 160" className="trend-line-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fpyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

              {/* Area Under Curve */}
              <path
                d="M 20 50 L 95 56 L 170 60 L 245 46 L 320 82 L 395 110 L 470 74 L 470 145 L 20 145 Z"
                fill="url(#fpyGrad)"
              />

              {/* FPY Polyline */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20,50 95,56 170,60 245,46 320,82 395,110 470,74"
              />

              {/* Scrap Rate Polyline */}
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20,135 95,133 170,131 245,138 320,119 395,106 470,126"
              />

              {/* Interactive Data Points */}
              {DAILY_TREND_DATA.map((d, i) => {
                const x = 20 + i * 75;
                const fpyY = 50 + (100 - d.fpy) * 15;
                const isHovered = hoveredDay === i;

                return (
                  <g key={d.date} onMouseEnter={() => setHoveredDay(i)} onMouseLeave={() => setHoveredDay(null)} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={x}
                      cy={fpyY}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#00f0ff' : '#10b981'}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Day Labels */}
            <div className="trend-x-labels mono">
              {DAILY_TREND_DATA.map((d, i) => (
                <div
                  key={d.date}
                  className={`x-label-item ${hoveredDay === i ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span className="x-date">{d.date}</span>
                  <span className="x-val text-emerald">{d.fpy}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 14-Defect Pareto Distribution */}
        <div className="trend-card pareto-card">
          <div className="card-top-header">
            <div>
              <span className="card-mini-title">DEFECT PARETO DISTRIBUTION</span>
              <p className="card-sub-info">Classification frequency across 14 defect types</p>
            </div>
            <span className="mono total-defects-badge">183 INCIDENTS</span>
          </div>

          <div className="pareto-bars-list">
            {PARETO_DEFECT_DATA.map((item) => {
              const isCrit = item.severity === 'Critical';
              return (
                <div key={item.defect} className="pareto-row">
                  <div className="pareto-info">
                    <span className="pareto-name">{item.defect}</span>
                    <span className="pareto-meta mono">
                      <span className={`pareto-badge ${isCrit ? 'badge-crit' : 'badge-warn'}`}>
                        {item.severity}
                      </span>
                      <span>{item.count} rims</span>
                      <strong className={isCrit ? 'text-rose' : 'text-amber'}>
                        {item.percentage}%
                      </strong>
                    </span>
                  </div>
                  <div className="pareto-track">
                    <div
                      className={`pareto-fill ${isCrit ? 'fill-crit' : 'fill-warn'}`}
                      style={{ width: `${item.percentage * 3.4}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Shift Quality Performance Matrix */}
      <div className="shift-matrix-strip">
        <div className="shift-matrix-title mono">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>SHIFT-BY-SHIFT STABILITY BENCHMARK (LAST 24 HOURS):</span>
        </div>

        <div className="shift-cards-row">
          {SHIFT_COMPARISON.map((sc) => (
            <div key={sc.shift} className="shift-mini-card">
              <div className="shift-top">
                <span className="shift-name">{sc.shift}</span>
                <span className={`status-pill mono ${sc.status === 'OPTIMAL' ? 'pill-optimal' : sc.status === 'DRIFT_DETECTED' ? 'pill-drift' : 'pill-warn'}`}>
                  {sc.status}
                </span>
              </div>
              <div className="shift-stats-row mono">
                <div>
                  <span className="s-lbl">FPY:</span> <strong className="text-emerald">{sc.fpy}</strong>
                </div>
                <div>
                  <span className="s-lbl">SCRAP:</span> <strong className={sc.status === 'DRIFT_DETECTED' ? 'text-rose' : 'text-cyan'}>{sc.scrap}</strong>
                </div>
                <div>
                  <span className="s-lbl">SUPERVISOR:</span> <span>{sc.lead}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
