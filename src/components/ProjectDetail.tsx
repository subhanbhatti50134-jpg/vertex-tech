'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Star, ExternalLink, Github } from 'lucide-react'
import { COLLECTIONS } from '../lib/data'
import { usePrefersReducedMotion } from '../lib/hooks'

const PROJECTS = COLLECTIONS.projects.items

function Stars({ count }: { count: number }) {
  return (
    <span className="detail__stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={1.5}
          className={i < Math.round(count) ? 'detail__star filled' : 'detail__star'}
        />
      ))}
    </span>
  )
}

interface ProjectDetailProps {
  projectId: string | null
  onClose: () => void
  onNavigate: (id: string) => void
}

export default function ProjectDetail({ projectId, onClose, onNavigate }: ProjectDetailProps) {
  const reduce = usePrefersReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)
  const [imgFailed, setImgFailed] = useState(false)

  const project = PROJECTS.find((p) => p.id === projectId) ?? null
  const index = PROJECTS.findIndex((p) => p.id === projectId)
  const prev = index > 0 ? PROJECTS[index - 1] : null
  const next = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null

  /* reset image failure state when project changes */
  useEffect(() => {
    setImgFailed(false)
  }, [projectId])

  /* close on Escape + lock scroll */
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && prev) onNavigate(prev.id)
      else if (e.key === 'ArrowRight' && next) onNavigate(next.id)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [project, prev, next, onClose, onNavigate])

  /* focus panel on open, restore focus to trigger on close */
  useEffect(() => {
    if (project) {
      lastTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      panelRef.current?.focus()
    } else if (lastTrigger.current) {
      lastTrigger.current.focus()
      lastTrigger.current = null
    }
  }, [project])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} details`}
        >
          {/* backdrop */}
          <div className="detail__backdrop" onClick={onClose} />

          {/* panel */}
          <motion.div
            ref={panelRef}
            className="detail__panel"
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* header bar */}
            <div className="detail__bar">
              <span className="subheading-xs">
                Project {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
              </span>
              <button className="detail__close" onClick={onClose} aria-label="Close project details">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* hero image */}
            <div className="detail__hero">
              {project.image && !imgFailed ? (
                <img
                  className="detail__img"
                  src={project.image}
                  alt={project.title}
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div
                  className="detail__img detail__img--fallback"
                  style={{
                    background: `linear-gradient(135deg, ${project.art[0]}, ${project.art[1]})`,
                  }}
                />
              )}
              <div className="detail__hero-scrim" />
              <div className="detail__hero-title">
                <h2 className="heading-l">{project.title}</h2>
              </div>
            </div>

            {/* meta row */}
            <div className="detail__meta">
              <div className="detail__meta-item">
                <p className="subheading-xs">{COLLECTIONS.projects.labels[0]}</p>
                <p className="paragraph-m">{project.credits.join(', ')}</p>
              </div>
              <div className="detail__meta-item">
                <p className="subheading-xs">{COLLECTIONS.projects.labels[1]}</p>
                <p className="paragraph-m">{project.year}</p>
              </div>
              <div className="detail__meta-item">
                <p className="subheading-xs">{COLLECTIONS.projects.labels[2]}</p>
                <div className="detail__tags">
                  {project.starring.map((tag, i) => (
                    <span key={i} className="detail__tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* description */}
            <div className="detail__body">
              <p className="paragraph-xl detail__desc">{project.detail}</p>

              {/* reviews */}
              <div className="detail__reviews">
                <p className="subheading-xs">Reviews</p>
                <div className="detail__reviews-list">
                  {project.reviews.map((r, i) => (
                    <div key={i} className="detail__review">
                      <div className="detail__review-head">
                        <span className="detail__review-pub">{r.publication}</span>
                        <Stars count={r.stars} />
                      </div>
                      <p className="detail__review-quote">“{r.quote}”</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* actions */}
              <div className="detail__actions">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail__btn"
                  >
                    <Github size={16} strokeWidth={1.5} />
                    View on GitHub
                    <ExternalLink size={14} strokeWidth={1.5} />
                  </a>
                )}
                <button className="detail__btn detail__btn--ghost" onClick={onClose}>
                  Back to all work
                </button>
              </div>
            </div>

            {/* prev / next */}
            <div className="detail__nav">
              {prev ? (
                <button className="detail__nav-btn" onClick={() => onNavigate(prev.id)}>
                  <ChevronLeft size={18} strokeWidth={1.5} />
                  <span className="detail__nav-label">
                    <span className="subheading-xs">Previous</span>
                    <span className="detail__nav-title">{prev.title}</span>
                  </span>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button className="detail__nav-btn detail__nav-btn--right" onClick={() => onNavigate(next.id)}>
                  <span className="detail__nav-label">
                    <span className="subheading-xs">Next</span>
                    <span className="detail__nav-title">{next.title}</span>
                  </span>
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              ) : (
                <span />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
