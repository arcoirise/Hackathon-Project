export default function Header({ regions, regionId, onRegionChange, onDownload }) {
  return (
    <section className="flex flex-col gap-6 px-6 pt-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brick-600">Infrastructure Analysis</p>
        <h1 className="mt-1 text-5xl font-bold tracking-tight text-stone-900">WildPass</h1>
        <p className="mt-2 text-sm text-stone-500">
          San Diego (I-15) Corridor · Temecula / Rainbow Canyon Segment
        </p>
      </div>
      <div className="max-w-xl lg:text-right">
        <p className="text-sm leading-relaxed text-stone-600">
          <b className="font-semibold text-stone-900">The barrier.</b> Interstate 15 separates the Santa Ana
          Mountains from the Agua Tibia and Palomar ranges, cutting off east–west movement for mountain lions
          and other wildlife through the Temecula / Rainbow Canyon segment.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 lg:justify-end">
          <label className="flex items-center gap-2 text-sm text-stone-500">
            Region
            <select
              value={regionId}
              onChange={(e) => onRegionChange(e.target.value)}
              className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brick-600"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={onDownload}
            className="rounded-full bg-brick-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brick-600"
          >
            Download data brief
          </button>
        </div>
      </div>
    </section>
  )
}
