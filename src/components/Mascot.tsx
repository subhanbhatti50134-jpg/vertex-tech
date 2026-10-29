'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mountMascot, type MascotApi } from '../mascot/module'
import { initMascotPage } from '../mascot/page'
import { useTheme } from './ThemeContext'

/* ------------------------------------------------------------- look (sebg) */
const LOOK = {
  hair: 'curly',
  beard: true,
  colors: {
    skin: '#fbf3ec',
    hair: '#77573d',
    beard: '#c49c74',
    sweater: '#a4ad9b',
    ink: '#030407',
    paper: '#fbfbf8',
  },
}

/* ------------------------------------------------------- pixel-art cursors */
const HAND_OPEN = {
  paper:
    'M8 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM9 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM15 6h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM8 7h1v1h-1zM9 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM14 7h1v1h-1zM15 7h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM11 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM14 9h1v1h-1zM15 9h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM11 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM14 10h1v1h-1zM15 10h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM14 11h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM5 13h1v1h-1zM6 13h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM9 13h1v1h-1zM10 13h1v1h-1zM11 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM6 16h1v1h-1zM7 16h1v1h-1zM8 16h1v1h-1zM9 16h1v1h-1zM10 16h1v1h-1zM11 16h1v1h-1zM12 16h1v1h-1zM13 16h1v1h-1z',
  ink:
    'M8 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM10 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM10 6h1v1h-1zM13 6h1v1h-1zM16 6h1v1h-1zM4 7h1v1h-1zM7 7h1v1h-1zM10 7h1v1h-1zM13 7h1v1h-1zM16 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM7 8h1v1h-1zM10 8h1v1h-1zM13 8h1v1h-1zM16 8h1v1h-1zM1 9h1v1h-1zM4 9h1v1h-1zM16 9h1v1h-1zM2 10h1v1h-1zM16 10h1v1h-1zM3 11h1v1h-1zM16 11h1v1h-1zM3 12h1v1h-1zM15 12h1v1h-1zM4 13h1v1h-1zM15 13h1v1h-1zM4 14h1v1h-1zM14 14h1v1h-1zM5 15h1v1h-1zM14 15h1v1h-1zM5 16h1v1h-1zM14 16h1v1h-1zM5 17h1v1h-1zM6 17h1v1h-1zM7 17h1v1h-1zM8 17h1v1h-1zM9 17h1v1h-1zM10 17h1v1h-1zM11 17h1v1h-1zM12 17h1v1h-1zM13 17h1v1h-1zM14 17h1v1h-1z',
}

const HAND_POINT = {
  paper:
    'M8 1h1v1h-1zM9 1h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM12 2h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM8 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM12 3h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM9 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM15 6h1v1h-1zM1 7h1v1h-1zM2 7h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM8 7h1v1h-1zM9 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM14 7h1v1h-1zM15 7h1v1h-1zM1 8h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM11 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM14 9h1v1h-1zM15 9h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM11 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM14 10h1v1h-1zM15 10h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM14 11h1v1h-1zM15 11h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM5 13h1v1h-1zM6 13h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM9 13h1v1h-1zM10 13h1v1h-1zM11 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM6 16h1v1h-1zM7 16h1v1h-1zM8 16h1v1h-1zM9 16h1v1h-1zM10 16h1v1h-1zM11 16h1v1h-1zM12 16h1v1h-1zM13 16h1v1h-1z',
  ink:
    'M8 0h1v1h-1zM9 0h1v1h-1zM7 1h1v1h-1zM10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM10 2h1v1h-1zM13 2h1v1h-1zM4 3h1v1h-1zM7 3h1v1h-1zM10 3h1v1h-1zM13 3h1v1h-1zM4 4h1v1h-1zM7 4h1v1h-1zM10 4h1v1h-1zM13 4h1v1h-1zM14 4h1v1h-1zM15 4h1v1h-1zM4 5h1v1h-1zM7 5h1v1h-1zM10 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM16 5h1v1h-1zM1 6h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM10 6h1v1h-1zM13 6h1v1h-1zM16 6h1v1h-1zM0 7h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM7 7h1v1h-1zM10 7h1v1h-1zM13 7h1v1h-1zM16 7h1v1h-1zM0 8h1v1h-1zM4 8h1v1h-1zM7 8h1v1h-1zM10 8h1v1h-1zM13 8h1v1h-1zM16 8h1v1h-1zM1 9h1v1h-1zM4 9h1v1h-1zM7 9h1v1h-1zM10 9h1v1h-1zM13 9h1v1h-1zM16 9h1v1h-1zM2 10h1v1h-1zM16 10h1v1h-1zM3 11h1v1h-1zM16 11h1v1h-1zM3 12h1v1h-1zM15 12h1v1h-1zM4 13h1v1h-1zM15 13h1v1h-1zM4 14h1v1h-1zM14 14h1v1h-1zM5 15h1v1h-1zM14 15h1v1h-1zM5 16h1v1h-1zM14 16h1v1h-1zM5 17h1v1h-1zM6 17h1v1h-1zM7 17h1v1h-1zM8 17h1v1h-1zM9 17h1v1h-1zM10 17h1v1h-1zM11 17h1v1h-1zM12 17h1v1h-1zM13 17h1v1h-1zM14 17h1v1h-1z',
}

const MENU_ITEMS: Array<[string, string]> = [
  ['dance', 'Dance'],
  ['punch', 'Punching bag'],
  ['panic', 'Panic'],
  ['fly', 'Fly'],
  ['vanish', 'Vanish'],
  ['hiccup', 'Hiccup'],
  ['peekaboo', 'Peekaboo'],
  ['selfie', 'Selfie'],
  ['dizzy', 'Dizzy'],
  ['sneeze', 'Sneeze'],
  ['sulk', 'Sulk'],
]

function HandSvg({ hand, className }: { hand: typeof HAND_OPEN; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" shapeRendering="crispEdges" aria-hidden="true">
      <path className="mascot-hand__paper" d={hand.paper} />
      <path className="mascot-hand__ink" d={hand.ink} />
    </svg>
  )
}

/* =========================================================== main component */
export default function Mascot() {
  const { theme } = useTheme()
  const apiRef = useRef<MascotApi | null>(null)

  const applyColors = () => {
    const api = apiRef.current
    if (!api) return
    const cs = getComputedStyle(document.documentElement)
    api.setColors(cs.getPropertyValue('--text').trim(), cs.getPropertyValue('--bg').trim())
  }

  useEffect(() => {
    const api = mountMascot()
    apiRef.current = api
    applyColors()

    const cleanupPage = initMascotPage()
    document.dispatchEvent(new Event('astro:page-load'))

    let alive = true
    const raf = requestAnimationFrame(() => {
      if (alive) ScrollTrigger.refresh()
    })
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh()
    })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      cleanupPage()
      api.destroy()
      apiRef.current = null
    }
    /* mount once — theme changes handled by effect below */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    applyColors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  return (
    <>
      {/* ---------- layer: character canvas + badge ring (below page content) ---------- */}
      <div className="mascot-layer">
        {/* ---------- badge ring (footer placement) ---------- */}
        <div className="mascot-badge" aria-hidden="true">
          <div />
        </div>

        {/* ---------- the character ---------- */}
        <canvas className="mascot" data-look={JSON.stringify(LOOK)} aria-hidden="true" />
      </div>

      {/* ---------- HUD: grab handle + hand cursor (above page content) ---------- */}
      <div className="mascot-hud">
        {/* ---------- grab handle ---------- */}
        <div className="mascot-handle" aria-hidden="true" />

        {/* ---------- pixel-art hand cursors ---------- */}
        <div className="mascot-hand" hidden aria-hidden="true">
          <HandSvg hand={HAND_OPEN} />
          <HandSvg hand={HAND_POINT} className="hidden" />
        </div>
      </div>

      {/* ---------- float: speech bubble (above text, below the contact card) ---------- */}
      <div className="mascot-float">
        <div className="mascot-bubble">
        <div className="mascot-bubble__body">
          <span className="mascot-bubble__tail mascot-bubble__tail--shadow" />
          <span className="mascot-bubble__tail" />
          <div className="bubble-lines">
            <p className="bubble-line absolute">
              Hi, I&apos;m <span className="accent">Vertex</span>. Scroll down and I&apos;ll show you around.
            </p>
            <p className="bubble-line absolute" data-returning-line="true">
              Oh hi, <span className="accent">you&apos;re back</span>. Want the tour again?
            </p>
            <p className="bubble-line absolute" data-hint-line="true">
              Psst. You can <span className="accent">grab</span> me.
            </p>
            <p className="bubble-line absolute" data-hint-line="true">
              Psst. <span className="accent">Hold</span> me to pick me up.
            </p>
            <p className="bubble-line absolute">
              Write me anytime. <span className="accent">Click</span> and it&apos;s copied.
            </p>
            <p className="bubble-line absolute">
              <span className="accent">Copied!</span> Talk soon.
            </p>
          </div>
        </div>

        {/* ---------- reaction quips ---------- */}
        <div className="mascot-quip" hidden>
          <span className="mascot-bubble__tail mascot-bubble__tail--shadow" />
          <span className="mascot-bubble__tail" />
          <p data-quip="sulk" hidden>
            <span className="accent">Hmph.</span> Not talking to you.
          </p>
          <p data-quip="laugh" hidden>
            Stop, <span className="accent">stop</span>! I&apos;m ticklish.
          </p>
          <p data-quip="sniffle" hidden>
            Ah… <span className="accent">ah…</span>
          </p>
          <p data-quip="sneeze" hidden>
            <span className="accent">Achoo!</span> Sorry.
          </p>
          <p data-quip="dance" hidden>
            Nobody&apos;s <span className="accent">watching</span>, right?
          </p>
          <p data-quip="panic" hidden>
            <span className="accent">Aaah!</span> Who broke prod?
          </p>
          <p data-quip="fly" hidden>
            To <span className="accent">infinity</span>…
          </p>
          <p data-quip="hiccup" hidden>
            <span className="accent">Hic!</span> Excuse me.
          </p>
          <p data-quip="peekaboo" hidden>
            <span className="accent">Boo!</span>
          </p>
          <p data-quip="selfie" hidden>
            Say <span className="accent">cheese</span>!
          </p>
          <p data-quip="vanish" hidden>
            Now you <span className="accent">see</span> me…
          </p>
          <p data-quip="bell" hidden>
            <span className="accent">Ding!</span> Bring it on.
          </p>
          <p data-quip="narrow" hidden>
            Ooh, <span className="accent">mobile</span> mode.
          </p>
          <p data-quip="wide" hidden>
            Back to <span className="accent">the big screen</span>.
          </p>
        </div>

        {/* ---------- tricks menu ---------- */}
        <div className="mascot-menu" hidden aria-label="Tricks">
          <span className="mascot-bubble__tail mascot-bubble__tail--shadow" />
          <span className="mascot-bubble__tail" />
          <p className="mascot-menu__title">
            What should I <span className="accent">do</span>?
          </p>
          <div className="mascot-menu__grid">
            {MENU_ITEMS.map(([value, label]) => (
              <button key={value} type="button" value={value}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* ---------- top: sound toggle (above everything) ---------- */}
      <div className="mascot-top">
        <button type="button" className="sound-toggle button" aria-label="Sound" aria-pressed="false">
          <svg
            className="sound-toggle__icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1.5 6H4l3.5-3v10L4 10H1.5z" />
            <path className="sound-toggle__off" d="m10.5 6 4 4m0-4-4 4" />
            <path className="sound-toggle__on" d="M10 5.5a3.5 3.5 0 0 1 0 5M12 3a6 6 0 0 1 0 10" />
          </svg>
        </button>
      </div>
    </>
  )
}
