import React, { Component, lazy, Suspense, useEffect, useState } from 'react'
import { tl, T } from './timeline.js'
import './ThreeDLanding.css'

// The 3D scene (three.js + R3F) is code-split: HUD shell paints first, the scene loads behind it.
const IntroScene = lazy(() => import('./IntroScene.jsx'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) {
    console.warn('[intro] 3D scene failed, showing static fallback', err)
    this.props.onFail?.()
  }
  render() { return this.state.failed ? null : this.props.children }
}

export default function ThreeDLanding({ onEnterCockpit, onEnterOverview, onEnter }) {
  const [fallback, setFallback] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [stage, setStage] = useState(0)
  const compact = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches

  const handleCockpit = onEnterCockpit || onEnter || (() => {})
  const handleOverview = onEnterOverview || handleCockpit

  // Decide how much of the intro to play.
  // ?intro=off -> skip entirely, ?intro=full -> always play full cut
  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get('intro')
    if (mode === 'off') {
      handleCockpit()
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = sessionStorage.getItem('wqi-intro') && mode !== 'full'
    sessionStorage.setItem('wqi-intro', '1')

    if (!hasWebGL()) {
      tl.t = 99
      setFallback(true)
      return
    }
    tl.t = reduced ? T.ready : seen ? T.scanStart : 0 // returning visitors get short cut
  }, [])

  // Title stage is derived from shared clock (only re-renders when stage changes)
  useEffect(() => {
    let raf, last = -1
    const loop = () => {
      const t = tl.t
      const next = t >= T.title + 1.4 ? 3 : t >= T.title + 0.8 ? 2 : t >= T.title ? 1 : 0
      if (next !== last) {
        last = next
        setStage(next)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const skip = () => {
    if (tl.t >= T.ready) {
      enter(handleCockpit)
    } else {
      tl.t = Math.max(tl.t, T.ready)
    }
  }

  const enter = (callback) => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => {
      callback()
    }, 900)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        skip()
      }
      if (e.key === 'Enter' && stage >= 3) {
        enter(handleCockpit)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stage, leaving, handleCockpit])

  return (
    <div className={`intro s${stage} ${leaving ? 'leaving' : ''} ${fallback ? 'fallback' : ''}`}>
      {!fallback && (
        <SceneBoundary onFail={() => { tl.t = 99; setFallback(true) }}>
          <Suspense fallback={null}>
            <IntroScene diving={leaving} compact={compact} />
          </Suspense>
        </SceneBoundary>
      )}

      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="hud">
        <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />

        <button className="skip" onClick={skip}>
          {stage >= 3 ? 'Direct to Cockpit ➔' : 'Skip Intro ✕'}
        </button>

        <div className="title">
          <h1>
            <span>WHEEL QUALITY</span>
            <span className="line2">INTELLIGENCE</span>
          </h1>
          <p>Inspect. Detect. Predict. Prevent.</p>
          <div className="cta-group">
            <button
              className="cta"
              onClick={() => enter(handleCockpit)}
              tabIndex={stage >= 3 ? 0 : -1}
            >
              Enter Inspection Cockpit
            </button>
            {onEnterOverview && (
              <button
                className="cta cta-secondary"
                onClick={() => enter(handleOverview)}
                tabIndex={stage >= 3 ? 0 : -1}
              >
                System Overview →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
