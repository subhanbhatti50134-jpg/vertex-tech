'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/hooks'

const QUOTE = 'I build websites that move.'
const WORDS = QUOTE.split(' ')
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function ScrambleWord({ text, delay, active }: { text: string; delay: number; active: boolean }) {
  const [display, setDisplay] = useState(text)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (!active || reduce) { setDisplay(text); return }
    let frame = 0
    const total = 14 + delay * 4
    const timer = window.setInterval(() => {
      frame++
      if (frame >= total) {
        setDisplay(text)
        window.clearInterval(timer)
        return
      }
      const progress = frame / total
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (i / text.length < progress) return ch
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      )
    }, 40)
    return () => window.clearInterval(timer)
  }, [active, text, delay, reduce])

  return <span className="cartoon-quote__word">{display}</span>
}

function HandDrawnCartoon() {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60])

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.08, duration: reduce ? 0 : 1.2, ease: 'easeInOut' },
        opacity: { delay: i * 0.08, duration: 0.2 },
      },
    }),
  }

  return (
    <div className="cartoon-vector" ref={ref}>
      <motion.div className="cartoon-vector__parallax" style={{ y }}>
        <svg
          className="cartoon-vector__svg"
          viewBox="0 0 1600 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Hand-drawn cartoon: Vertex Tech — websites that move"
          role="img"
        >
          {/* sketchy ground line */}
          <motion.path
            d="M40 360 C 300 350, 600 368, 900 356 S 1400 352, 1560 362"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            variants={draw}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
          />

          {/* big hand-lettered title */}
          <motion.g
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <text
              x="800"
              y="210"
              textAnchor="middle"
              className="cartoon-vector__title"
              fill="currentColor"
            >
              VERTEX TECH
            </text>
            {/* hand-drawn underline swash */}
            <motion.path
              d="M340 245 C 480 232, 700 254, 860 240 S 1180 230, 1268 246"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              variants={draw}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              custom={1}
            />
          </motion.g>

          {/* tagline sketch */}
          <motion.text
            x="800"
            y="300"
            textAnchor="middle"
            className="cartoon-vector__tagline"
            fill="currentColor"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.7 }}
          >
            WEBSITES THAT MOVE
          </motion.text>

          {/* doodle: browser window left */}
          <motion.g
            variants={draw}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={2}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="90" y="110" width="170" height="120" rx="8" />
            <path d="M90 140 H260" />
            <circle cx="112" cy="125" r="5" />
            <circle cx="132" cy="125" r="5" />
            <circle cx="152" cy="125" r="5" />
            <path d="M115 175 L145 200 L175 165 L215 205" />
            <path d="M215 175 h25 v25" />
          </motion.g>

          {/* doodle: code brackets right */}
          <motion.g
            variants={draw}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={3}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1350 130 L1310 170 L1350 210" />
            <path d="M1450 130 L1490 170 L1450 210" />
            <path d="M1400 120 L1400 220" />
          </motion.g>

          {/* doodle: cursor arrow */}
          <motion.path
            d="M250 290 L250 340 L268 324 L282 352 L296 345 L282 318 L308 316 Z"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 1, ease: 'backOut' }}
            style={{ transformOrigin: '270px 330px' }}
          />

          {/* doodle: motion lines behind title */}
          <motion.g
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 1.1 }}
          >
            <path d="M200 70 h90" />
            <path d="M230 95 h70" />
            <path d="M1310 70 h90" />
            <path d="M1300 95 h70" />
          </motion.g>

          {/* doodle: star burst */}
          <motion.path
            d="M1380 300 L1390 330 L1420 332 L1396 352 L1404 382 L1380 364 L1356 382 L1364 352 L1340 332 L1370 330 Z"
            fill="currentColor"
            initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 1.2, ease: 'backOut' }}
            style={{ transformOrigin: '1380px 340px' }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

function RevealLines({ text, className }: { text: string; className?: string }) {
  const reduce = usePrefersReducedMotion()
  return (
    <span className={`reveal-lines ${className ?? ''}`} aria-label={text}>
      <span className="reveal-lines__inner">
        <motion.span
          className="reveal-lines__text"
          initial={{ y: reduce ? 0 : '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </span>
    </span>
  )
}

function DividerRule() {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div
      className="divider-horizontal cartoon-divider"
      initial={{ scaleX: reduce ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

export default function CartoonShowcase() {
  const reduce = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-30%' })

  return (
    <section className="cartoon bg-grid" ref={sectionRef} aria-label="Cartoon intro" data-mascot="left" data-mascot-outfit="hiker">
      <div className="container cartoon__inner">
        <div className="cartoon-quote" data-mascot-swipe>
          <DividerRule />
          <div className="cartoon-quote__row">
            <motion.p
              className="cartoon-quote__text heading-l"
              data-mascot-gesture="think"
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              aria-label={QUOTE}
            >
              {WORDS.map((word, i) => (
                <ScrambleWord
                  key={`${word}-${i}`}
                  text={i < WORDS.length - 1 ? `${word} ` : word}
                  delay={i}
                  active={isInView}
                />
              ))}
            </motion.p>
          </div>
          <div className="cartoon-quote__row">
            <DividerRule />
            <motion.div
              className="cartoon-quote__cta"
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 20 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="#projects" className="cartoon-btn">
                <span className="cartoon-btn__divider" />
                <span className="cartoon-btn__label">View Work</span>
                <span className="cartoon-btn__divider" />
              </a>
            </motion.div>
          </div>
          <div className="cartoon-quote__row">
            <DividerRule />
          </div>
        </div>

        <div className="cartoon-meta">
          <div className="cartoon-meta__item">
            <DividerRule />
            <div className="cartoon-meta__content">
              <p className="subheading-xs">Based in</p>
              <p className="paragraph-m"><RevealLines text="Lahore, Pakistan" /></p>
            </div>
          </div>
          <div className="cartoon-meta__item">
            <DividerRule />
            <div className="cartoon-meta__content">
              <p className="subheading-xs">Focus</p>
              <p className="paragraph-m"><RevealLines text="Frontend, Motion & Interaction" /></p>
            </div>
          </div>
          <div className="cartoon-meta__item">
            <DividerRule />
            <div className="cartoon-meta__content">
              <p className="subheading-xs">Since</p>
              <p className="paragraph-m"><RevealLines text="2023" /></p>
            </div>
          </div>
        </div>

        <HandDrawnCartoon />
      </div>
    </section>
  )
}
