import { useEffect } from 'react'
import { motion } from 'framer-motion'
import SphereCanvas from '../SphereCanvas.jsx'

const LOAD_MS = 1900
const SPHERE = { dotSize: 28, distortion: 60, density: 30 }

// Brief full-screen loader shown between picking a region and the zoomed map.
export default function MapLoadingOverlay({ onDone, duration = LOAD_MS, message = 'loading map and conflict points' }) {
  useEffect(() => {
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [onDone, duration])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[3000] flex flex-col items-center justify-center bg-[#FBF9F6] px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={{ y: [0, -16, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="h-64 w-64 sm:h-80 sm:w-80"
      >
        <SphereCanvas controls={SPHERE} className="h-full w-full" />
      </motion.div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">
        {message}
      </p>
    </motion.div>
  )
}
