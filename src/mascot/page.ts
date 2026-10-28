import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type AnyEvent = Event & { detail?: unknown }

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1

export function initMascotPage(): () => void {
  const tracked: Array<[EventTarget, string, EventListener, boolean | AddEventListenerOptions | undefined]> = []
  const triggers: ScrollTrigger[] = []
  const observers: IntersectionObserver[] = []
  const delayed: gsap.core.Tween[] = []

  const on = (target: EventTarget, type: string, listener: EventListener, opts?: boolean | AddEventListenerOptions) => {
    tracked.push([target, type, listener, opts])
    target.addEventListener(type, listener, opts)
  }
  const st = (config: Parameters<typeof ScrollTrigger.create>[0]) => {
    const trigger = ScrollTrigger.create(config)
    triggers.push(trigger)
    return trigger
  }
  const observe = (el: Element, cb: () => void) => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect()
            cb()
          }
        }
      },
      { rootMargin: '-25% 0px -25% 0px' },
    )
    io.observe(el)
    observers.push(io)
  }

  /* ---------------------------------------------------------- first visit */
  const visited = localStorage.getItem('visited') === 'yes'
  localStorage.setItem('visited', 'yes')
  let grabbed = localStorage.getItem('grabbed') === 'yes'
  on(window, 'mascot:react', (event) => {
    if ((event as AnyEvent).detail === 'grab') {
      grabbed = true
      localStorage.setItem('grabbed', 'yes')
    }
  })

  /* ------------------------------------------------------------- bubbles */
  const body = document.querySelector<HTMLElement>('.mascot-bubble__body')
  const stack = document.querySelector<HTMLElement>('.bubble-lines')
  const lines = Array.from(document.querySelectorAll<HTMLElement>('.bubble-line'))

  let activeLine = -1
  let bodyShown = false

  const showLine = (index: number, show: boolean) => {
    if (!body || !stack) return
    if (show) {
      if (activeLine !== index) {
        const before = stack.offsetHeight
        if (activeLine > -1) {
          lines[activeLine].classList.add('absolute')
          gsap.to(lines[activeLine], { opacity: 0, duration: bodyShown ? 0.15 * RM : 0, overwrite: true })
        }
        lines[index].classList.remove('absolute')
        gsap.to(lines[index], { opacity: 1, duration: 0.3 * RM, delay: bodyShown ? 0.15 * RM : 0, overwrite: true })
        if (bodyShown) {
          gsap.fromTo(stack, { height: before }, { height: stack.offsetHeight, duration: 0.45 * RM, ease: 'power3.inOut', clearProps: 'height' })
        }
        activeLine = index
      }
      if (!bodyShown) {
        gsap.to(body, { opacity: 1, scale: 1, duration: 0.5 * RM, ease: 'back.out(1.7)', overwrite: true })
      }
      bodyShown = true
    } else if (activeLine === index) {
      gsap.to(body, { opacity: 0, scale: 0.9, duration: 0.25 * RM, ease: 'power2.in', overwrite: true })
      bodyShown = false
    }
  }

  const hintIndices = lines.map((line, i) => (line.hasAttribute('data-hint-line') ? i : -1)).filter((i) => i >= 0)
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const hintIndex = coarse ? hintIndices[1] ?? hintIndices[0] ?? 0 : hintIndices[0] ?? 0
  const returningIndex = lines.findIndex((line) => line.hasAttribute('data-returning-line'))
  const startIndex = visited && returningIndex >= 0 ? returningIndex : 0
  const copyIndex = lines.length - 2
  const doneIndex = lines.length - 1

  if (body) gsap.set(body, { scale: 0.9 })
  if (lines.length) gsap.set(lines, { opacity: 0 })

  const hideBubbles = () => {
    if (lines[copyIndex]) showLine(copyIndex, false)
    if (lines[doneIndex]) showLine(doneIndex, false)
    if (lines[hintIndex]) showLine(hintIndex, false)
  }

  /* ------------------------------------------------ word-by-word reveal */
  const split = new Map<HTMLElement, { html: string; spans: HTMLElement[] }>()
  const splitWords = (el: HTMLElement) => {
    const html = el.innerHTML
    const spans: HTMLElement[] = []
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        for (const part of (node.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part))
          else {
            const span = document.createElement('span')
            span.className = 'bubble-word'
            span.textContent = part
            frag.appendChild(span)
            spans.push(span)
          }
        }
        el.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const span = document.createElement('span')
        span.className = 'bubble-word'
        el.insertBefore(span, node)
        span.appendChild(node)
        spans.push(span)
      }
    }
    split.set(el, { html, spans })
    return spans
  }

  if (lines[startIndex]) {
    const words = splitWords(lines[startIndex])
    gsap.fromTo(
      words,
      { opacity: 0.12 },
      {
        opacity: 1,
        duration: 0.2,
        stagger: {
          each: 0.12 * RM,
          onStart: () => {
            window.dispatchEvent(new CustomEvent('mascot:say'))
          },
        },
      },
    )
  }

  /* -------------------------------------------------- hero + hint timing */
  delayed.push(
    gsap.delayedCall(1.5 * RM, () => {
      let heroTrigger: ScrollTrigger | undefined
      heroTrigger = st({
        trigger: '#hero',
        start: 'top bottom',
        end: 'bottom 60%',
        onToggle: ({ isActive }) => {
          showLine(startIndex, isActive)
          if (!isActive) showLine(hintIndex, false)
        },
      })
      if (heroTrigger.isActive) showLine(startIndex, true)
      const hintCall = gsap.delayedCall(5, () => {
        if (RM && !grabbed && heroTrigger?.isActive) showLine(hintIndex, true)
      })
      delayed.push(hintCall as unknown as gsap.core.Tween)
    }) as unknown as gsap.core.Tween,
  )

  /* ------------------------------------------------------- contact copy */
  const contact = document.querySelector<HTMLElement>('#contact')
  let copyCall: gsap.core.Tween | undefined
  const sayWithGesture = (index: number, gesture?: string) => {
    showLine(index, true)
    if (gesture) window.dispatchEvent(new CustomEvent('mascot:gesture', { detail: gesture }))
    copyCall?.kill()
    copyCall = gsap.delayedCall(4, hideBubbles)
    delayed.push(copyCall as unknown as gsap.core.Tween)
  }

  if (contact) {
    for (const link of contact.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]')) {
      on(link, 'pointerenter', () => sayWithGesture(copyIndex, 'cheer'))
      on(link, 'focusin', () => {
        if (link.matches(':focus-visible')) sayWithGesture(copyIndex, 'cheer')
      })
      on(link, 'click', (event) => {
        event.preventDefault()
        const address = link.href.replace('mailto:', '')
        navigator.clipboard
          .writeText(address)
          .then(() => sayWithGesture(doneIndex, 'thumbs'))
          .catch(() => sayWithGesture(doneIndex))
      })
    }
    st({
      trigger: '#contact',
      start: 'top center',
      onEnter: () => {
        if (RM && !grabbed) sayWithGesture(hintIndex)
      },
      onLeaveBack: hideBubbles,
    })
  }

  /* -------------------------------------------- look at project previews */
  for (const card of document.querySelectorAll<HTMLElement>('.project-card, .all-work-card')) {
    const target = () =>
      card.querySelector<HTMLElement>('.project-card__image, .all-work-card__image') ??
      card.querySelector('img') ??
      card
    on(card, 'pointerenter', () => window.dispatchEvent(new CustomEvent('mascot:look', { detail: target() })))
    on(card, 'focusin', () => window.dispatchEvent(new CustomEvent('mascot:look', { detail: target() })))
  }

  /* ----------------------------------------- say / swipe / gesture hooks */
  for (const el of document.querySelectorAll<HTMLElement>('[data-mascot-say]')) {
    observe(el, () => window.dispatchEvent(new CustomEvent('mascot:say', { detail: el })))
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-mascot-swipe]')) {
    observe(el, () => window.dispatchEvent(new CustomEvent('mascot:swipe', { detail: el })))
  }
  const trick = document.querySelector<HTMLButtonElement>('[data-trick]')
  if (trick) on(trick, 'click', () => window.dispatchEvent(new Event('mascot:trick')))

  on(window, 'hashchange', () => {
    if (/^#project-/.test(window.location.hash)) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const detail = document.querySelector<HTMLElement>('.detail')
          if (detail) window.dispatchEvent(new CustomEvent('mascot:swipe', { detail }))
        })
      })
    }
  })

  /* ------------------------------------------------------------- sounds */
  const envelope = (node: AudioNode, time: number, peak: number, duration: number) => {
    const gain = new GainNode(node.context, { gain: 0 })
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(peak, time + 0.008)
    gain.gain.exponentialRampToValueAtTime(1e-4, time + duration)
    gain.connect(node)
    return gain
  }
  const tone = (node: AudioNode, time: number, type: OscillatorType, from: number, to: number, duration: number, peak: number) => {
    const osc = new OscillatorNode(node.context, { type, frequency: from })
    osc.frequency.setValueAtTime(from, time)
    osc.frequency.exponentialRampToValueAtTime(to, time + duration)
    osc.connect(envelope(node, time, peak, duration))
    osc.start(time)
    osc.stop(time + duration)
    return osc
  }
  const wobble = (node: OscillatorNode, time: number, frequency: number, depth: number, duration: number) => {
    const lfo = new OscillatorNode(node.context, { frequency })
    const gain = new GainNode(node.context, { gain: depth })
    gain.gain.setValueAtTime(depth, time)
    gain.gain.linearRampToValueAtTime(0, time + duration)
    lfo.connect(gain).connect(node.frequency)
    lfo.start(time)
    lfo.stop(time + duration)
  }
  const noise = (node: AudioNode, time: number, duration: number) => {
    const ctx = node.context
    const length = Math.ceil(ctx.sampleRate * duration)
    const buffer = new AudioBuffer({ length, sampleRate: ctx.sampleRate })
    buffer.getChannelData(0).set(Float32Array.from({ length }, () => Math.random() * 2 - 1))
    const source = new AudioBufferSourceNode(ctx, { buffer })
    source.connect(node)
    source.start(time)
  }

  type Sound = (dest: AudioNode, time: number) => void
  const sfx: Record<string, Sound | undefined> = {
    blip: (dest, time) => {
      const f = 392 * 2 ** (Math.random() * 5 / 12)
      tone(dest, time, 'triangle', f * 1.25, f, 0.07, 0.1)
    },
    pat: (dest, time) => {
      tone(dest, time, 'sine', 523, 587, 0.16, 0.13)
      tone(dest, time + 0.13, 'sine', 659, 784, 0.3, 0.12)
    },
    surprise: (dest, time) => tone(dest, time, 'triangle', 330, 990, 0.2, 0.14),
    giggle: (dest, time) => {
      ;[988, 880, 932, 784].forEach((f, i) => tone(dest, time + i * 0.12, 'triangle', f, f * 1.12, 0.1, 0.13))
    },
    grab: (dest, time) => wobble(tone(dest, time, 'triangle', 196, 523, 0.4, 0.14), time, 14, 14, 0.4),
    drop: (dest, time) => wobble(tone(dest, time, 'sine', 392, 220, 0.7, 0.15), time, 11, 80, 0.7),
    sleep: (dest, time) => {
      const ctx = dest.context
      const filter = new BiquadFilterNode(ctx, { type: 'lowpass', Q: 6 })
      filter.frequency.setValueAtTime(400, time)
      filter.frequency.linearRampToValueAtTime(1100, time + 0.4)
      filter.frequency.linearRampToValueAtTime(300, time + 1.1)
      filter.connect(dest)
      const gain = new GainNode(ctx, { gain: 0 })
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.075, time + 0.3)
      gain.gain.linearRampToValueAtTime(0.06, time + 0.8)
      gain.gain.linearRampToValueAtTime(0, time + 1.2)
      gain.connect(filter)
      const snore = new OscillatorNode(ctx, { type: 'sawtooth' })
      snore.frequency.setValueAtTime(262, time)
      snore.frequency.linearRampToValueAtTime(349, time + 0.35)
      snore.frequency.linearRampToValueAtTime(175, time + 1.2)
      snore.connect(gain)
      snore.start(time)
      snore.stop(time + 1.2)
    },
    wake: (dest, time) => {
      tone(dest, time, 'triangle', 587, 880, 0.06, 0.14)
      tone(dest, time + 0.07, 'triangle', 880, 1319, 0.12, 0.14)
    },
    dizzy: (dest, time) => wobble(tone(dest, time, 'sine', 880, 330, 1.2, 0.13), time, 7, 70, 1.2),
    laugh: (dest, time) => {
      ;[988, 932, 880, 831, 784, 740, 698, 659].forEach((f, i) => tone(dest, time + i * 0.13, 'triangle', f, f * 1.12, 0.1, 0.13))
    },
    sulk: (dest, time) => {
      tone(dest, time, 'triangle', 262, 247, 0.12, 0.12)
      tone(dest, time + 0.15, 'triangle', 220, 165, 0.3, 0.12)
    },
    sniffle: (dest, time) => {
      tone(dest, time, 'sine', 392, 523, 0.3, 0.1)
      tone(dest, time + 0.6, 'sine', 440, 659, 0.35, 0.1)
    },
    sneeze: (dest, time) => {
      const filter = new BiquadFilterNode(dest.context, { type: 'bandpass', Q: 1.2 })
      filter.frequency.setValueAtTime(2600, time)
      filter.frequency.exponentialRampToValueAtTime(700, time + 0.3)
      filter.connect(envelope(dest, time, 0.35, 0.3))
      noise(filter, time, 0.3)
      tone(dest, time, 'triangle', 880, 220, 0.25, 0.1)
    },
    dance: (dest, time) => {
      ;[523, 659, 784, 659, 587, 740, 880, 1047].forEach((f, i) => tone(dest, time + i * 0.2, 'triangle', f, f, 0.12, 0.11))
    },
    panic: (dest, time) => {
      ;[988, 740, 988, 740, 988, 740, 988, 740].forEach((f, i) => tone(dest, time + i * 0.1, 'triangle', f, f, 0.08, 0.1))
    },
    fly: (dest, time) => wobble(tone(dest, time, 'triangle', 262, 784, 1.9, 0.12), time, 9, 20, 1.9),
    hiccup: (dest, time) => {
      for (const at of [0.3, 1.2, 1.8]) tone(dest, time + at, 'triangle', 700, 1400, 0.07, 0.13)
    },
    peekaboo: (dest, time) => {
      tone(dest, time, 'triangle', 392, 1175, 0.18, 0.14)
      tone(dest, time + 0.16, 'triangle', 784, 1568, 0.14, 0.12)
    },
    selfie: (dest, time) => {
      const filter = new BiquadFilterNode(dest.context, { type: 'highpass', frequency: 2000 })
      filter.connect(envelope(dest, time + 1.1, 0.25, 0.05))
      noise(filter, time + 1.1, 0.05)
      tone(dest, time + 1.1, 'square', 1800, 1200, 0.03, 0.06)
    },
    vanish: (dest, time) => {
      wobble(tone(dest, time, 'sine', 880, 110, 1, 0.12), time, 30, 40, 1)
      wobble(tone(dest, time + 2, 'sine', 110, 880, 1, 0.12), time + 2, 30, 40, 1)
    },
    punch: (dest, time) => {
      tone(dest, time, 'sine', 160, 50, 0.18, 0.3)
      const filter = new BiquadFilterNode(dest.context, { type: 'lowpass', frequency: 900 })
      filter.connect(envelope(dest, time, 0.3, 0.08))
      noise(filter, time, 0.08)
    },
    bonk: (dest, time) => {
      tone(dest, time, 'triangle', 880, 440, 0.12, 0.2)
      tone(dest, time, 'sine', 220, 110, 0.15, 0.2)
    },
    bell: (dest, time) => {
      for (const at of [0, 0.22]) {
        tone(dest, time + at, 'sine', 1319, 1319, 0.6, 0.12)
        tone(dest, time + at, 'sine', 3296, 3296, 0.3, 0.05)
      }
    },
  }

  const toggle = document.querySelector<HTMLButtonElement>('.sound-toggle')
  let soundOn = localStorage.getItem('sound') === 'on'
  let audioCtx: AudioContext | undefined
  let lastSay = 0
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation

  const ensureCtx = () => {
    if (!audioCtx) audioCtx = new AudioContext()
    void audioCtx.resume()
  }
  const play = (sound: Sound) => {
    if (!soundOn || !activation?.hasBeenActive) return
    ensureCtx()
    if (audioCtx && audioCtx.state === 'running') sound(audioCtx.destination, audioCtx.currentTime)
  }

  toggle?.setAttribute('aria-pressed', String(soundOn))
  if (toggle) {
    on(toggle, 'click', () => {
      soundOn = !soundOn
      toggle.setAttribute('aria-pressed', String(soundOn))
      localStorage.setItem('sound', soundOn ? 'on' : 'off')
      if (soundOn) ensureCtx()
    })
  }
  on(window, 'mascot:say', () => {
    const now = performance.now()
    if (now - lastSay < 120) return
    lastSay = now
    const sound = sfx.blip
    if (sound) play(sound)
  })
  on(window, 'mascot:react', (event) => {
    const sound = sfx[(event as AnyEvent).detail as string]
    if (sound) play(sound)
  })

  /* --------------------------------------------------- body color sync */
  const syncBg = () => {
    const sections = document.querySelectorAll<HTMLElement>('main section')
    let current: HTMLElement | undefined
    sections.forEach((section) => {
      if (!current && section.getBoundingClientRect().bottom > 0) current = section
    })
    if (current) document.body.style.backgroundColor = getComputedStyle(current).backgroundColor
  }
  gsap.ticker.add(syncBg)

  return () => {
    gsap.ticker.remove(syncBg)
    document.body.style.removeProperty('background-color')
    for (const [target, type, listener, opts] of tracked) target.removeEventListener(type, listener, opts)
    tracked.length = 0
    for (const trigger of triggers) trigger.kill()
    triggers.length = 0
    for (const io of observers) io.disconnect()
    observers.length = 0
    for (const call of delayed) call.kill()
    delayed.length = 0
    copyCall?.kill()
    gsap.killTweensOf(lines)
    if (body) gsap.killTweensOf(body)
    if (stack) gsap.killTweensOf(stack)
    for (const [el, saved] of split) el.innerHTML = saved.html
    split.clear()
  }
}
