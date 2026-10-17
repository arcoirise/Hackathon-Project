import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CA_REGIONS } from '../../data/conflicts.js'
import AnimalIcon from '../AnimalIcon.jsx'

export default function ConflictSidebar({ conflict, onClose, onGenerate }) {
  useEffect(() => {
    if (!conflict) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [conflict, onClose])

  const region = conflict && CA_REGIONS.find((r) => r.id === conflict.regionId)

  return (
    <AnimatePresence>
      {conflict && (
        <>
          <motion.button
            type="button"
            aria-label="Close diagnostics"
            className="fixed inset-0 z-[2400] cursor-default bg-stone-900/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label={`${conflict.title} diagnostics`}
            className="fixed inset-y-0 right-0 z-[2500] flex w-full max-w-md flex-col overflow-y-auto bg-[#FBF9F6] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 p-6">
              <div>
                <span
                  className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                  style={{ background: region.color }}
                >
                  {region.name}
                </span>
                <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-stone-900">{conflict.title}</h3>
                <p className="mt-1 text-sm text-stone-500">{conflict.place}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-stone-500 transition hover:bg-black/5 hover:text-stone-900"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-8 p-6">
              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brick-600">Impact metrics</h4>
                <div className="mt-3 grid gap-3">
                  {conflict.metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                      <span className="text-sm text-stone-600">{m.label}</span>
                      <span className="text-right">
                        <span className={`text-lg font-bold tracking-tight ${m.tone === 'danger' ? 'text-brick-800' : 'text-stone-900'}`}>
                          {m.value}
                        </span>
                        {m.unit && <span className="block text-xs text-stone-500">{m.unit}</span>}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-stone-500">Traffic: {conflict.traffic}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brick-600">Target species</h4>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {conflict.species.map((s) => (
                    <li key={s.name} className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1.5 pl-1.5 pr-4 text-sm text-stone-700">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100">
                        <AnimalIcon species={s.icon} className="h-6 w-6 text-brick-800" />
                      </span>
                      {s.name}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="border-t border-stone-200 p-6">
              <button
                type="button"
                onClick={() => onGenerate(conflict.id)}
                className="w-full rounded-full bg-brick-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brick-600 active:scale-[0.98]"
              >
                Generate Civil Engineering Solution ✨
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
