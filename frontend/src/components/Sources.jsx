// The studies and agency documents behind a corridor's species and solutions, plus data caveats.
export default function Sources({ sources = [], notes }) {
  if (!sources.length && !notes) return null
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-900">Evidence</h3>
      <p className="mt-1 text-xs text-stone-500">Studies and agency documents behind this corridor&apos;s wildlife and crossing concepts.</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {sources.map((s) => (
          <li key={s.url} className="text-sm">
            <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-brick-800 underline-offset-2 hover:underline">
              {s.title}
            </a>
            <p className="text-xs text-stone-400">{s.publisher}{s.date && ` · ${s.date}`}</p>
            <p className="mt-1 text-xs leading-snug text-stone-600">{s.supports}</p>
          </li>
        ))}
      </ul>
      {notes && (
        <p className="mt-4 border-t border-stone-100 pt-3 text-[11px] leading-snug text-stone-400">
          {Object.values(notes).join(' ')}
        </p>
      )}
    </section>
  )
}
