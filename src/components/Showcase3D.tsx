import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { COLLECTIONS, type DiscItem } from '../lib/data'
import { hasWebGL, usePrefersReducedMotion } from '../lib/hooks'

const TEX_SIZE = 1024
const RADIUS = 1
const GAP = 2.35

/* ------------------------------------------------------- disc face painting */
function paintFace(
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
    ctx.globalAlpha = 0.08
    ctx.fillRect(0, (size - h) / 2, size, h)
    ctx.globalAlpha = 1
  }

  /* grooves */
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 2
  for (let r = size * 0.2; r < size * 0.5; r += 8) {
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  /* sheen */
  const rg = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.5)
  rg.addColorStop(0, `rgba(255,255,255,${img ? 0.05 : 0.12})`)
  rg.addColorStop(1, 'rgba(0,0,0,0.12)')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, size, size)

  /* label */
  ctx.fillStyle = 'rgba(242,242,242,0.95)'
  ctx.font = `500 ${Math.round(size * 0.034)}px "Space Grotesk", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 8
  ctx.fillText(label.toUpperCase().slice(0, 24), size / 2, size * 0.845)
  ctx.shadowBlur = 0
}

/* ------------------------------------------------------------- disc mesh */
function Disc({ item }: { item: DiscItem }) {
  const label = item.title.replace(/^(The|A)\s+/i, '')

  const art = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = TEX_SIZE
    canvas.height = TEX_SIZE
    paintFace(canvas, item.art, label)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return { tex, canvas }
  }, [item, label])

  useEffect(() => () => art.tex.dispose(), [art])

  /* load project image if present */
  useEffect(() => {
    if (!item.image) return
    let dead = false
    const img = new Image()
    img.onload = () => {
      if (dead) return
      paintFace(art.canvas, item.art, label, img)
      art.tex.needsUpdate = true
    }
    img.src = item.image
    return () => { dead = true }
  }, [item, label, art])

  return (
    <group>
      {/* front face */}
      <mesh position-z={0.0135}>
        <ringGeometry args={[0.17, RADIUS, 96]} />
        <meshStandardMaterial map={art.tex} roughness={0.38} metalness={0.15} />
      </mesh>
      {/* label ring */}
      <mesh position-z={0.014}>
        <circleGeometry args={[0.17, 48]} />
        <meshStandardMaterial color="#e8e6e3" roughness={0.5} />
      </mesh>
      {/* spindle hole */}
      <mesh position-z={0.0155}>
        <circleGeometry args={[0.035, 24]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      {/* rim */}
      <mesh position-z={0.0145}>
        <ringGeometry args={[0.92, 0.945, 96]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.32} />
      </mesh>
      {/* back face — iridescent */}
      <mesh position-z={-0.0135} rotation-y={Math.PI}>
        <ringGeometry args={[0.17, RADIUS, 96]} />
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
      {/* edge */}
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[RADIUS, RADIUS, 0.026, 96, 1, true]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.45} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------ rotating carousel */
interface CarouselProps {
  items: DiscItem[]
  spin: { current: number }
  reduced: boolean
}

function Carousel({ items, spin, reduced }: CarouselProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const g = group.current
    if (!g) return

    /* auto-rotate when idle */
    if (!reduced) spin.current += dt * 0.35

    const mobile = state.size.width < 768
    const scale = mobile ? 0.55 : 0.8
    g.scale.setScalar(scale)
    g.position.y = mobile ? -0.3 : 0

    g.children.forEach((child, i) => {
      const offset = i - (spin.current % items.length + items.length) % items.length
      /* shortest angular path */
      let diff = offset
      if (diff > items.length / 2) diff -= items.length
      if (diff < -items.length / 2) diff += items.length

      const ad = Math.abs(diff)
      child.position.x = diff * GAP
      child.position.z = -ad * 0.55
      child.position.y = Math.max(0, 1 - ad) * 0.1

      const focus = Math.max(0, 1 - ad * 0.8)
      child.scale.setScalar(THREE.MathUtils.lerp(0.78, 1, focus))
      child.rotation.y = -diff * 0.35
      child.rotation.x = 0.12 * focus
      child.visible = ad < items.length / 2
    })
  })

  return (
    <group ref={group} rotation={[-0.08, 0, 0]}>
      {items.map((item, i) => (
        <group key={item.id + i}>
          <Disc item={item} />
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ lights */
function Lights({ reduced }: { reduced: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null)
  useFrame(() => {
    if (reduced || !key.current) return
    const t = performance.now() / 1000
    key.current.position.set(Math.cos(t * 0.3) * 4, 2.4, Math.sin(t * 0.3) * 4 + 2)
  })
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight ref={key} position={[3.5, 2.2, 4]} color="#FFF9E8" intensity={1.4} />
      <directionalLight position={[-3, 1.5, -2]} color="#499FF5" intensity={0.85} />
      <pointLight position={[0, -2.5, 2]} intensity={0.4} color="#ffffff" />
    </>
  )
}

/* ============================================================ main section */
export default function Showcase3D() {
  const reduce = usePrefersReducedMotion()
  const items = COLLECTIONS.projects.items
  const webgl = useMemo(() => hasWebGL(), [])
  const spin = useRef(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, lastX: 0 })

  /* drag to spin */
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      drag.current = { active: true, startX: e.clientX, lastX: e.clientX }
      el.classList.add('is-dragging')
    }
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.lastX
      drag.current.lastX = e.clientX
      spin.current -= dx * 0.008
    }
    const onUp = () => {
      drag.current.active = false
      el.classList.remove('is-dragging')
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <section className="showcase3d bg-grid" id="showcase" aria-label="3D Showcase" data-mascot="right">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="subheading-xs">3D Showcase</span>
          <h2 className="heading-l" data-mascot-gesture="thumbs">Spin the Work</h2>
          <p className="showcase3d__hint">Drag to spin · {items.length} projects on the shelf</p>
        </motion.div>
      </div>

      <div ref={wrapRef} className="showcase3d__stage" aria-hidden="true">
        {webgl ? (
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0.3, 4.6], fov: 40 }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 0.88
              gl.setClearColor(0x000000, 0)
            }}
          >
            <Lights reduced={reduce} />
            <Carousel items={items} spin={spin} reduced={reduce} />
          </Canvas>
        ) : (
          <ul className="showcase3d__fallback">
            {items.map((item) => (
              <li
                key={item.id}
                className="showcase3d__fallback-item"
                style={{ background: `linear-gradient(135deg, ${item.art[0]}, ${item.art[1]})` }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
