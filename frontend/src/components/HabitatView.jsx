import { useApi } from '../api.js'
import CorridorMap from './CorridorMap.jsx'
import Sources from './Sources.jsx'
import ViewStatus from './ViewStatus.jsx'

const GROUP_LABEL = {
  large: 'Large mammal',
  medium: 'Mid-sized mammal',
  small: 'Small mammal',
  semi_aquatic: 'Semi-aquatic mammal',
  bird: 'Bird',
}

// The habitat zones the highway passes through and the wildlife that use them.
export default function HabitatView({ region }) {
  const corridor = useApi(`/api/regions/${region.id}/corridor`)
  if (corridor.error) return <ViewStatus error={corridor.error} />
  if (corridor.loading) return <ViewStatus>Loading habitat data…</ViewStatus>

  const c = corridor.data
  const zonesFor = (speciesId) => c.habitats.filter((h) => h.species.some((s) => s.id === speciesId)).map((h) => h.name)

  return (
    <div className="col-span-full grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
      <div className="h-[65vh] min-h-[460px] lg:sticky lg:top-16 lg:h-[calc(100vh-5rem)] lg:self-start">
        <CorridorMap corridor={c} />
      </div>
      <aside className="flex flex-col gap-3">
        <div className="mb-1">
          <h2 className="text-lg font-bold text-stone-900">Habitat &amp; connectivity</h2>
          <p className="text-sm text-stone-400">Habitat zones {c.highway} passes through, and who lives there.</p>
        </div>
        {region.connectivity?.linkage && (
          <section className="rounded-2xl border border-stone-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-stone-900">Wildlife linkage</h3>
            <p className="mt-1 text-sm text-stone-600">{region.connectivity.linkage}</p>
          </section>
        )}
        {c.habitats.map((h) => (
          <section key={h.id} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-stone-900">{h.name}</h3>
              <span className="shrink-0 text-xs text-stone-400">≈ {((h.radius_m * 2) / 1000).toFixed(1)} km across</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {h.species.map((s) => (
                <span key={s.id} className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600">{s.name}</span>
              ))}
            </div>
          </section>
        ))}
        <p className="text-[11px] leading-snug text-stone-400">
          Zones are illustrative circles placed near known wildlife areas, not mapped habitat boundaries.
        </p>
      </aside>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold text-stone-900">Wildlife in this corridor</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-stone-400">
              <tr>
                <th className="pb-2 font-medium">Species</th>
                <th className="pb-2 font-medium">Scientific name</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Protection status</th>
                <th className="pb-2 font-medium">Habitat zones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {c.species.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 font-medium text-stone-900">{s.name}</td>
                  <td className="py-2 italic text-stone-600">{s.scientific_name}</td>
                  <td className="py-2 text-stone-600">{GROUP_LABEL[s.group] ?? s.group}</td>
                  <td className={`py-2 ${s.listed ? 'font-medium text-brick-800' : 'text-stone-400'}`}>{s.status ?? 'Not listed'}</td>
                  <td className="py-2 text-stone-600">{zonesFor(s.id).join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="lg:col-span-2">
        <Sources sources={c.sources} notes={c.data_notes} />
      </div>
    </div>
  )
}
