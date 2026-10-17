import { motion } from 'framer-motion'
import { CA_REGIONS } from '../../data/conflicts.js'
import Spotlight from '../Spotlight.jsx'

export default function SolutionView({ conflict, onBack }) {
  const region = CA_REGIONS.find((r) => r.id === conflict.regionId)

  return (
    <motion.div
      className="solution-print fixed inset-0 z-[3000] overflow-y-auto bg-[#FBF9F6]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="no-print flex items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            ← Back to map
          </button>
        </div>

        <header className="px-6 pt-4">
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
            style={{ background: region.color }}
          >
            {region.name}
          </span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brick-600">
            Generated civil engineering solution
          </p>
          <h2 className="mt-1 text-5xl font-bold tracking-tight text-stone-900">{conflict.title}</h2>
          <p className="mt-2 text-sm text-stone-500">{conflict.place}</p>
        </header>

        <Spotlight spotlight={conflict.solution} />

        <div className="no-print sticky bottom-0 border-t border-stone-200 bg-[#FBF9F6]/90 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-stone-500">Opens your browser's print dialog; choose "Save as PDF".</p>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-brick-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brick-600 active:scale-[0.98]"
            >
              Download Complete Engineering Data Brief (PDF)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
