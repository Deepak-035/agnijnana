import React, { useState, useEffect } from 'react';
import './ThreeDLanding.css';

export default function ThreeDLanding({ onEnterCockpit, onEnterOverview }) {
  const [animationStage, setAnimationStage] = useState('falling'); // 'falling', 'bounced', 'logoPopped', 'ready'

  useEffect(() => {
    // Stage 1: Falling & First Impact (1.1s)
    const timer1 = setTimeout(() => {
      setAnimationStage('bounced');
    }, 1100);

    // Stage 2: Logo Pop (2.4s)
    const timer2 = setTimeout(() => {
      setAnimationStage('logoPopped');
    }, 2400);

    // Stage 3: Ready / Fully revealed
    const timer3 = setTimeout(() => {
      setAnimationStage('ready');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="three-d-landing-viewport">
      {/* Dark Atmospheric Sky & Volumetric Lighting */}
      <div className="sky-atmosphere">
        <div className="sky-light-cone"></div>
        <div className="sky-stars-ambient"></div>
        <div className="sky-vignette"></div>
      </div>

      {/* Top Skip Button */}
      <button className="skip-intro-btn" onClick={onEnterCockpit}>
        Skip Intro ✕
      </button>

      {/* 3D World Stage */}
      <div className="three-d-stage">
        {/* Brand Presentation Section (Placed Above Wheel with Crystal Clear Separation) */}
        <div className={`popped-brand-showcase ${animationStage}`}>
          <div className="brand-glow-halo"></div>

          <h1 className="popped-brand-title">
            WHEEL QUALITY INTELLIGENCE
          </h1>

          <p className="popped-brand-tagline">
            Inspect. Detect. Predict. Prevent.
          </p>

          <p className="popped-brand-sub">
            Autonomous Industrial Vision • Explainable Telemetry • Closed-Loop Scrap Containment
          </p>

          {/* Action CTAs */}
          <div className="popped-actions-row">
            <button className="btn btn-primary btn-lg enter-cockpit-btn" onClick={onEnterCockpit}>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Enter Inspection Cockpit
            </button>

            <button className="btn btn-secondary btn-lg" onClick={onEnterOverview}>
              System Overview →
            </button>
          </div>
        </div>

        {/* 3D Centre Area: Falling Tyre & Ground Calibration Platform */}
        <div className="tyre-presentation-area">
          {/* Ground Platform & Radial Calibration Rings */}
          <div className="ground-platform">
            <div className="grid-plane"></div>
            <div className="platform-ring ring-1"></div>
            <div className="platform-ring ring-2"></div>
            <div className="platform-ring ring-3"></div>

            {/* Dynamic Ground Shadow below the tyre */}
            <div className={`tyre-ground-shadow ${animationStage}`}></div>

            {/* Impact Shockwaves that trigger when tyre hits ground */}
            {(animationStage === 'bounced' || animationStage === 'logoPopped' || animationStage === 'ready') && (
              <>
                <div className="impact-shockwave wave-1"></div>
                <div className="impact-shockwave wave-2"></div>
              </>
            )}
          </div>

          {/* 3D Falling & Bouncing Tyre Assembly */}
          <div className={`tyre-3d-actor ${animationStage}`}>
            {/* Cyan Laser Scan Line Sweeping Across Settled Tyre */}
            <div className="laser-scan-beam"></div>

            <div className="tyre-mesh">
              <svg viewBox="0 0 320 320" className="tyre-svg" width="260" height="260">
                <defs>
                  {/* Rubber Tread Gradient */}
                  <radialGradient id="tread-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="78%" stopColor="#080c14" />
                    <stop offset="85%" stopColor="#1e293b" />
                    <stop offset="92%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#334155" />
                  </radialGradient>

                  {/* Alloy Wheel Rim Gradient */}
                  <radialGradient id="rim-alloy-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="38%" stopColor="#1e293b" />
                    <stop offset="82%" stopColor="#475569" />
                    <stop offset="92%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </radialGradient>

                  {/* Neon Cyan Hub Glow */}
                  <radialGradient id="cyan-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="chrome-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Outer Rubber Tyre Tread */}
                <circle cx="160" cy="160" r="152" fill="url(#tread-grad)" stroke="#1e293b" strokeWidth="8" />
                <circle cx="160" cy="160" r="145" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
                <circle cx="160" cy="160" r="133" fill="none" stroke="#0f172a" strokeWidth="3" />

                {/* Tyre Sidewall Markings */}
                <circle cx="160" cy="160" r="127" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Alloy Wheel Outer Lip (Diamond-Cut Mirror Finish) */}
                <circle cx="160" cy="160" r="120" fill="url(#rim-alloy-grad)" stroke="#94a3b8" strokeWidth="3.5" />
                <circle cx="160" cy="160" r="112" fill="#070d1a" stroke="url(#chrome-sheen)" strokeWidth="2" />

                {/* Wheel Spokes (Dynamic 10-Spoke Sport Geometry) */}
                <g stroke="#94a3b8" strokeWidth="11" strokeLinecap="round" opacity="0.95">
                  <line x1="160" y1="160" x2="160" y2="48" />
                  <line x1="160" y1="160" x2="226" y2="69" />
                  <line x1="160" y1="160" x2="267" y2="125" />
                  <line x1="160" y1="160" x2="267" y2="195" />
                  <line x1="160" y1="160" x2="226" y2="251" />
                  <line x1="160" y1="160" x2="160" y2="272" />
                  <line x1="160" y1="160" x2="94" y2="251" />
                  <line x1="160" y1="160" x2="53" y2="195" />
                  <line x1="160" y1="160" x2="53" y2="125" />
                  <line x1="160" y1="160" x2="94" y2="69" />
                </g>

                {/* Polished Spoke Chamfer Highlight */}
                <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
                  <line x1="158" y1="156" x2="158" y2="52" />
                  <line x1="159" y1="157" x2="223" y2="72" />
                  <line x1="159" y1="159" x2="263" y2="127" />
                  <line x1="159" y1="161" x2="263" y2="193" />
                  <line x1="159" y1="162" x2="223" y2="247" />
                  <line x1="158" y1="162" x2="158" y2="268" />
                  <line x1="157" y1="162" x2="97" y2="247" />
                  <line x1="157" y1="161" x2="57" y2="193" />
                  <line x1="157" y1="159" x2="57" y2="127" />
                  <line x1="157" y1="157" x2="97" y2="72" />
                </g>

                {/* Disc Brake Rotor vents behind spokes */}
                <circle cx="160" cy="160" r="76" fill="none" stroke="#475569" strokeWidth="6" strokeDasharray="4 6" opacity="0.6" />

                {/* Hub & Center Cap */}
                <circle cx="160" cy="160" r="42" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="160" cy="160" r="32" fill="url(#cyan-glow)" />
                <circle cx="160" cy="160" r="18" fill="#070b14" stroke="#00f0ff" strokeWidth="2" />

                {/* Lug Nuts (5 Lug PCD) */}
                <circle cx="160" cy="132" r="4.5" fill="#070b14" stroke="#e2e8f0" strokeWidth="2" />
                <circle cx="187" cy="151" r="4.5" fill="#070b14" stroke="#e2e8f0" strokeWidth="2" />
                <circle cx="177" cy="182" r="4.5" fill="#070b14" stroke="#e2e8f0" strokeWidth="2" />
                <circle cx="143" cy="182" r="4.5" fill="#070b14" stroke="#e2e8f0" strokeWidth="2" />
                <circle cx="133" cy="151" r="4.5" fill="#070b14" stroke="#e2e8f0" strokeWidth="2" />

                {/* Centre Emblem */}
                <circle cx="160" cy="160" r="7" fill="#38bdf8" />
              </svg>
            </div>

            {/* Floating HUD Calibration Badges */}
            <div className="tyre-hud-tag tag-left">
              <span>ALLOY: A356.2-T6</span>
            </div>
            <div className="tyre-hud-tag tag-right">
              <span>SCAN: OPTICAL 4K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
