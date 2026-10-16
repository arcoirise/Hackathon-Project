function Card({ title, children }) {
  return (
    <section className="rounded-lg border border-blush-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brick-800">{title}</h3>
      {children}
    </section>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right font-medium text-stone-900">{value}</dd>
    </div>
  )
}

export default function Diagnostics({ region }) {
  const { species, mortality, infrastructure, connectivity } = region
  const max = Math.max(...mortality.per_year.map((y) => y.count))

  return (
    <aside className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Region diagnostics</h2>
        <p className="text-sm text-stone-600">{region.name}</p>
      </div>

      <Card title="Species">
        <dl>
          <Row label="Scientific name" value={<i>{species.scientific_name}</i>} />
          <Row label="Common name" value={species.common_name} />
          <Row label="Habitat" value={species.habitat} />
        </dl>
      </Card>

      <Card title={`Mortality (${mortality.period})`}>
        <dl>
          <Row label="Recorded deaths" value={mortality.total} />
        </dl>
        <ul className="mt-2 space-y-1.5">
          {mortality.per_year.map((y) => (
            <li key={y.year} className="flex items-center gap-2 text-sm">
              <span className="w-10 text-stone-500">{y.year}</span>
              <div className="h-2 flex-1 rounded bg-blush-100">
                <div className="h-2 rounded bg-brick-600" style={{ width: `${(y.count / max) * 100}%` }} />
              </div>
              <span className="w-5 text-right tabular-nums">{y.count}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-3 divide-y divide-blush-100 border-t border-blush-100 text-sm">
          {mortality.hotspots.map((h) => (
            <li key={h.label} className="flex justify-between py-1.5">
              <span>{h.label}</span>
              <span className="tabular-nums text-stone-600">{h.count}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Infrastructure">
        <dl>
          <Row label="Highway" value={region.highway} />
          <Row label="Lanes" value={infrastructure.lanes} />
          <Row label="Avg daily traffic" value={infrastructure.avg_daily_traffic.toLocaleString()} />
          <Row label="Barrier" value={infrastructure.barrier_type} />
          <Row label="Existing crossings" value={infrastructure.existing_crossings} />
        </dl>
      </Card>

      <Card title="Connectivity">
        <dl>
          <Row label="Linkage" value={connectivity.linkage} />
          <Row label="Connectivity score" value={connectivity.connectivity_score.toFixed(2)} />
          <Row label="Habitat patch" value={`${connectivity.habitat_patch_ha.toLocaleString()} ha`} />
        </dl>
      </Card>

      <p className="text-xs text-stone-500">Illustrative placeholder figures for prototyping.</p>
    </aside>
  )
}
