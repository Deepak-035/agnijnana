// One shared clock for the whole intro. Everything (wheel, laser, HUD, callouts) reads tl.t,
// so "skip" and "returning visitor" just jump this number.
export const tl = { t: 0 }

// ---- Tunables (seconds) ----
const G = 23.5      // stylised gravity
const Y0 = 9        // drop height above the platform
const REST = 0.38   // bounce restitution

const tFall = Math.sqrt((2 * Y0) / G)

export const T = {
  fall: 0.4,        // when the wheel starts falling
  impact: 0.4 + tFall,
  scanStart: 2.3,
  scanEnd: 4.1,
  title: 4.3,       // brand title starts
  settle: 5.2,      // camera reaches its final position
  ready: 6.0,       // everything visible (also the "skipped" end state)
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// Analytic fall + damped bounces: height above the resting position.
export function wheelHeight(t) {
  if (t < T.fall) return Y0
  let dt = t - T.fall
  if (dt < tFall) return Y0 - 0.5 * G * dt * dt
  dt -= tFall
  let v = G * tFall * REST
  for (let i = 0; i < 3; i++) {
    const air = (2 * v) / G
    if (dt < air) return v * dt - 0.5 * G * dt * dt
    dt -= air
    v *= REST
  }
  return 0
}

// Defects shown after the scan. Positions are wheel-local (polar: angle in degrees, radius, height).
export const DEFECTS = [
  { id: 'CRK-03', name: 'Rim casting crack',    angle: 150, r: 1.02, y: 0.17, conf: 97.4, cause: 'Plunger shot turbulence', sev: 'crit' },
  { id: 'POR-07', name: 'Gas porosity cluster', angle: 6,   r: 0.46, y: 0.1,  conf: 94.8, cause: 'Degassing flow down 11%', sev: 'warn' },
  { id: 'BUR-12', name: 'Machining edge burr',  angle: 40,  r: 0.74, y: 0.22, conf: 91.2, cause: 'Tool insert wear',        sev: 'warn' },
  { id: 'SHR-05', name: 'Shrinkage cavity',     angle: 228, r: 0.3,  y: 0.1,  conf: 89.6, cause: 'Die cavity chilling',     sev: 'warn' },
]
