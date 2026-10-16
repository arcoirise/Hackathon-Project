function MetricCard({ title, subtext, value, unit, tone }) {
  return (
    <section className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
        <p className="mt-1 text-xs leading-snug text-stone-500">{subtext}</p>
      </div>
      <div className="shrink-0 text-right">
        <div className={`text-2xl font-bold leading-none tracking-tight ${tone === 'danger' ? 'text-brick-800' : 'text-stone-900'}`}>
          {value}
        </div>
        {unit && <div className="mt-1 text-xs text-stone-500">{unit}</div>}
      </div>
    </section>
  )
}

export default function Diagnostics({ region }) {
  return (
    <aside className="flex flex-col gap-3">
      <div className="mb-1">
        <h2 className="text-lg font-bold text-stone-900">Region diagnostics</h2>
        <p className="text-sm text-stone-400">Why this segment matters.</p>
      </div>
      {(region.cards ?? []).map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </aside>
  )
}
