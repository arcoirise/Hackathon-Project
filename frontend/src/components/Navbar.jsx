const TABS = [
  'Project Overview',
  'Infrastructure Analysis',
  'Habitat & Connectivity (WCO)',
  'Mitigation Proposals',
]
const ACTIVE = 'Infrastructure Analysis'

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded-full p-1.5 text-stone-500 transition hover:bg-black/5 hover:text-stone-900"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  )
}

export default function Navbar({ onDownload }) {
  return (
    <header className="sticky top-0 z-[1000] border-b border-stone-200/80 bg-[#FBF9F6]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="relative mx-auto flex h-12 max-w-[1600px] items-center px-6">
        <div className="flex items-center gap-1">
          <IconButton label="Search">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
          </IconButton>
          <IconButton label="Download data brief" onClick={onDownload}>
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
          </IconButton>
        </div>
        <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-stretch gap-7 text-[13px] md:flex">
          {TABS.map((tab) => (
            <a
              key={tab}
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-current={tab === ACTIVE ? 'page' : undefined}
              className={`flex items-center whitespace-nowrap border-b-2 pt-0.5 ${
                tab === ACTIVE
                  ? 'border-brick-800 font-semibold text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
