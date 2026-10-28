'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import Nav from './components/Nav'
import Contact from './components/Contact'
import Mascot from './components/Mascot'
import CartoonShowcase from './components/CartoonShowcase'
import Showcase3D from './components/Showcase3D'
import ProjectDetail from './components/ProjectDetail'
import { COLLECTIONS } from './lib/data'
import { SITE } from './lib/config'
import { usePrefersReducedMotion } from './lib/hooks'
import { Sun, Moon, Mouse, ChevronDown } from 'lucide-react'
import { ThemeProvider, useTheme } from './components/ThemeContext'

function ScrollIndicator() {
  const { scrollY } = useScroll()
  const scrollProgress = useTransform(scrollY, [0, window.innerHeight], [1, 0])
  
  return (
    <motion.div
      className="scroll-indicator"
      style={{ opacity: scrollProgress, pointerEvents: 'none' }}
    >
      <motion.div
        className="scroll-indicator__mouse"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Mouse className="scroll-indicator__mouse-icon" size={20} strokeWidth={1.5} />
      </motion.div>
      <span className="scroll-indicator__text">Scroll</span>
    </motion.div>
  )
}

function Hero() {
  const reduce = usePrefersReducedMotion()
  const controls = useAnimation()
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }
    })
  }, [controls, reduce])
  
  return (
    <section className="hero bg-grid" id="hero" data-mascot="hero">
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
      >
        <span className="hero__tagline">I build websites that move.</span>
        <h1 className="hero__title" data-mascot-gesture="wave">
          Vertex Tech
          <br />
          <span className="hero__title-accent">Lahore, Pakistan</span>
        </h1>
        <p className="hero__description">
          Full-stack developer focused on frontend, motion & interaction design.
          Building fast, accessible web experiences since 2023.
        </p>
        <div className="hero__meta">
          <a href="#projects" className="hero__cta">
            View Work
            <ChevronDown size={18} strokeWidth={2} />
          </a>
          <a href="#contact" className="hero__contact">Get in touch</a>
        </div>
      </motion.div>
      <ScrollIndicator />
    </section>
  )
}

function About() {
  const reduce = usePrefersReducedMotion()

  const cards = [
    {
      title: 'Who I Am',
      text: "I'm a full-stack developer with a focus on frontend, based in Lahore, Pakistan. Since 2023 I've built fast, accessible websites and applications for businesses that need work which ships and converts.",
    },
    {
      title: 'What I Care About',
      text: 'Thoughtful motion and interaction design. Every interface should feel responsive, readable, and alive — never slow, never noisy. Performance and accessibility are part of the design, not an afterthought.',
    },
    {
      title: 'How I Work',
      text: 'Direct communication, steady delivery, and code you can maintain. From a landing page to a full product, I keep the scope honest and the result polished across every screen size.',
    },
  ]

  return (
    <section className="about bg-grid" id="about" aria-label="About" data-mascot="right" data-mascot-outfit="watchmaker">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="subheading-xs">About</span>
          <h2 className="heading-l" data-mascot-gesture="watch">The Person Behind the Work</h2>
        </motion.div>

        <div className="about__grid">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="about__card"
              data-mascot-say
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="about__card-title">{card.title}</h3>
              <p className="about__card-text">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects({ onOpen }: { onOpen: (id: string) => void }) {
  const reduce = usePrefersReducedMotion()
  const projects = COLLECTIONS.projects.items
  
  return (
    <section className="projects bg-grid" id="projects" aria-label="Projects" data-mascot="project" data-mascot-outfit="gamer">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="subheading-xs">Selected Work</span>
          <h2 className="heading-l" data-mascot-gesture="cheer">Projects</h2>
        </motion.div>
        
        <div className="projects__grid">
          {projects.map((item, i) => (
            <ProjectCard key={item.id} item={item} index={i} reduce={reduce} onOpen={onOpen} />
          ))}
        </div>
        
        <div className="projects__all">
          <a href="#all-work" className="projects__all-link">
            View all projects
            <ChevronDown size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  )
}

function Services() {
  const reduce = usePrefersReducedMotion()
  const services = COLLECTIONS.services.items
  
  return (
    <section className="services bg-grid" id="services" aria-label="Services" data-mascot="left">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="subheading-xs">Services</span>
          <h2 className="heading-l" data-mascot-gesture="think">What I Offer</h2>
        </motion.div>
        
        <div className="services__grid">
          {services.map((item, i) => (
            <ServiceCard key={item.id} item={item} index={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  item: typeof COLLECTIONS.projects.items[0]
  index: number
  reduce: boolean
  onOpen: (id: string) => void
}

function ProjectCard({ item, index, reduce, onOpen }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpen(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(item.id)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${item.title}`}
    >
      <div className="project-card__image-wrapper">
        <div 
          className="project-card__image"
          style={{ backgroundImage: item.image ? `url(${item.image})` : 'none' }}
        />
        <div className={`project-card__overlay ${isHovered ? 'visible' : ''}`}>
          <span className="project-card__overlay-text">View Details</span>
          <ChevronDown size={16} strokeWidth={2} />
        </div>
      </div>
      <div className="project-card__content">
        <div className="project-card__meta">
          <span className="project-card__year">{item.year}</span>
          <span className="project-card__type">{item.credits[0]}</span>
        </div>
        <h3 className="project-card__title">{item.title}</h3>
        <p className="project-card__description">{item.detail}</p>
        <div className="project-card__tags">
          {item.starring.slice(0, 3).map((tag: string, i: number) => (
            <span key={i} className="project-card__tag">{tag}</span>
          ))}
        </div>
        <span className="project-card__cta">
          View Details
          <ChevronDown size={14} strokeWidth={2} style={{ transform: 'rotate(-90deg)' }} />
        </span>
      </div>
    </motion.article>
  )
}

interface ServiceCardProps {
  item: typeof COLLECTIONS.services.items[0]
  index: number
  reduce: boolean
}

function ServiceCard({ item, index, reduce }: ServiceCardProps) {
  return (
    <motion.article
      className="service-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="service-card__icon">
        {getServiceIcon(item.id)}
      </div>
      <div className="service-card__content">
        <h3 className="service-card__title">{item.title}</h3>
        <p className="service-card__description">{item.detail}</p>
        <div className="service-card__features">
          {item.starring.slice(0, 3).map((feature, i) => (
            <span key={i} className="service-card__feature">
              <span className="service-card__feature-dot" />
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function getServiceIcon(id: string) {
  const icons: Record<string, JSX.Element> = {
    web: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    shop: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    mgmt: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    app: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    soft: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <path d="M12 22V12" />
        <path d="M22 8.5L12 15.5" />
        <path d="M2 8.5l10 7" />
      </svg>
    ),
    mobile: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  }
  return icons[id] || icons.web
}

function AllWork({ onOpen }: { onOpen: (id: string) => void }) {
  const reduce = usePrefersReducedMotion()
  const projects = COLLECTIONS.projects.items
  
  return (
    <section className="all-work bg-grid" id="all-work" aria-label="All Work" data-mascot="badge" data-mascot-ring="#d4ff24" data-mascot-gesture="cheer">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="subheading-xs">All Work</span>
          <h2 className="heading-l">{projects.length} Projects</h2>
        </motion.div>
        
        <div className="all-work__grid">
          {projects.map((item, i) => (
            <AllWorkCard key={item.id} item={item} index={i} reduce={reduce} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface AllWorkCardProps {
  item: typeof COLLECTIONS.projects.items[0]
  index: number
  reduce: boolean
  onOpen: (id: string) => void
}

function AllWorkCard({ item, index, reduce, onOpen }: AllWorkCardProps) {
  return (
    <motion.article
      className="all-work-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(item.id)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${item.title}`}
    >
      <div className="all-work-card__link">
        <div 
          className="all-work-card__image"
          style={{ backgroundImage: item.image ? `url(${item.image})` : 'none' }}
        />
        <div className="all-work-card__overlay">
          <span className="all-work-card__title">{item.title}</span>
          <span className="all-work-card__year">{item.year}</span>
        </div>
      </div>
    </motion.article>
  )
}

function Footer() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <footer className="footer bg-grid" id="footer">
      <div className="container">
        <div className="footer__main">
          <motion.div
            className="footer__info"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-m" data-mascot-gesture="think">Got a project?</h2>
            <p className="paragraph-m">I'm taking on new work. Let's build something that moves.</p>
            <a href={`mailto:${SITE.email}`} className="footer__email">
              {SITE.email}
            </a>
          </motion.div>
          <motion.div
            className="footer__social"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <a href="https://github.com/subhanbhatti50134-jpg" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/subhanbhatti/" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <button onClick={toggleTheme} className="footer__theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
            </button>
          </motion.div>
        </div>
        <div className="footer__bottom">
          <p className="paragraph-xxs">© 2026 Vertex Tech — Lahore, Pakistan</p>
          <button type="button" className="footer__trick" data-trick>
            Do a trick
          </button>
        </div>
      </div>
    </footer>
  )
}

function AppContent() {
  const [openProject, setOpenProject] = useState<string | null>(null)

  /* hash deep-linking: #project-<id> */
  useEffect(() => {
    const readHash = () => {
      const m = window.location.hash.match(/^#project-(.+)$/)
      setOpenProject(m ? decodeURIComponent(m[1]) : null)
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  const openProjectById = (id: string) => {
    window.location.hash = `project-${id}`
    setOpenProject(id)
  }

  const closeProject = () => {
    /* clear hash without scrolling */
    history.replaceState(null, '', window.location.pathname + window.location.search)
    setOpenProject(null)
  }

  const navigateProject = (id: string) => {
    window.location.hash = `project-${id}`
    setOpenProject(id)
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <CartoonShowcase />
        <About />
        <Projects onOpen={openProjectById} />
        <Services />
        <Showcase3D />
        <AllWork onOpen={openProjectById} />
        <Contact />
      </main>
      <Footer />
      <Mascot />
      <ProjectDetail
        projectId={openProject}
        onClose={closeProject}
        onNavigate={navigateProject}
      />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}