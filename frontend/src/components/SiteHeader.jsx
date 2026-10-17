const LINKS = [
  { label: 'About Us', href: '#/about', page: 'about' },
  { label: 'Regions', href: '#/regions', page: 'regions' },
  { label: 'Dashboard', href: '#/dashboard', page: 'dashboard' },
]

// Dashboard links jump straight to the explore map, even when the hash is already #/dashboard.
const toExplore = (e) => {
  const section = document.getElementById('explore')
  if (!section) return
  e.preventDefault()
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// `active` is a LINKS `page` or undefined. When `onNavigate` is given, every link hands its href to it
// instead of navigating (the landing page uses this to show a loader when leaving the detail map).
export default function SiteHeader({ active, onNavigate }) {
  const go = (href) => (onNavigate ? (e) => { e.preventDefault(); onNavigate(href) } : href === '#/dashboard' ? toExplore : undefined)
  return (
    <header className="relative z-[1000] border-b border-stone-200/70 bg-[#FBF9F6]/80 backdrop-blur-xl">
      <div className="mx-auto grid h-14 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-6">
        <a href="#/" onClick={go('#/')} className="justify-self-start text-lg font-bold tracking-tight text-stone-900">
          WildPass
        </a>
        <nav className="hidden items-center gap-1 rounded-full border border-stone-200 bg-white/70 p-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={go(l.href)}
              aria-current={l.page === active ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                l.page === active
                  ? 'bg-stone-900 font-medium text-white'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
