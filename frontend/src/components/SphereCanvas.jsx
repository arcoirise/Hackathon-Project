import { useEffect, useRef } from 'react'

const TAU = Math.PI * 2
const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const SPRITE = 100
const KINDS = ['lion', 'elk', 'bear', 'owl', 'coyote', 'tardigrade']

// ---------- sprites: tiny stylised wildlife heads, pre-rendered once per tint ----------

const circle = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill() }
const ellipse = (c, x, y, rx, ry, rot = 0) => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.fill() }
const poly = (c, pts) => {
  c.beginPath()
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)))
  c.closePath()
  c.fill()
}
// Eyes/nose are punched out so the background shows through.
const cut = (c, fn) => { c.globalCompositeOperation = 'destination-out'; fn(); c.globalCompositeOperation = 'source-over' }

const DRAW = {
  lion(c) {
    circle(c, 27, 33, 11); circle(c, 73, 33, 11)
    ellipse(c, 50, 57, 30, 26)
    cut(c, () => {
      circle(c, 38, 52, 4); circle(c, 62, 52, 4)
      poly(c, [[43, 63], [57, 63], [50, 71]])
    })
  },
  elk(c) {
    c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round'
    for (const m of [1, -1]) {
      const X = (x) => (m === 1 ? x : 100 - x)
      const line = (pts) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(X(x), y) : c.moveTo(X(x), y))); c.stroke() }
      line([[40, 46], [30, 26], [25, 6]])
      line([[30, 26], [13, 20]])
      line([[27, 14], [39, 10]])
      ellipse(c, X(25), 54, 12, 6, m * -0.5)
    }
    ellipse(c, 50, 68, 19, 27)
    cut(c, () => { circle(c, 39, 58, 3.5); circle(c, 61, 58, 3.5); ellipse(c, 50, 90, 7, 3) })
  },
  bear(c) {
    circle(c, 26, 32, 11); circle(c, 74, 32, 11)
    circle(c, 50, 56, 29)
    cut(c, () => {
      circle(c, 39, 50, 3.5); circle(c, 61, 50, 3.5)
      ellipse(c, 50, 66, 5, 3.5)
    })
  },
  owl(c) {
    poly(c, [[18, 18], [40, 34], [22, 46]]); poly(c, [[82, 18], [60, 34], [78, 46]])
    ellipse(c, 50, 58, 34, 30)
    cut(c, () => {
      circle(c, 34, 54, 11); circle(c, 66, 54, 11)
      poly(c, [[44, 62], [56, 62], [50, 76]])
    })
    circle(c, 34, 54, 5); circle(c, 66, 54, 5)
  },
  coyote(c) {
    poly(c, [[22, 42], [28, 6], [42, 30], [58, 30], [72, 6], [78, 42], [61, 70], [50, 94], [39, 70]])
    cut(c, () => { ellipse(c, 38, 46, 3.5, 2.5, 0.3); ellipse(c, 62, 46, 3.5, 2.5, -0.3); circle(c, 50, 88, 3) })
  },
  tardigrade(c) {
    for (const x of [27, 42, 58, 73]) circle(c, x, 76, 7)
    ellipse(c, 50, 52, 38, 27)
    circle(c, 86, 50, 10)
    cut(c, () => {
      c.lineWidth = 2.5; c.lineCap = 'round'
      for (const x of [34, 50, 66]) { c.beginPath(); c.moveTo(x, 34); c.quadraticCurveTo(x + 4, 52, x, 70); c.stroke() }
      circle(c, 88, 47, 2)
    })
  },
}

function buildSprites() {
  const make = (color) =>
    KINDS.map((k) => {
      const cv = document.createElement('canvas')
      cv.width = cv.height = SPRITE
      const c = cv.getContext('2d')
      c.fillStyle = color
      c.strokeStyle = color
      DRAW[k](c)
      return cv
    })
  return { front: make('#b3402f'), back: make('#7a2a1f') }
}

// ---------- particles ----------

// Fibonacci-sphere points as unit vectors.
function buildPoints(count) {
  const pts = new Array(count)
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = GOLDEN * i
    pts[i] = {
      x: Math.cos(theta) * r, y, z: Math.sin(theta) * r,
      phase: Math.random() * TAU,
      kind: Math.floor(Math.random() * KINDS.length),
      tilt: (Math.random() - 0.5) * 0.6,
      // screen-space spring state: displacement and velocity
      ox: 0, oy: 0, vx: 0, vy: 0,
      sx: 0, sy: 0, size: 0, depth: 0,
    }
  }
  return pts
}

/**
 * Interactive 3D sphere of wildlife-head icons with cursor "swish" physics.
 * `controls` = { dotSize, distortion, density } (each 0–100), read through a ref every frame
 * so slider changes never restart the animation.
 *   dotSize    -> icon size
 *   distortion -> swish force (push + swirl + drag-along strength)
 *   density    -> number of icons
 */
export default function SphereCanvas({ controls, className }) {
  const canvasRef = useRef(null)
  const controlsRef = useRef(controls)
  controlsRef.current = controls

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprites = buildSprites()

    let width = 0
    let height = 0
    let points = []
    let pointCount = 0
    let rotY = 0
    let rotX = -0.35
    const idleVel = reduceMotion ? 0.0004 : 0.0016
    let velY = idleVel
    let velX = 0
    const mouse = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, active: false }
    let dragging = false
    let last = { x: 0, y: 0 }
    let raf = 0
    let prevT = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const toLocal = (e) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMove = (e) => {
      const p = toLocal(e)
      if (!mouse.active) { mouse.px = p.x; mouse.py = p.y } // no velocity spike on entry
      mouse.x = p.x
      mouse.y = p.y
      mouse.active = true
      if (dragging) {
        velY = (p.x - last.x) * 0.004
        velX = (p.y - last.y) * 0.004
        rotY += velY
        rotX += velX
        last = p
      }
    }
    const onDown = (e) => {
      dragging = true
      last = toLocal(e)
      canvas.setPointerCapture(e.pointerId)
    }
    const onUp = () => { dragging = false }
    const onLeave = () => { mouse.active = false }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    const frame = (t) => {
      // dt in 60fps frames, clamped so a background tab doesn't explode the springs
      const dt = Math.min((t - prevT) / 16.667 || 1, 3)
      prevT = t
      const { dotSize, distortion, density } = controlsRef.current

      // 150–1500 icons; only rebuild when the slider changes the count.
      const wanted = Math.round(150 + (density / 100) * 1350)
      if (wanted !== pointCount) {
        points = buildPoints(wanted)
        pointCount = wanted
      }

      if (!dragging) {
        velY += (idleVel - velY) * 0.03 * dt
        velX *= Math.pow(0.95, dt)
        rotY += velY * dt
        rotX += velX * dt
        rotX = Math.max(-1.2, Math.min(1.2, rotX))
      }

      // Cursor velocity (px per 60fps frame), smoothed.
      if (mouse.active) {
        const ivx = (mouse.x - mouse.px) / dt
        const ivy = (mouse.y - mouse.py) / dt
        mouse.vx += (ivx - mouse.vx) * 0.35
        mouse.vy += (ivy - mouse.vy) * 0.35
      } else {
        mouse.vx *= 0.8
        mouse.vy *= 0.8
      }
      mouse.px = mouse.x
      mouse.py = mouse.y
      const speed = Math.hypot(mouse.vx, mouse.vy)

      const radius = Math.min(width, height) * 0.4
      const cx = width / 2
      const cy = height / 2
      const focal = 3.2
      const iconPx = 9 + (dotSize / 100) * 24
      const force = 0.25 + (distortion / 100) * 2.25 // swish force multiplier
      const reach = 90 + (distortion / 100) * 70      // cursor field radius, px

      const sinY = Math.sin(rotY), cosY = Math.cos(rotY)
      const sinX = Math.sin(rotX), cosX = Math.cos(rotX)
      const time = t * 0.0009
      const springK = 0.035 // pull back to the orbit
      const damping = Math.pow(0.9, dt)

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const r = 1 + Math.sin(time * 1.6 + p.phase + p.y * 3) * 0.03
        const px = p.x * r, py = p.y * r, pz = p.z * r
        const x1 = px * cosY + pz * sinY
        const z1 = -px * sinY + pz * cosY
        const y2 = py * cosX - z1 * sinX
        const z2 = py * sinX + z1 * cosX
        const scale = focal / (focal - z2)
        const bx = cx + x1 * radius * scale
        const by = cy + y2 * radius * scale

        // Force field: radial push + swirl + drag-along with the cursor's motion.
        if (mouse.active) {
          const dx = bx + p.ox - mouse.x
          const dy = by + p.oy - mouse.y
          const d = Math.hypot(dx, dy)
          if (d < reach && d > 0.001) {
            const f = (1 - d / reach) ** 2
            const nx = dx / d, ny = dy / d
            const k = f * force * dt
            const push = 0.55 + Math.min(speed, 40) * 0.05
            p.vx += nx * push * k + (-ny) * Math.min(speed, 40) * 0.06 * k + mouse.vx * 0.05 * k
            p.vy += ny * push * k + nx * Math.min(speed, 40) * 0.06 * k + mouse.vy * 0.05 * k
          }
        }

        // Damped spring back to formation (semi-implicit Euler).
        p.vx = (p.vx - p.ox * springK * dt) * damping
        p.vy = (p.vy - p.oy * springK * dt) * damping
        p.ox += p.vx * dt
        p.oy += p.vy * dt

        p.sx = bx + p.ox
        p.sy = by + p.oy
        p.depth = (z2 + 1) / 2
        p.size = iconPx * scale * (0.55 + p.depth * 0.6)
      }

      ctx.clearRect(0, 0, width, height)
      // Back hemisphere first so near icons overlap far ones.
      for (let pass = 0; pass < 2; pass++) {
        const set = pass === 0 ? sprites.back : sprites.front
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          if ((p.depth > 0.5) !== (pass === 1)) continue
          ctx.globalAlpha = 0.25 + p.depth * 0.75
          ctx.save()
          ctx.translate(p.sx, p.sy)
          ctx.rotate(p.tilt + p.vx * 0.02)
          ctx.drawImage(set[p.kind], -p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
      aria-label="Interactive 3D sphere of California wildlife head icons. Move the cursor to swish them; drag to rotate."
      role="img"
    />
  )
}
