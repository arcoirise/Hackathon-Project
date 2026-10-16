export default function Header({ regions, regionId, onRegionChange }) {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>🐾</span>
        <h1 className="text-lg font-semibold tracking-tight text-emerald-800">WildPass</h1>
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-600">
        Region
        <select
          value={regionId}
          onChange={(e) => onRegionChange(e.target.value)}
          className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>
    </header>
  )
}
