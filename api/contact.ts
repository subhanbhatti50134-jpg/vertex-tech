import type { VercelRequest, VercelResponse } from '@vercel/node'

const hits = new Map<string, number[]>() // best-effort per-instance limiter; use Upstash/Vercel KV for strict limits
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL, from = process.env.CONTACT_FROM_EMAIL
  if (!key || !to || !from) return res.status(503).json({ error: 'Contact service is not configured' })

  const ip = String(req.headers['x-forwarded-for'] ?? 'unknown').split(',')[0].trim()
  const now = Date.now(), recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (recent.length >= 5) return res.status(429).json({ error: 'Too many requests. Try again later.' })
  hits.set(ip, [...recent, now])

  const b = (req.body ?? {}) as Record<string, unknown>
  const s = (k: string, max: number) => String(b[k] ?? '').trim().slice(0, max)
  if (s('website', 100) || Number(b.elapsed) < 3000) return res.status(200).json({ ok: true }) // bots: silently drop
  const d = { name: s('name', 100), email: s('email', 200), phone: s('phone', 30), service: s('service', 100), budget: s('budget', 50), details: s('details', 3000) }
  if (d.name.length < 2 || !/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(d.email) || !d.service || d.details.length < 20) return res.status(400).json({ error: 'Invalid form data' })

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: d.email, subject: `New inquiry: ${d.service} (${d.name})`.replace(/[\r\n]/g, ' '),
      html: `<p><b>Name:</b> ${esc(d.name)}</p><p><b>Email:</b> ${esc(d.email)}</p><p><b>Phone:</b> ${esc(d.phone || '-')}</p><p><b>Service:</b> ${esc(d.service)}</p><p><b>Budget:</b> ${esc(d.budget || '-')}</p><p>${esc(d.details).replace(/\n/g, '<br>')}</p>` }),
  })
  if (!r.ok) return res.status(502).json({ error: 'Email delivery failed' })
  return res.status(200).json({ ok: true })
}
