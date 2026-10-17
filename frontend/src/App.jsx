import { useEffect, useState } from 'react'
import Landing from './components/Landing.jsx'
import CorridorDetailView from './components/CorridorDetailView.jsx'

// Hash routes all land on the single page and scroll to a section:
// #/ (top), #/about (mission), #/regions and #/dashboard (explore map); #/corridor/<id> is its own page
const SECTIONS = { about: 'mission', regions: 'explore', dashboard: 'explore', explore: 'explore' }

function parsePage() {
  const [, page = '', id = ''] = window.location.hash.split('/')
  return `${page}/${id}`
}

function usePage() {
  const [page, setPage] = useState(parsePage)
  useEffect(() => {
    const onChange = () => {
      const next = parsePage()
      setPage(next)
      if (next.startsWith('/') || next.startsWith('corridor')) window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return page
}

export default function App() {
  const [page, id] = usePage().split('/')
  if (page === 'corridor') return <CorridorDetailView corridorId={id} />
  return <Landing section={SECTIONS[page] ?? null} />
}
