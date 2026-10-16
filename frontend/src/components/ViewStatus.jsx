// Placeholder for a tab while its backend data loads or if the backend can't be reached.
export default function ViewStatus({ error, children }) {
  return (
    <div className="col-span-full rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center text-sm text-stone-500">
      {error ? (
        <>
          <p className="font-medium text-brick-800">Couldn't load this view from the backend ({error}).</p>
          <p className="mt-1">Start it from the <code>backend</code> folder with <code>uvicorn main:app --reload</code>, then refresh.</p>
        </>
      ) : (
        children
      )}
    </div>
  )
}
