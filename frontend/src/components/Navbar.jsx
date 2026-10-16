export default function Navbar({ regions, regionId, onRegionChange }) {
  return (
    <header className="sticky top-0 z-[1000] border-b border-white/60 bg-blush-100/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-[1600px] items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brick-600" aria-hidden />
          <h1 className="text-[15px] font-semibold tracking-tight text-brick-800">WildPass</h1>
        </div>
        <nav className="hidden items-center gap-1 text-[13px] text-stone-700 sm:flex">
          <span className="rounded-full bg-white/70 px-3 py-1 font-medium text-brick-800 shadow-sm">Dashboard</span>
          <span className="px-3 py-1">Map</span>
          <span className="px-3 py-1">Diagnostics</span>
        </nav>
        <label className="flex items-center gap-2 text-[13px] text-stone-700">
          <span className="hidden sm:inline">Region</span>
          <select
            value={regionId}
            onChange={(e) => onRegionChange(e.target.value)}
            className="rounded-full border border-blush-200 bg-white/80 px-3 py-1 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brick-600"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </label>
      </div>
    </header>
  )
}
