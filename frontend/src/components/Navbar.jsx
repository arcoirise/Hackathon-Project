export default function Navbar({ regions, regionId, onRegionChange }) {
  return (
    <header className="flex items-center justify-between border-b border-blush-200 bg-blush-100 px-6 py-3">
      <h1 className="text-xl font-bold tracking-tight text-brick-800">WildPass</h1>
      <label className="flex items-center gap-2 text-sm text-stone-700">
        Region
        <select
          value={regionId}
          onChange={(e) => onRegionChange(e.target.value)}
          className="rounded-md border border-blush-200 bg-white px-3 py-1.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brick-600"
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>
    </header>
  )
}
