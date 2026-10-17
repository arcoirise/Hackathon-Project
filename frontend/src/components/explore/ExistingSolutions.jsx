const SOLUTION = {
  category: 'Active Infrastructure | Caltrans District 1',
  title: 'US-101 Elk Detection & Active Warning System (Stone Lagoon)',
  overview:
    'Authorized under Coastal Commission Permit 1-23-0909, this active deployment along a 1.6-mile stretch of US-101 near Stone Lagoon (Post Miles 114.0 to 115.5) integrates ~25 wooden post-mounted transceivers designed to detect CDFW-collared Roosevelt elk and dynamically trigger roadside warnings.',
  components: [
    '~25 transceivers mounted on 8-foot wooden posts for real-time tracking.',
    'Two 10-foot-tall changeable message signs (CMS) and four flashing LED warning signs.',
    'Up to three new vehicle speed recorders to monitor traffic response during activations.',
  ],
  effectiveness:
    'High-Precision Active Warning / Targeted Mitigation; directly alerts motorists during high-probability crossing windows compared to passive static signage.',
  linkLabel: 'View Official California Coastal Commission Staff Report (PDF)',
  href: 'https://documents.coastal.ca.gov/reports/2024/7/Th5a/Th5a-7-2024-report.pdf',
}

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

export default function ExistingSolutions({ solution = SOLUTION }) {
  return (
    <section aria-labelledby="existing-solutions" className="mt-16 border-t border-stone-200 pt-12">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8B0000]">02</span>
        <h2 id="existing-solutions" className="font-serif text-3xl tracking-tight text-[#2C2C2C]">
          <span aria-hidden="true">— </span>Existing Solutions
        </h2>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
        A review of baseline mitigations, field interventions, and active protocols currently deployed along the corridor.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6">
        <article className="col-span-full flex flex-col rounded-xl border border-t-4 border-slate-200 border-t-emerald-500 bg-white p-6 transition-all duration-200 hover:shadow-md md:p-8">
          <span className="self-start rounded-full bg-slate-100 px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-500">
            {solution.category}
          </span>
          <h3 className="mt-4 font-serif text-xl font-medium leading-snug text-slate-900 md:text-2xl">{solution.title}</h3>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-stone-700">{solution.overview}</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Deployed Components</p>
              <ul className="space-y-2 text-sm leading-relaxed text-[#2C2C2C]">
                {solution.components.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span aria-hidden="true" className="text-emerald-600">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Effectiveness</p>
              <p className="text-sm leading-relaxed text-[#2C2C2C]">{solution.effectiveness}</p>
            </div>
          </div>

          <a
            href={solution.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-1.5 self-start border-t border-slate-100 pt-4 text-xs font-medium text-[#8B0000] transition hover:text-[#A00000]"
          >
            {solution.linkLabel} <ExternalIcon />
          </a>
        </article>
      </div>
    </section>
  )
}
