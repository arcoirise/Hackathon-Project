import { useState } from 'react'

// Highlights each "#" placeholder (and "#%" / "#ft") so unfilled numbers are easy to spot.
function WithPlaceholders({ text }) {
  return text.split(/(#(?:%|ft)?)/).map((part, i) =>
    part.startsWith('#') ? (
      <b key={i} className="font-semibold text-brick-800">{part}</b>
    ) : (
      part
    ),
  )
}

function Slot({ badge, tone, image }) {
  // Missing files (or a dead placeholder URL) fall back to a labelled empty panel.
  const [failed, setFailed] = useState(false)
  return (
    <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[8/5] bg-stone-100">
        {image.src && !failed ? (
          <img
            src={image.src}
            alt={image.alt}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="max-w-xs text-sm text-stone-400">{image.alt}</p>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm ${
            tone === 'after' ? 'bg-[#2f6b3f]' : 'bg-brick-800'
          }`}
        >
          {badge}
        </span>
      </div>
      <figcaption className="px-4 py-3 text-sm text-stone-600">{image.caption}</figcaption>
    </figure>
  )
}

function StatColumn({ column, tone }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-serif text-xl tracking-tight text-stone-900">
        <span className={`h-2 w-2 rounded-full ${tone === 'after' ? 'bg-[#2f6b3f]' : 'bg-brick-800'}`} />
        {column.heading}
      </h3>
      <div className="grid gap-3">
        {column.cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${tone === 'after' ? 'text-[#2f6b3f]' : 'text-brick-600'}`}>
              {c.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
              <WithPlaceholders text={c.text} />
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Spotlight({ spotlight }) {
  return (
    <section className="px-6 pb-16 pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brick-600">Engineering spotlight</p>
      <h2 className="mt-1 max-w-3xl font-serif text-3xl leading-tight tracking-tight text-stone-900">
        {spotlight.title}
      </h2>
      {/* Keyed so each region's images get a fresh load/fail state. */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Slot badge="Before" image={spotlight.before} />
        <Slot badge="After" tone="after" image={spotlight.after} />
      </div>
      <div className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-2">
        <StatColumn column={spotlight.left} />
        <StatColumn column={spotlight.right} tone="after" />
      </div>
    </section>
  )
}
