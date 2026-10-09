import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows, Sparkles, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { tl, T, DEFECTS, clamp, easeInOut, wheelHeight } from './timeline.js'

/* ------------------------------------------------------------------ */
/* Wheel material: heat glow (as-cast) + scan grid + pointer probe     */
/* ------------------------------------------------------------------ */
function useWheelMaterial() {
  return useMemo(() => {
    const uScan = { value: -4 }
    const uGrid = { value: 1 }
    const uProbe = { value: -99 }
    const mat = new THREE.MeshStandardMaterial({
      color: '#a9bccd',
      metalness: 1,
      roughness: 0.3,
      side: THREE.DoubleSide,
      emissive: new THREE.Color('#ff5a1f'),
      emissiveIntensity: 1.4,
    })
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uScan = uScan
      sh.uniforms.uGrid = uGrid
      sh.uniforms.uProbe = uProbe
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;')
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nuniform float uScan, uGrid, uProbe;')
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          float scanned = step(vWPos.x, uScan);
          float edge    = smoothstep(0.30, 0.0, abs(vWPos.x - uScan));
          float probe   = smoothstep(0.25, 0.0, abs(vWPos.x - uProbe));
          vec2  g       = abs(fract(vWPos.xz * 7.0) - 0.5);
          float grid    = smoothstep(0.44, 0.5, max(g.x, g.y));
          totalEmissiveRadiance += vec3(0.0, 0.94, 1.0) * (scanned * grid * uGrid * 0.8 + edge * 1.2 + probe * 0.7);`
        )
    }
    return { mat, uScan, uGrid, uProbe }
  }, [])
}

/* ------------------------------------------------------------------ */
/* Drag to rotate (enabled after the scan finishes)                    */
/* ------------------------------------------------------------------ */
const drag = { active: false, dx: 0, vel: 0 }

function DragControls() {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const el = gl.domElement
    drag.active = false; drag.dx = 0; drag.vel = 0
    el.style.touchAction = 'none'
    const down = (e) => {
      if (tl.t < T.scanEnd) return
      drag.active = true
      try { el.setPointerCapture(e.pointerId) } catch {}
    }
    const move = (e) => { if (drag.active) drag.dx += e.movementX * 0.008 }
    const up = (e) => {
      drag.active = false
      try { el.releasePointerCapture(e.pointerId) } catch {}
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [gl])
  useFrame(() => {
    const c = tl.t < T.scanEnd ? 'default' : drag.active ? 'grabbing' : 'grab'
    if (gl.domElement.style.cursor !== c) gl.domElement.style.cursor = c
  })
  return null
}

/* ------------------------------------------------------------------ */
/* Procedural alloy wheel (zero asset bytes)                           */
/* ------------------------------------------------------------------ */
function Defect({ d, i }) {
  const el = useRef()
  const pos = useMemo(() => {
    const a = THREE.MathUtils.degToRad(d.angle)
    return [d.r * Math.cos(a), d.y, -d.r * Math.sin(a)] // matches rotation-y(a) of the spokes
  }, [d])
  useFrame(() => {
    el.current?.classList.toggle('show', tl.t > T.scanEnd + 0.15 + i * 0.28)
  })
  return (
    <Html position={pos} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
      <div ref={el} className={`defect ${d.sev}`}>
        <span className="dot" />
        <div className="callout">
          <b>{d.id} / {d.conf}%</b>
          <span>{d.name}</span>
          <em>cause: {d.cause}</em>
        </div>
      </div>
    </Html>
  )
}

function Wheel({ mat }) {
  const spin = useRef()
  const { barrel, spoke, hub } = useMemo(() => {
    const prof = [
      [0.74, -0.22], [0.98, -0.22], [1.02, -0.17], [1.0, -0.1], [0.84, -0.08], [0.84, 0.08],
      [1.0, 0.1], [1.02, 0.17], [0.98, 0.22], [0.74, 0.22], [0.74, -0.22],
    ].map(([r, y]) => new THREE.Vector2(r, y))
    const s = new THREE.Shape()
    s.moveTo(0.15, -0.09); s.lineTo(0.82, -0.17); s.lineTo(0.82, 0.17); s.lineTo(0.15, 0.09)
    const spoke = new THREE.ExtrudeGeometry(s, {
      depth: 0.12, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2,
    })
    spoke.rotateX(-Math.PI / 2)
    spoke.translate(0, -0.06, 0)
    return {
      barrel: new THREE.LatheGeometry(prof, 96),
      spoke,
      hub: new THREE.CylinderGeometry(0.2, 0.24, 0.2, 48),
    }
  }, [])

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05)
    const t = tl.t
    // spin: fast during the fall, decays after impact, settles to a slow idle turn after the scan
    const fade = 1 - clamp((t - T.scanEnd) / 1.0)
    const boost = (t < T.impact ? 3.88 : 0.23 + 3.65 * Math.exp(-(t - T.impact) * 1.6)) * fade
    const auto = 0.12 + boost
    const r = spin.current
    if (drag.dx !== 0) {
      r.rotation.y += drag.dx
      drag.vel = THREE.MathUtils.clamp(drag.dx / dt, -8, 8)
      drag.dx = 0
    } else if (!drag.active) {
      r.rotation.y += drag.vel * dt
      drag.vel *= Math.exp(-2.5 * dt)
    } else {
      drag.vel = 0
    }
    if (!drag.active) r.rotation.y += auto * dt
    // as-cast heat cools while the part settles
    mat.emissiveIntensity = t < T.impact ? 1.4 : 1.4 * Math.exp(-(t - T.impact) * 0.8)
  })

  return (
    <group ref={spin}>
      <mesh geometry={barrel} material={mat} />
      <mesh geometry={hub} material={mat} />
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} geometry={spoke} material={mat} rotation-y={(i / 5) * Math.PI * 2} />
      ))}
      {DEFECTS.map((d, i) => <Defect key={d.id} d={d} i={i} />)}
    </group>
  )
}

function DropRig({ children }) {
  const g = useRef()
  useFrame(() => {
    const t = tl.t
    g.current.position.y = 0.29 + wheelHeight(t)
    const k = t > T.impact ? Math.exp(-(t - T.impact) * 16) : 0 // squash on impact
    g.current.scale.set(1.3 * (1 + 0.03 * k), 1.3 * (1 - 0.08 * k), 1.3 * (1 + 0.03 * k))
  })
  return <group ref={g}>{children}</group>
}

/* ------------------------------------------------------------------ */
/* Impact FX                                                           */
/* ------------------------------------------------------------------ */
function Shockwave({ delay = 0 }) {
  const m = useRef()
  useFrame(() => {
    const dt = tl.t - T.impact - delay
    const on = dt > 0 && dt < 1.6
    m.current.visible = on
    if (on) {
      const s = 1.3 + dt * 5.5
      m.current.scale.set(s, s, s)
      m.current.material.opacity = Math.exp(-dt * 2.6)
    }
  })
  return (
    <mesh ref={m} rotation-x={-Math.PI / 2} position-y={0.015} visible={false}>
      <ringGeometry args={[0.92, 1, 128]} />
      <meshBasicMaterial color="#00f0ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </mesh>
  )
}

function Sparks({ count = 220 }) {
  const ref = useRef()
  const { origin, vel, geo } = useMemo(() => {
    const origin = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const s = 1.5 + Math.random() * 4.5
      origin.set([Math.cos(a) * 1.3, 0.05, Math.sin(a) * 1.3], i * 3)
      vel.set([Math.cos(a) * s, 1.5 + Math.random() * 4, Math.sin(a) * s], i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(origin.slice(), 3))
    return { origin, vel, geo }
  }, [count])

  useFrame(() => {
    const t = tl.t - T.impact
    ref.current.visible = t > 0 && t < 1.4
    if (!ref.current.visible) return
    const p = geo.attributes.position.array
    for (let i = 0; i < count * 3; i += 3) { // closed-form ballistic path, no per-particle state
      p[i] = origin[i] + vel[i] * t
      p[i + 1] = Math.max(0.02, origin[i + 1] + vel[i + 1] * t - 4.9 * t * t)
      p[i + 2] = origin[i + 2] + vel[i + 2] * t
    }
    geo.attributes.position.needsUpdate = true
    ref.current.material.opacity = 1 - t / 1.4
  })

  return (
    <points ref={ref} geometry={geo} visible={false} frustumCulled={false}>
      <pointsMaterial color="#7df9ff" size={0.05} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Scanner curtain: sweeps once, then follows the pointer              */
/* ------------------------------------------------------------------ */
const laserVS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const laserFS = `
  varying vec2 vUv;
  uniform float uAlpha;
  void main(){
    float fall = pow(1.0 - vUv.y, 2.2);
    float side = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    float core = smoothstep(0.03, 0.0, vUv.y);
    gl_FragColor = vec4(vec3(0.0, 0.94, 1.0) * (fall * 0.5 + core * 3.0) * uAlpha, (fall * 0.45 + core) * side * uAlpha);
  }`
const probePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.3)
const hit = new THREE.Vector3()

function Laser({ uScan, uGrid, uProbe }) {
  const ref = useRef()
  const x = useRef(-2.6)
  const uniforms = useMemo(() => ({ uAlpha: { value: 1 } }), [])

  useFrame(({ raycaster, pointer, camera }, dt) => {
    dt = Math.min(dt, 0.05)
    const t = tl.t
    const m = ref.current
    m.visible = t > T.scanStart

    if (t < T.scanEnd) {
      // cinematic sweep
      x.current = THREE.MathUtils.lerp(-2.6, 2.6, easeInOut(clamp((t - T.scanStart) / (T.scanEnd - T.scanStart))))
      uScan.value = t < T.scanStart ? -4 : x.current
      uProbe.value = -99
      uniforms.uAlpha.value = 1
    } else {
      // interactive: curtain tracks the cursor along the platform
      raycaster.setFromCamera(pointer, camera)
      let target = x.current
      if (raycaster.ray.intersectPlane(probePlane, hit)) target = clamp(hit.x, -2.6, 2.6)
      x.current = THREE.MathUtils.lerp(x.current, target, 1 - Math.pow(0.0005, dt))
      uScan.value = 4
      uProbe.value = x.current
      uniforms.uAlpha.value = THREE.MathUtils.lerp(uniforms.uAlpha.value, 0.35, 1 - Math.pow(0.01, dt))
    }
    m.position.x = x.current
    uGrid.value = t >= T.scanEnd ? Math.max(0.12, 1 - (t - T.scanEnd) * 1.2) : 1
  })

  return (
    <mesh ref={ref} rotation-y={Math.PI / 2} position-y={1.1} visible={false}>
      <planeGeometry args={[4.4, 2.2]} />
      <shaderMaterial
        vertexShader={laserVS}
        fragmentShader={laserFS}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Platform + camera                                                   */
/* ------------------------------------------------------------------ */
function Platform() {
  return (
    <group>
      <mesh position-y={-0.1}>
        <cylinderGeometry args={[2.4, 2.5, 0.2, 96]} />
        <meshStandardMaterial color="#0a1322" metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
        <ringGeometry args={[2.25, 2.3, 128]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
        <ringGeometry args={[1.5, 1.52, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <ContactShadows position-y={0.01} opacity={0.6} scale={6} blur={2.4} far={2} resolution={256} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Polar floor: concentric rings + 20 radial lines (5 spokes x 4),     */
/* echoing the wheel itself. The impact shockwave ripples through it.  */
/* ------------------------------------------------------------------ */
const floorVS = `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`
const floorFS = `
  varying vec2 vP;
  uniform float uTime;
  uniform float uDt;     // seconds since impact (negative before)
  void main() {
    float r = length(vP);

    // rings: every 0.6 units, every 5th is a brighter "major" ring
    float rr = r / 0.6;
    float dRing = abs(fract(rr - 0.5) - 0.5);
    float ring = 1.0 - smoothstep(0.0, fwidth(rr) * 1.3, dRing);
    float major = 1.0 - smoothstep(0.0, fwidth(rr / 5.0) * 1.6, abs(fract(rr / 5.0 - 0.5) - 0.5));

    // radial lines: 20 around, slowly rotating (distance-based width, no seam)
    float ang = (atan(vP.y, vP.x) + uTime * 0.03) / 6.2831853 * 20.0;
    float dLine = abs(fract(ang - 0.5) - 0.5) * r * 6.2831853 / 20.0;
    float line = 1.0 - smoothstep(0.0, fwidth(dLine) * 1.3, dLine);

    // impact ripple travelling outward
    float on = step(0.0, uDt);
    float R = 2.5 + max(uDt, 0.0) * 7.0;
    float ripple = on * exp(-pow((r - R) * 1.6, 2.0)) * exp(-max(uDt, 0.0) * 1.3);

    float fade = smoothstep(2.35, 3.4, r) * smoothstep(19.0, 4.0, r);
    float base = ring * 0.30 + major * 0.35 + line * 0.18;
    vec3 col = mix(vec3(0.0, 0.45, 0.62), vec3(0.0, 0.94, 1.0), clamp(major + ripple, 0.0, 1.0));
    float a = (base * (1.0 + ripple * 4.0) + ripple * 0.5) * fade;
    gl_FragColor = vec4(col * a, a);
  }`

function PolarFloor() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uDt: { value: -1 } }), [])
  useFrame(() => {
    uniforms.uTime.value = tl.t
    uniforms.uDt.value = tl.t - T.impact
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.21}>
      <planeGeometry args={[60, 60]} />
      <shaderMaterial
        vertexShader={floorVS}
        fragmentShader={floorFS}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

const CAM_START = new THREE.Vector3(0, 1.2, 9.5)
const CAM_END = new THREE.Vector3(3.6, 2.7, 5.6)   // final 3/4 view: tweak to taste
const CAM_DIVE = new THREE.Vector3(0, 0.55, 0.15)  // "enter cockpit" dive target above the hub
const tmp = new THREE.Vector3()
const look = new THREE.Vector3()

function CameraRig({ diving }) {
  const d = useRef(0)
  useFrame(({ camera, pointer, size }, dt) => {
    dt = Math.min(dt, 0.05)
    const t = tl.t
    const k = easeInOut(clamp(t / T.settle))
    const aspect = size.width / size.height
    const back = aspect < 1 ? 1 + (1 - aspect) * 0.9 : 1 // pull back on portrait screens

    tmp.lerpVectors(CAM_START, CAM_END, k)
    tmp.x += pointer.x * 0.4 * k
    tmp.y += pointer.y * 0.25 * k
    tmp.multiplyScalar(back)

    let e = 0
    if (diving) {
      d.current = Math.min(1, d.current + dt / 0.9)
      e = easeInOut(d.current)
      tmp.lerp(CAM_DIVE, e)
    }
    camera.position.lerp(tmp, 1 - Math.pow(0.001, dt))

    // impact shake
    const sh = t > T.impact ? Math.exp(-(t - T.impact) * 9) * 0.06 : 0
    camera.position.x += (Math.random() - 0.5) * sh
    camera.position.y += (Math.random() - 0.5) * sh

    // follow the falling wheel, then sit slightly below centre so the title has room
    look.set(0, -0.4 + 0.7 * wheelHeight(t) * (t < T.impact ? 1 : 0.7), 0)
    camera.lookAt(look)

    if (diving) {
      camera.fov = 35 + 40 * e
      camera.updateProjectionMatrix()
    }
  })
  return null
}

function Driver() {
  // single clock: mounted first so it advances before other frame callbacks read it
  useFrame((_, dt) => { tl.t += Math.min(dt, 0.05) })
  return null
}

/* ------------------------------------------------------------------ */
export default function IntroScene({ diving = false, compact = false }) {
  const w = useWheelMaterial()
  return (
    <Canvas
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 35, position: CAM_START.toArray(), near: 0.1, far: 60 }}
      gl={{ powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#060a14']} />
      <fog attach="fog" args={['#060a14', 9, 24]} />

      <Driver />
      <CameraRig diving={diving} />
      <DragControls />

      <ambientLight intensity={0.15} />
      <spotLight position={[-4, 6, 3]} angle={0.45} penumbra={1} intensity={120} color="#38bdf8" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={4} color="#00f0ff" position={[-5, 2, -1]} scale={[8, 1.5, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 6, 0]} scale={[8, 8, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="ring" intensity={3} color="#38bdf8" position={[5, 1, -3]} scale={4} />
      </Environment>

      <PolarFloor />
      <Platform />
      <DropRig><Wheel mat={w.mat} /></DropRig>
      <Shockwave />
      <Shockwave delay={0.18} />
      <Sparks count={compact ? 120 : 220} />
      <Laser uScan={w.uScan} uGrid={w.uGrid} uProbe={w.uProbe} />
      <Sparkles count={compact ? 40 : 80} scale={[10, 6, 10]} size={2} speed={0.3} color="#38bdf8" />

      <EffectComposer multisampling={compact ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.6} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette darkness={0.7} offset={0.2} />
      </EffectComposer>
    </Canvas>
  )
}
