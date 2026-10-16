function Stat({ label, value }) {
  return (
    <div className="rounded-md bg-stone-50 p-3">
      <dt className="text-xs uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-stone-900">{value}</dd>
    </div>
  )
}

export default function DiagnosticsCard({ region }) {
  const d = region.diagnostics
  const max = Math.max(...d.mortality.perYear.map((y) => y.count))

  return (
    <aside className="flex flex-col gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold">Region diagnostics</h2>
        <p className="text-sm text-stone-500">{region.name}</p>
      </div>

      <section>
        <h3 className="mb-2 text-sm font-medium text-stone-700">Species</h3>
        <dl className="grid grid-cols-2 gap-2">
          <Stat label="Scientific name" value={<i>{d.species}</i>} />
          <Stat label="Common name" value={d.commonName} />
        </dl>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium text-stone-700">Mortality</h3>
        <dl className="grid grid-cols-2 gap-2">
          <Stat label="Recorded deaths" value={d.mortality.total} />
          <Stat label="Period" value={d.mortality.period} />
        </dl>
        <ul className="mt-3 space-y-1.5">
          {d.mortality.perYear.map((y) => (
            <li key={y.year} className="flex items-center gap-2 text-sm">
              <span className="w-10 text-stone-500">{y.year}</span>
              <div className="h-2 flex-1 rounded bg-stone-100">
                <div className="h-2 rounded bg-emerald-600" style={{ width: `${(y.count / max) * 100}%` }} />
              </div>
              <span className="w-4 text-right tabular-nums">{y.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium text-stone-700">Hotspots</h3>
        <ul className="divide-y divide-stone-100 text-sm">
          {d.mortality.hotspots.map((h) => (
            <li key={h.label} className="flex justify-between py-1.5">
              <span>{h.label}</span>
              <span className="tabular-nums text-stone-600">{h.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-stone-500">{d.notes} Figures are illustrative placeholders.</p>
    </aside>
  )
}
