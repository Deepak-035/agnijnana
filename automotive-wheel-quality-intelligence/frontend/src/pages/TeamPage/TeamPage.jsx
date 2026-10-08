import React from 'react';
import { PIPELINE_SPECS } from '../../data/mockData';
import './TeamPage.css';

export default function TeamPage() {
  return (
    <div className="team-page-layout">
      <div className="team-page-header">
        <div className="section-eyebrow">QUALITY INTELLIGENCE PLATFORM</div>
        <h2 className="team-page-heading">Engineering Team</h2>
        <p className="team-page-sub">
          Automotive Component Quality Inspection — Core Contributors
        </p>
      </div>

      <div className="team-cards-grid">
        {PIPELINE_SPECS.team.map((member) => (
          <div key={member.name} className="glass-panel member-card">
            <div className="member-avatar">
              {member.name.charAt(0)}
            </div>
            
            <div className="member-details">
              <h3 className="member-name">{member.name}</h3>
              <div className="member-role mono">{member.role}</div>
              <p className="member-focus">{member.focus}</p>
            </div>

            <div className="member-badge mono">
              <span>CONTRIBUTOR</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
