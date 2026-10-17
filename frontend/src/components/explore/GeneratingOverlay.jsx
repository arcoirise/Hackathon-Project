import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SphereCanvas from '../SphereCanvas.jsx'

const TOTAL_MS = 3500
const STEP_MS = 1200 // status lines and facts both advance on this beat

const STEPS = [
  '[1/3] Analyzing terrain topography & highway traffic volume...',
  '[2/3] Fetching UC Davis Road Ecology Center mortality datasets...',
  '[3/3] Rendering vegetated overpass bridge model...',
]

const FACTS = [
  'Fact: The Wallis Annenberg Wildlife Crossing over US-101 is the largest vegetated overpass in the world, spanning 210 feet!',
  'Fact: Wildlife crossings paired with fencing can cut animal–vehicle collisions by 80% or more.',
  "Fact: Mountain lion P-22 lived out his life in Griffith Park, boxed in by the 101 and 405 freeways.",
  'Fact: Banff National Park has more than 40 wildlife crossing structures, among the most studied in the world.',
]

const SPHERE = { dotSize: 28, distortion: 60, density: 30 }

export default function GeneratingOverlay({ conflict, onDone, onCancel }) {
  const [step, setStep] = useState(0)
  const [fact, setFact] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), STEP_MS),
      setTimeout(() => setStep(2), STEP_MS * 2),
      setTimeout(onDone, TOTAL_MS),
    ]
    const facts = setInterval(() => setFact((f) => (f + 1) % FACTS.length), STEP_MS)
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => {
      timers.forEach(clearTimeout)
      clearInterval(facts)
      window.removeEventListener('keydown', onKey)
    }
  }, [onDone, onCancel])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[3000] flex flex-col items-center justify-center bg-[#FBF9F6] px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ y: [0, -16, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="h-64 w-64 sm:h-80 sm:w-80"
      >
        <SphereCanvas controls={SPHERE} className="h-full w-full" />
      </motion.div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">
        Generating solution · {conflict.title}
      </p>

      <ul className="mt-4 w-full max-w-lg space-y-2 text-sm">
        {STEPS.slice(0, step + 1).map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 ${i < step ? 'text-stone-400' : 'font-medium text-stone-900'}`}
          >
            <span className="mt-0.5 w-4 shrink-0">{i < step ? '✓' : '›'}</span>
            {line}
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 h-1 w-full max-w-lg overflow-hidden rounded-full bg-stone-200">
        <motion.div
          className="h-full rounded-full bg-brick-600"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: TOTAL_MS / 1000, ease: 'linear' }}
        />
      </div>

      <div className="mt-8 h-16 w-full max-w-xl text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={fact}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="font-serif text-lg leading-snug text-stone-700"
          >
            {FACTS[fact]}
          </motion.p>
        </AnimatePresence>
      </div>

      <button type="button" onClick={onCancel} className="mt-4 text-xs text-stone-400 underline-offset-2 hover:text-stone-700 hover:underline">
        Cancel
      </button>
    </motion.div>
  )
}
