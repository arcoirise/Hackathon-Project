export const TABS = [
  'Project Overview',
  'Infrastructure Analysis',
  'Habitat & Connectivity',
  'Mitigation Proposals',
]

export default function Tabs({ active, onChange }) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-stone-200 bg-white px-6" aria-label="Sections">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          aria-current={active === tab ? 'page' : undefined}
          className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            active === tab
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}
