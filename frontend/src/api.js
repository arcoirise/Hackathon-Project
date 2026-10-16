import { useEffect, useState } from 'react'

// GET a backend endpoint (proxied to FastAPI in dev). Refetches when the url changes and
// never throws: a failed request comes back as `error` so views can show a message instead.
export function useApi(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null })

  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        return res.json()
      })
      .then((data) => { if (!cancelled) setResult({ url, data, error: null }) })
      .catch((e) => { if (!cancelled) setResult({ url, data: null, error: e.message }) })
    return () => { cancelled = true }
  }, [url])

  const current = result.url === url
  return { data: current ? result.data : null, error: current ? result.error : null, loading: !current }
}
