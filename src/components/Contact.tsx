import { useCallback, useRef, useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { SITE } from '../lib/config'

export default function Contact() {
  const startRef = useRef(performance.now())
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const fd = new FormData(form)
    const data: Record<string, string> = {}
    fd.forEach((v, k) => { data[k] = String(v) })
    data.elapsed = String(Math.max(0, Math.round(performance.now() - startRef.current)))
    setStatus('sending'); setMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) { setStatus('error'); setMsg(json.error ?? 'Could not send. Try again.'); return }
      setStatus('ok')
      form.reset()
    } catch {
      setStatus('error'); setMsg('Network error. Try again.')
    }
  }, [])

  return (
    <section className="contact bg-grid" id="contact" data-mascot="outro">
      <div className="container">
        <div className="contact__inner">
          <div className="contact__copy">
            <h2 className="contact__heading" data-mascot-gesture="wave">Start your next project</h2>
            <p className="contact__lead">Tell me what you're building. I'll reply with a plan and estimate — no spam, just a straight answer.</p>
            <div className="contact__meta">
              <div className="contact__meta-item">
                <Mail aria-hidden="true" />
                <div>
                  <a href={`mailto:${SITE.email}`} className="contact__meta-value">{SITE.email}</a>
                </div>
              </div>
              <div className="contact__meta-item">
                <Phone aria-hidden="true" />
                <div>
                  <a href={`tel:${SITE.phoneTel}`} className="contact__meta-value">{SITE.phoneDisplay}</a>
                </div>
              </div>
              <div className="contact__meta-item">
                <MapPin aria-hidden="true" />
                <div>
                  <span className="contact__meta-value">{SITE.location}</span>
                </div>
              </div>
            </div>
            <div className="contact__quick-actions">
              <a href={`mailto:${SITE.email}`} className="contact__quick-action">
                <Mail size={18} strokeWidth={1.6} /> Write to us
              </a>
              <a href={`tel:${SITE.phoneTel}`} className="contact__quick-action">
                <Phone size={18} strokeWidth={1.6} /> Call us
              </a>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="contact__field-row">
              <label className="contact__field">
                <span className="contact__field-label">Full name</span>
                <input name="name" type="text" required minLength={2} autoComplete="name" />
              </label>
              <label className="contact__field">
                <span className="contact__field-label">Email address</span>
                <input name="email" type="email" required autoComplete="email" />
              </label>
            </div>
            <label className="contact__field">
              <span className="contact__field-label">Phone (optional)</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <div className="contact__field-row">
              <label className="contact__field">
                <span className="contact__field-label">Service interested in</span>
                <select name="service" required>
                  <option value="">Choose a service</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Shopify Development">Shopify Development</option>
                  <option value="Shopify Management">Shopify Management</option>
                  <option value="Web Applications">Web Applications</option>
                  <option value="Custom Software">Custom Software</option>
                  <option value="Application Development">Application Development</option>
                </select>
              </label>
              <label className="contact__field">
                <span className="contact__field-label">Approximate budget (optional)</span>
                <select name="budget">
                  <option value="">Not set yet</option>
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1,500">$500 - $1,500</option>
                  <option value="$1,500 - $5,000">$1,500 - $5,000</option>
                  <option value="$5,000+">$5,000+</option>
                </select>
              </label>
            </div>
            <label className="contact__field contact__field--textarea">
              <span className="contact__field-label">What do you need built?</span>
              <textarea name="details" rows={6} required minLength={20} autoComplete="off"></textarea>
            </label>
            <label className="contact__hp">
              <span>Leave this field empty</span>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="contact__actions">
              <button type="submit" className="contact__btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : <><Send size={16} strokeWidth={1.5} /> Send message</>}
              </button>
              {status === 'ok' && <p className="contact__status ok">Sent — I’ll get back to you shortly.</p>}
              {status === 'error' && <p className="contact__status err">{msg}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
