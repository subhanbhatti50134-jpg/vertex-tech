import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { DiscItem } from '../lib/data'

const H_GAP = 2.15
const DEPTH_GAP = 0.5
const INACTIVE_SCALE = 0.8
const ACTIVE_Y = 0.06
const CAM_Z = 4.4
const FOV = 40
const GALLERY_ROT: [number, number, number] = [-0.1, 0.42, 0]
const GALLERY_POS: [number, number, number] = [0.35, 0, 0]

const TEX_SIZE = 1024

function paintDisc(
  canvas: HTMLCanvasElement,
  colors: [string, string],
  label: string,
  img?: HTMLImageElement | null,
) {
  const size = canvas.width
  const ctx = canvas.getContext('2d')!

  const g = ctx.createLinearGradient(0, 0, size, size)
  g.addColorStop(0, colors[0])
  g.addColorStop(1, colors[1])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  if (img && img.width > 0 && img.height > 0) {
    const h = size * (img.height / img.width)
    ctx.drawImage(img, 0, (size - h) / 2, size, h)
    ctx.fillStyle = colors[0]
    ctx.globalAlpha = 0.05
    ctx.fillRect(0, (size - h) / 2, size, h)
    ctx.globalAlpha = 1
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 2
  for (let r = size * 0.2; r < size * 0.5; r += 8) {
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  const rg = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.5)
  rg.addColorStop(0, `rgba(255,255,255,${img ? 0.05 : 0.12})`)
  rg.addColorStop(1, 'rgba(0,0,0,0.12)')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = img ? 'rgba(242,242,242,0.95)' : 'rgba(242,242,242,0.85)'
  ctx.font = `500 ${Math.round(size * 0.034)}px "Space Grotesk", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 8
  ctx.fillText(label.toUpperCase().slice(0, 24), size / 2, size * 0.845)
  ctx.shadowBlur = 0
}

function paintServiceArt(
  canvas: HTMLCanvasElement,
  colors: [string, string],
  label: string,
  id: string,
) {
  const size = canvas.width
  const ctx = canvas.getContext('2d')!

  const g = ctx.createLinearGradient(0, 0, size, size)
  g.addColorStop(0, colors[0])
  g.addColorStop(1, colors[1])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  drawServiceIcon(ctx, size, id)

  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  ctx.lineWidth = 2
  for (let r = size * 0.2; r < size * 0.5; r += 8) {
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  const rg = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.5)
  rg.addColorStop(0, 'rgba(255,255,255,0.05)')
  rg.addColorStop(1, 'rgba(0,0,0,0.12)')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = 'rgba(242,242,242,0.85)'
  ctx.font = `500 ${Math.round(size * 0.034)}px "Space Grotesk", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 8
  ctx.fillText(label.toUpperCase().slice(0, 24), size / 2, size * 0.845)
  ctx.shadowBlur = 0
}

function drawServiceIcon(ctx: CanvasRenderingContext2D, size: number, id: string) {
  const cx = size / 2
  const cy = size * 0.42
  ctx.strokeStyle = 'rgba(255,255,255,0.92)'
  ctx.fillStyle = '#ffffff'
  ctx.lineWidth = size * 0.012
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (id === 'web') {
    const r = size * 0.2
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx, cy - r)
    ctx.lineTo(cx, cy + r)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - r, cy)
    ctx.lineTo(cx + r, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.66, 0.18, Math.PI - 0.18)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.66, Math.PI + 0.18, Math.PI * 2 - 0.18)
    ctx.stroke()
  } else if (id === 'shop') {
    const bw = size * 0.34
    const bh = size * 0.18
    ctx.beginPath()
    ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, size * 0.035)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx - bw * 0.3, cy + bh / 2 + size * 0.035, size * 0.05, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + bw * 0.3, cy + bh / 2 + size * 0.035, size * 0.05, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + bw * 0.36, cy - bh / 2 - size * 0.055, size * 0.1, -0.45, 0.45)
    ctx.stroke()
  } else if (id === 'mgmt') {
    const w = size * 0.42
    const h = size * 0.28
    ctx.fillRect(cx - w / 2, cy - h / 2 + size * 0.035, w, size * 0.05)
    const gw = size * 0.185
    const gh = size * 0.125
    const x0 = cx - gw - size * 0.02
    const x1 = cx + size * 0.02
    const y0 = cy - gh / 2 - size * 0.005
    const y1 = cy + size * 0.005
    ctx.strokeRect(x0, y0, gw, gh)
    ctx.strokeRect(x1, y0, gw, gh)
    ctx.strokeRect(x0, y1, gw, gh)
    ctx.strokeRect(x1, y1, gw, gh)
  } else if (id === 'app') {
    const cw = size * 0.42
    const ch = size * 0.28
    ctx.fillStyle = 'rgba(255,255,255,0.28)'
    ctx.fillRect(cx - cw / 2 + size * 0.05, cy - ch / 2 - size * 0.05, cw, ch)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(cx - cw / 2, cy - ch / 2, cw, ch)
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    ctx.fillRect(cx - cw / 2, cy - ch / 2, cw, size * 0.055)
  } else if (id === 'soft') {
    const drawCog = (x: number, y: number, r: number) => {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x, y, r * 0.5, 0, Math.PI * 2)
      ctx.stroke()
      const n = 8
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62)
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
        ctx.stroke()
      }
    }
    drawCog(cx - size * 0.09, cy, size * 0.17)
    drawCog(cx + size * 0.09, cy, size * 0.125)
  } else if (id === 'mobile') {
    const pw = size * 0.28
    const ph = size * 0.44
    ctx.beginPath()
    ctx.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, size * 0.05)
    ctx.fill()
    ctx.fillStyle = '#111111'
    ctx.fillRect(cx - pw / 2 + size * 0.04, cy - ph / 2 + size * 0.04, pw - size * 0.08, ph - size * 0.08)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(cx, cy - ph / 2 - size * 0.035, size * 0.016, 0, Math.PI * 2)
    ctx.fill()
  }
}

function DiscMesh({ item }: { item: DiscItem }) {
  const label = item.title.replace(/^(The|A)\s+/i, '')
  const art = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = TEX_SIZE
    canvas.height = TEX_SIZE
    if (item.image) {
      paintDisc(canvas, item.art, label)
    } else {
      paintServiceArt(canvas, item.art, label, item.id)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return { tex, canvas }
  }, [item, label])
  useEffect(() => () => art.tex.dispose(), [art])

  useEffect(() => {
    if (!item.image) return
    let dead = false
    const img = new Image()
    img.onload = () => {
      if (dead) return
      paintDisc(art.canvas, item.art, label, img)
      art.tex.needsUpdate = true
    }
    img.src = item.image
    return () => {
      dead = true
    }
  }, [item, label, art])

  return (
    <group>
      <mesh position-z={0.0135}>
        <ringGeometry args={[0.17, 1, 96]} />
        <meshStandardMaterial map={art.tex} roughness={0.38} metalness={0.15} />
      </mesh>
      <mesh position-z={0.014}>
        <circleGeometry args={[0.17, 48]} />
        <meshStandardMaterial color="#e8e6e3" roughness={0.5} />
      </mesh>
      <mesh position-z={0.0155}>
        <circleGeometry args={[0.035, 24]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      <mesh position-z={0.0145}>
        <ringGeometry args={[0.92, 0.945, 96]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.32} />
      </mesh>
      <mesh position-z={-0.0135} rotation-y={Math.PI}>
        <ringGeometry args={[0.17, 1, 96]} />
        <meshPhysicalMaterial
          color="#1A2333"
          roughness={0.28}
          metalness={0.85}
          iridescence={1}
          iridescenceIOR={1.86}
          iridescenceThicknessRange={[100, 800]}
        />
      </mesh>
      <mesh position-z={-0.014} rotation-y={Math.PI}>
        <circleGeometry args={[0.17, 48]} />
        <meshStandardMaterial color="#151C29" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[1, 1, 0.026, 96, 1, true]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.45} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

interface GalleryProps {
  items: DiscItem[]
  targetRef: { current: number }
  bornAt: number
  reduced: boolean
}

function Gallery({ items, targetRef, bornAt, reduced }: GalleryProps) {
  const group = useRef<THREE.Group>(null)
  const pos = useRef(0)
  const vel = useRef(0)

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const target = targetRef.current
    if (reduced) {
      pos.current = target
      vel.current = 0
    } else {
      vel.current += (-16 * (pos.current - target) - 11 * vel.current) * dt
      pos.current += vel.current * dt
    }
    const introT = reduced ? 1 : (performance.now() - bornAt) / 1000
    const g = group.current
    if (!g) return
    const mobile = state.size.width < 768
    g.scale.setScalar(mobile ? 0.58 : 0.8)
    g.position.x = mobile ? 0 : GALLERY_POS[0]
    g.position.y = mobile ? -0.45 : GALLERY_POS[1]
    g.children.forEach((child, i) => {
      const diff = i - pos.current
      const ad = Math.abs(diff)
      const p = reduced ? 1 : THREE.MathUtils.clamp((introT - i * 0.055) / 0.85, 0, 1)
      const e = 1 - Math.pow(1 - p, 3)
      child.position.x = diff * H_GAP
      child.position.z = -ad * DEPTH_GAP
      child.position.y = (1 - e) * 0.35 + ACTIVE_Y * Math.max(0, 1 - ad)
      const focus = Math.max(0, 1 - ad * 0.85)
      child.scale.setScalar(THREE.MathUtils.lerp(INACTIVE_SCALE, 1, focus) * THREE.MathUtils.lerp(0.3, 1, e))
      child.rotation.y = -diff * 0.24
      child.rotation.x = 0.1 * focus
      child.rotation.z = (1 - e) * (i % 2 ? 0.5 : -0.5)
      child.visible = p > 0.001
    })
  })

  return (
    <group ref={group} position={GALLERY_POS} rotation={GALLERY_ROT}>
      {items.map((item, i) => (
        <group key={item.id + i}>
          <DiscMesh item={item} />
        </group>
      ))}
    </group>
  )
}

interface LightsProps { bornAt: number; reduced: boolean }
function Lights({ bornAt, reduced }: LightsProps) {
  const key = useRef<THREE.DirectionalLight>(null)
  useFrame(() => {
    if (reduced || !key.current) return
    const t = (performance.now() - bornAt) / 1000
    const p = THREE.MathUtils.clamp(t / 1.4, 0, 1)
    key.current.intensity = 1.35 * p
    key.current.position.set(3.5, 2.2, 4 - (1 - p) * 3)
  })
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight ref={key} position={[3.5, 2.2, 4]} color="#FFF9E8" intensity={1.35} />
      <directionalLight position={[-3, 1.5, -2]} color="#499FF5" intensity={0.8} />
      <pointLight position={[0, -2.5, 2]} intensity={0.35} color="#ffffff" />
    </>
  )
}

export interface DiscGalleryProps {
  items: DiscItem[]
  index: number
  onStep: (next: number, source: 'wheel' | 'drag' | 'key' | 'nav') => void
  reduced: boolean
}

export default function DiscGallery({ items, index, onStep, reduced }: DiscGalleryProps) {
  const targetRef = useRef(0)
  const bornAtRef = useRef(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement | null>(null)
  const drag = useRef({ active: false, startX: 0, lastX: 0, moved: 0 })
  const wheelAcc = useRef(0)
  const wheelLast = useRef(0)
  const stepLock = useRef(0)
  const n = items.length

  if (bornAtRef.current === 0) bornAtRef.current = performance.now()
  targetRef.current = index

  useEffect(() => {
    bornAtRef.current = performance.now()
    targetRef.current = 0
  }, [items])

  useEffect(() => {
    heroRef.current = document.querySelector('.hero')
    const hero = heroRef.current
    if (!hero) return

    const step = (dir: number, source: 'wheel' | 'drag' | 'key') => {
      const now = performance.now()
      if (now < stepLock.current) return
      const next = Math.min(n - 1, Math.max(0, index + dir))
      if (next !== index) {
        stepLock.current = now + (source === 'wheel' ? 320 : 260)
        onStep(next, source)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = performance.now()
      if (now - wheelLast.current > 350) wheelAcc.current = 0
      wheelLast.current = now
      wheelAcc.current += e.deltaY + e.deltaX
      if (Math.abs(wheelAcc.current) > 70) {
        step(wheelAcc.current > 0 ? 1 : -1, 'wheel')
        wheelAcc.current = 0
      }
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      const t = e.target as HTMLElement | null
      if (t?.closest('a, button, input, textarea, select, [role="option"]')) return
      drag.current = { active: true, startX: e.clientX, lastX: e.clientX, moved: 0 }
      hero.classList.add('is-dragging')
      hero.setPointerCapture?.(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.lastX
      drag.current.lastX = e.clientX
      drag.current.moved += Math.abs(dx)
      if (drag.current.moved > 70) {
        step(dx < 0 ? 1 : -1, 'drag')
        drag.current.moved = 0
      }
    }
    const onUp = (e: PointerEvent) => {
      drag.current.active = false
      hero.classList.remove('is-dragging')
      hero.releasePointerCapture?.(e.pointerId)
    }

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); step(1, 'key') }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); step(-1, 'key') }
      else if (e.key === 'Home') onStep(0, 'key')
      else if (e.key === 'End') onStep(n - 1, 'key')
    }

    hero.addEventListener('wheel', onWheel, { passive: false })
    hero.addEventListener('pointerdown', onDown)
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerup', onUp)
    hero.addEventListener('pointercancel', onUp)
    window.addEventListener('keydown', onKey)
    return () => {
      hero.removeEventListener('wheel', onWheel)
      hero.removeEventListener('pointerdown', onDown)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerup', onUp)
      hero.removeEventListener('pointercancel', onUp)
      window.removeEventListener('keydown', onKey)
    }
  }, [index, n, onStep])

  return (
    <div ref={wrapRef} className="experience-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.3, CAM_Z], fov: FOV }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.86
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Lights bornAt={bornAtRef.current} reduced={reduced} />
        <Gallery
          items={items}
          targetRef={targetRef}
          bornAt={bornAtRef.current}
          reduced={reduced}
        />
      </Canvas>
    </div>
  )
}
