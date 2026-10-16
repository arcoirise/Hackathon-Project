import { useState } from 'react'
import { useApi } from '../api.js'
import CorridorMap from './CorridorMap.jsx'
import Sources from './Sources.jsx'
import ViewStatus from './ViewStatus.jsx'

const PRIORITY_STYLE = {
  High: 'bg-brick-800 text-white',
  Medium: 'bg-stone-200 text-stone-700',
}

function CrossingCard({ crossing, active, onSelect }) {
  return (
    <section
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border bg-white p-4 transition ${
        active ? 'border-brick-600 ring-1 ring-brick-600' : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-stone-900">
            <button type="button" onClick={onSelect} className="text-left hover:underline">{crossing.title}</button>
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            {(crossing.exposure_m / 1000).toFixed(1)} km of road inside the habitat zone
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLE[crossing.priority] ?? PRIORITY_STYLE.Medium}`}>
          {crossing.priority}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {crossing.species.map((s) => (
          <span key={s.id} className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600">{s.name}</span>
        ))}
      </div>
      <ul className="mt-3 space-y-2.5 border-t border-stone-100 pt-3">
        {crossing.solutions.map((s) => (
          <li key={s.type} className="text-xs leading-snug">
            <span className="font-semibold text-stone-900">{s.name}</span>
            <span className="text-stone-400"> · for {s.for_species.join(', ')}</span>
            <p className="mt-0.5 text-stone-600">{s.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Every place the highway cuts through a habitat zone, with crossing concepts for the animals there.
export default function MitigationView({ region }) {
  const corridor = useApi(`/api/regions/${region.id}/corridor`)
  const result = useApi(`/api/regions/${region.id}/crossings?sensitivity=1`)
  const [highOnly, setHighOnly] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const error = corridor.error || result.error
  if (error) return <ViewStatus error={error} />
  if (corridor.loading || result.loading) return <ViewStatus>Loading mitigation proposals…</ViewStatus>

  const all = result.data.crossings
  const high = all.filter((c) => c.priority === 'High')
  const shown = highOnly ? high : all
  const filterButton = (active) =>
    `rounded-full border px-3 py-1 transition ${active ? 'border-brick-800 bg-brick-800 text-white' : 'border-stone-300 bg-white text-stone-600 hover:text-stone-900'}`

  return (
    <div className="col-span-full grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
      <div className="h-[65vh] min-h-[460px] lg:sticky lg:top-16 lg:h-[calc(100vh-5rem)] lg:self-start">
        <CorridorMap corridor={corridor.data} crossings={shown} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <aside className="flex flex-col gap-3">
        <div className="mb-1">
          <h2 className="text-lg font-bold text-stone-900">Mitigation proposals</h2>
          <p className="text-sm text-stone-400">
            Where {corridor.data.highway} cuts through habitat, and what could reconnect it.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button type="button" className={filterButton(!highOnly)} onClick={() => setHighOnly(false)}>All ({all.length})</button>
          <button type="button" className={filterButton(highOnly)} onClick={() => setHighOnly(true)}>High priority ({high.length})</button>
        </div>
        {shown.map((c) => (
          <CrossingCard key={c.id} crossing={c} active={c.id === selectedId} onSelect={() => setSelectedId(c.id)} />
        ))}
        {!shown.length && (
          <p className="rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-500">No conflicts at this priority.</p>
        )}
        <p className="text-[11px] leading-snug text-stone-400">
          Priority is High when at least 3.5 km of road runs inside a habitat zone. It ranks where to look first, not collision risk.
        </p>
      </aside>
      <div className="lg:col-span-2">
        <Sources sources={corridor.data.sources} notes={result.data.data_notes} />
      </div>
    </div>
  )
}
