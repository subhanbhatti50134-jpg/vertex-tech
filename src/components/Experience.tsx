import { AnimatePresence, motion } from 'framer-motion'
import type { Collection, DiscItem } from '../lib/data'
import { usePrefersReducedMotion } from '../lib/hooks'

const EASE = [0.22, 1, 0.36, 1] as const

function Line({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = usePrefersReducedMotion()
  return (
    <span className="line-mask">
      <motion.span
        className={className}
        initial={reduce ? false : { y: '120%' }}
        animate={{ y: '0%' }}
        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Star({ kind }: { kind: 'full' | 'half' | 'empty' }) {
  return (
    <span className={`star star--${kind}`} aria-hidden="true">
      <svg viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.24862 0L6.68508 3.53591L10.4972 3.81215L7.62431 6.29834L8.50829 10L5.24862 8.01105L1.98895 10L2.87293 6.29834L0 3.81215L3.81215 3.53591L5.24862 0Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

function Stars({ value }: { value: number }) {
  return (
    <div className="testimonial__stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const kind = value >= i ? 'full' : value >= i - 0.5 ? 'half' : 'empty'
        return <Star key={i} kind={kind} />
      })}
    </div>
  )
}

interface ExperienceProps {
  collection: Collection
  item: DiscItem
}

export default function Experience({ collection, item }: ExperienceProps) {
  const reduce = usePrefersReducedMotion()
  const values: string[][] = [item.credits, [item.year], item.starring]

  const panel = (i: number) => (
    <div className="info-panel" key={`${item.id}-${i}`}>
      <div className="divider-horizontal top" aria-hidden="true" />
      <div className="info-label">
        <Line delay={0.1 + i * 0.05}>
          <p className="subheading-xs">{collection.labels[i]}</p>
        </Line>
      </div>
      <div className="info-value">
        <Line delay={0.14 + i * 0.05}>
          <p className="paragraph-m text-right">
            {values[i].map((v, k) => (
              <span key={k}>
                {v}
                {k < values[i].length - 1 && <br />}
              </span>
            ))}
          </p>
        </Line>
      </div>
    </div>
  )

  return (
    <div className="experience-wrap">
      <div className="experience-info" data-film-target-group="">
        <Line delay={0}>
          <h2 className="heading-s info-title">{item.title}</h2>
        </Line>
        <AnimatePresence mode="wait">
          <motion.div
            className="info-content"
            key={item.id}
            initial={reduce ? false : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -14, transition: { duration: 0.32, ease: 'easeIn' } }}
          >
            {panel(0)}
            {panel(1)}
            {panel(2)}
            {item.detail && (
              <div className="info-panel" style={{ borderBottom: 'none' }}>
                <Line delay={0.28}>
                  <p className="paragraph-s" style={{ opacity: 0.55 }}>
                    {item.detail}
                  </p>
                </Line>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="testimonial-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            style={{ display: 'contents' }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
          >
            {item.reviews.map((r) => (
              <div className="testimonial" key={r.publication}>
                <Stars value={r.stars} />
                <div className="testimonial__text">
                  <Line delay={0.1}>
                    <p className="subheading-xs text-center">{r.publication}</p>
                  </Line>
                  <Line delay={0.16}>
                    <p className="heading-xs text-center">&ldquo;{r.quote}&rdquo;</p>
                  </Line>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
