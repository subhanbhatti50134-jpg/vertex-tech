# Vertex Tech website

React + TypeScript + Vite, Tailwind, React Three Fiber, GSAP, Framer Motion. Contact form posts to `api/contact.ts` (Vercel serverless function, sends via Resend).

## Run
```
npm install
npm run dev        # UI only; /api/contact needs `npx vercel dev` to work locally
npm run build      # typecheck + production build into dist/
```

## Mascot: Seb

The site ships with a full interactive cartoon-character system: a full-viewport pixelated Three.js character (`src/mascot/module.js` + `src/components/Mascot.tsx`) with a dither shader, scroll choreography, and a line-stacking speech bubble.

- **Placements** — sections opt in via `data-mascot="hero|left|right|project|badge|outro"`; the character slides/scales to each placement as you scroll, and the page background color follows the section (`data-mascot-bg`).
- **Behaviors** — ~30 gags: wave, dance, punch mode, panic, fly, vanish, hiccup, peekaboo, selfie, dizzy, sneeze, sulk, think, cheer, thumbs, cheer + lime badge ring, intro hand-drop, plus dress-up outfits (`data-mascot-outfit`) and swipe/scroll reactions.
- **Bubble & quips** — multi-line word-revealed bubble with pointer tail; reactions reply with quips (`data-mascot-react` / `mascot:react` events), returning-to-top and 5-second idle hints.
- **Interaction** — grab & fling, punch click mode, context menu (or triple-click the handle) with 11 quick actions, copy-email flow, sound toggle (WebAudio blips), title/favicon "I'll wait here" tab trick.
- **Reduced motion** — when `prefers-reduced-motion: reduce` is set, the whole gag layer (including `window.seb`) is disabled, matching the reference behavior.
- **Console API** — `seb.wave()`, `seb.dance()`, `seb.punch()`, `seb.outfit('hiker')`, `seb.sound()`, … (`window.seb`, only outside reduced-motion).

## Contact form setup (required before it can succeed)
1. Create a [Resend](https://resend.com) account and create an API key.
2. Verify the domain you want to send from in Resend. The `CONTACT_FROM_EMAIL` address must use that verified domain.
3. In Vercel, open **Project → Settings → Environment Variables** and add these variables for **Production** (and Preview if you test preview deployments):
   - `RESEND_API_KEY`: your Resend API key
   - `CONTACT_TO_EMAIL`: `vertextechnologylhr@gmail.com`
   - `CONTACT_FROM_EMAIL`: for example, `Vertex Tech <inquiries@your-verified-domain.com>`
4. Save the variables and redeploy the latest deployment. Environment variable changes do not apply to an already-running deployment.

For a quick Resend test before verifying a domain, use `onboarding@resend.dev` as `CONTACT_FROM_EMAIL`. Resend only permits that test sender to deliver to the email address associated with your Resend account.

Without these variables the API returns `503 Contact service is not configured`; it never shows success unless Resend accepted the email.
Protections: server validation, honeypot, minimum fill time, per-IP limit (in-memory, best effort; use KV for strict limits), HTML escaping, header-injection checks.

## Deploy
Push to GitHub and import in Vercel (framework: Vite). `vercel.json` sets security headers.

## Edit content
- `src/lib/config.ts` contact details, socials (footer shows only socials you add)
- `src/lib/data.ts` services, projects, process steps
- Replace `https://vertextech.example` in `index.html`, `public/robots.txt`, `public/sitemap.xml` with your domain
- `public/privacy.html` and `public/terms.html` are placeholders
