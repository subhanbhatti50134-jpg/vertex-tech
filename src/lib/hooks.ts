import { useEffect, useRef, useState } from 'react'
export const useIsMobile = () => {
  const [m, setM] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => { const q = window.matchMedia('(max-width: 767px)'); const f = () => setM(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f) }, [])
  return m
}
export const usePrefersReducedMotion = () => {
  const [r, setR] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { const q = window.matchMedia('(prefers-reduced-motion: reduce)'); const f = () => setR(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f) }, [])
  return r
}
export const useInView = <T extends Element>() => {
  const ref = useRef<T>(null); const [v, setV] = useState(false)
  useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: '100px' }); io.observe(el); return () => io.disconnect() }, [])
  return [ref, v] as const
}
export const hasWebGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }
