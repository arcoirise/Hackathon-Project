import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SOLUTION_DETAILS } from '../../data/solutionData.js'

function Visual({ src, alt, caption }) {
  const [missing, setMissing] = useState(false)
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      {missing ? (
        <div className="flex h-72 w-full items-center justify-center bg-slate-100 px-6 text-center font-mono text-xs uppercase tracking-wider text-slate-400">
          Add {src.slice(1)} to /public
        </div>
      ) : (
        <img src={src} alt={alt} onError={() => setMissing(true)} className="h-auto max-h-[450px] w-full rounded-lg border border-slate-200 bg-slate-50 object-contain" />
      )}
      <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-sm italic leading-snug text-slate-600">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function ViewSolutionModal({ solutionId, onClose }) {
  const data = SOLUTION_DETAILS[solutionId]

  useEffect(() => {
    if (!data) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [data, onClose])

  if (!data) return null
  const visuals = [data.visuals.blueprint, data.visuals.render].filter(Boolean)
  const cols = data.columns.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="solution-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="mx-auto max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-xl border-2 border-slate-200 bg-white p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="rounded-full bg-emerald-700 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white">
              {data.category}
            </span>
            {data.subcategory && (
              <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-slate-500">{data.subcategory}</span>
            )}
            <h2 id="solution-modal-title" className="mt-4 font-serif text-3xl font-semibold leading-tight text-slate-900">
              {data.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className={`mt-8 grid grid-cols-1 gap-6 ${visuals.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {visuals.map((v) => <Visual key={v.src} {...v} />)}
        </div>

        <div className={`mt-8 grid grid-cols-1 gap-6 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {data.columns.map((col) => (
            <section key={col.heading} className="rounded-lg border border-slate-200 bg-slate-50/60 p-6">
              <h3 className="border-b border-slate-200 pb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {col.heading}
              </h3>
              {col.items && (
                <dl className="mt-4 space-y-3">
                  {col.items.map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-400">{k}</dt>
                      <dd className="text-sm font-medium text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {col.paragraphs && (
                <div className="mt-4 space-y-3">
                  {col.paragraphs.map((p) => <p key={p} className="text-sm leading-relaxed text-stone-700">{p}</p>)}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
