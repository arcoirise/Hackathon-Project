import { useEffect, useState } from 'react'
import SphereCanvas from './SphereCanvas.jsx'
import VisControl from './VisControl.jsx'
import SiteHeader from './SiteHeader.jsx'
import ExploreSection from './explore/ExploreSection.jsx'

const MISSION =
  "Modern highways and expanding infrastructure severely fragment natural ecosystems, trapping wildlife and isolating populations such as California's mountain lions and tule elk. WildPass is an interactive civil planning dashboard made for planners, developers, and civil engineers that maps severe wildlife infrastructure conflicts across key California regions and models actionable science-backed solutions to protect both biodiversity and safety."

const BRIDGING =
  "Human expansion and natural ecosystems have long been treated as opposing forces—where modern infrastructure advances, natural life recedes. WildPass redefines this dynamic by treating civil engineering and ecological conservation as complementary disciplines. By providing planners, developers, and engineers with data-driven spatial analytics, WildPass bridges the divide between modern transportation networks and native wildlife corridors. Reconnecting fragmented habitats doesn't just protect endangered species—it directly enhances public safety, reduces costly animal-vehicle collisions, and fosters a sustainable landscape where modern mobility and natural ecosystems thrive in harmony."

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function Landing({ section }) {
  const [controls, setControls] = useState({ dotSize: 45, distortion: 40, density: 55 })

  useEffect(() => {
    if (section) scrollTo(section)
  }, [section])

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-stone-900">
      <SiteHeader />

      <section className="relative isolate overflow-hidden">
        <SphereCanvas
          controls={controls}
          className="absolute inset-0 -z-10 h-full w-full opacity-90 lg:left-[22%] lg:w-[78%]"
        />
        <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1400px] flex-col justify-center px-6 py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">
            Wildlife × Infrastructure
          </p>
          <h1 className="pointer-events-none text-6xl font-bold leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
            WildPass
          </h1>
          <p className="pointer-events-none mt-8 max-w-md pr-8 text-base leading-relaxed text-stone-700">
            Mapping where California's highways cut off wildlife, and modeling the crossings that reconnect them.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollTo('explore')}
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Explore Regions ↓
            </button>
            <button
              type="button"
              onClick={() => scrollTo('mission')}
              className="rounded-full border border-stone-300 bg-white/70 px-6 py-3 text-sm font-medium transition hover:bg-white"
            >
              Read Mission
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 hidden sm:block">
          <VisControl controls={controls} onChange={setControls} />
        </div>
      </section>

      <section id="mission" className="scroll-mt-14 border-t border-stone-200 px-6 py-24">
        <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">Our Mission</h2>
          <div className="mt-4 space-y-6 text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:mt-0">
            <p>{MISSION}</p>
            <p>{BRIDGING}</p>
          </div>
        </div>
      </section>

      <ExploreSection />
    </div>
  )
}
