const SLIDERS = [
  { key: 'dotSize', label: 'Icon Size' },
  { key: 'distortion', label: 'Swish Force' },
  { key: 'density', label: 'Density' },
]

export default function VisControl({ controls, onChange }) {
  return (
    <div className="w-60 rounded-2xl border border-stone-200 bg-white/85 p-4 shadow-sm backdrop-blur">
      <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Vis Control</h2>
      <div className="space-y-3">
        {SLIDERS.map(({ key, label }) => (
          <label key={key} className="block text-xs text-stone-600">
            <span className="mb-1 flex justify-between">
              {label}
              <span className="tabular-nums text-stone-400">{controls[key]}</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={controls[key]}
              onChange={(e) => onChange({ ...controls, [key]: Number(e.target.value) })}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-brick-600"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
