// Stylised silhouettes of each corridor's focal species, drawn on a 100x100 grid.
// Fill uses currentColor; eyes/noses are drawn in white so they read as cut-outs on the badge.
const W = { fill: '#fff' }
const WS = { stroke: '#fff', fill: 'none', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  // Mountain lion / puma: round ears, broad muzzle
  lion: (
    <>
      <circle cx="27" cy="33" r="11" />
      <circle cx="73" cy="33" r="11" />
      <ellipse cx="50" cy="57" rx="30" ry="26" />
      <circle cx="38" cy="52" r="4" {...W} />
      <circle cx="62" cy="52" r="4" {...W} />
      <path d="M43 63h14l-7 8Z" {...W} />
      <path d="M50 71v5M43 79q7 5 14 0" {...WS} />
    </>
  ),
  // Tule elk: antlers sweeping up from a long face
  elk: (
    <>
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M40 46 30 26 25 6M30 26 13 20M27 14l12-4" />
        <path d="M60 46 70 26 75 6M70 26l17-6M73 14 61 10" />
      </g>
      <ellipse cx="25" cy="54" rx="12" ry="6" transform="rotate(-28 25 54)" />
      <ellipse cx="75" cy="54" rx="12" ry="6" transform="rotate(28 75 54)" />
      <ellipse cx="50" cy="68" rx="19" ry="27" />
      <circle cx="39" cy="58" r="3.5" {...W} />
      <circle cx="61" cy="58" r="3.5" {...W} />
      <ellipse cx="50" cy="90" rx="7" ry="3" {...W} />
    </>
  ),
  // Bobcat: tufted ears, cheek ruffs, vertical-slit eyes
  bobcat: (
    <>
      <path d="M20 16 38 40h24L80 16l8 38-12 24-26 12-26-12-12-24Z" />
      <ellipse cx="38" cy="56" rx="3.2" ry="4.6" {...W} />
      <ellipse cx="62" cy="56" rx="3.2" ry="4.6" {...W} />
      <path d="M44 68h12l-6 7Z" {...W} />
      <path d="M50 75v4M44 81q6 4 12 0" {...WS} />
      <path d="M16 62l12 3M17 70l11 1M84 62 72 65M83 70l-11 1" {...WS} />
      <path d="M26 24l6 12M74 24l-6 12" {...WS} />
    </>
  ),
}

export default function AnimalIcon({ species, className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden>
      {ICONS[species] ?? ICONS.lion}
    </svg>
  )
}
