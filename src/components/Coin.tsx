import type { CoinFace } from '../types';

/** Schematic coin drawings: legends set around the rim, devices drawn as simple engravings. */
function Motif({ m }: { m?: CoinFace['motif'] }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (m) {
    case 'portrait':
      return (
        <g>
          <path
            d="M40,82 C36,70 32,56 35,44 C38,32 46,26 55,27 C61,28 64,33 64,38 L70,46 L65,48 C66,50 66,52 64,53 C65,55 65,57 64,59 C63,63 59,65 57,66 L58,82"
            {...s}
          />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const a = Math.PI * (1.05 + i * 0.105);
            const cx = 52 + 17 * Math.cos(a);
            const cy = 44 + 17 * Math.sin(a);
            return <ellipse key={i} cx={cx} cy={cy} rx="3.6" ry="1.6" transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`} {...s} strokeWidth={1} />;
          })}
          <path d="M37,47 C33,50 31,55 32,58 M36,48 C34,54 35,58 37,60" {...s} strokeWidth={1} />
        </g>
      );
    case 'daggers':
      return (
        <g>
          <path d="M50,40 C42,40 40,50 41,56 L59,56 C60,50 58,40 50,40 Z M40,57 L60,57" {...s} />
          {[30, 70].map((x) => (
            <g key={x}>
              <path d={`M${x},30 L${x},68`} {...s} strokeWidth={2.2} />
              <path d={`M${x - 6},66 L${x + 6},66 M${x},66 L${x},76 M${x - 3},77 L${x + 3},77`} {...s} />
            </g>
          ))}
        </g>
      );
    case 'aquila':
    case 'standards':
      return (
        <g>
          <path d="M50,32 L50,80" {...s} strokeWidth={1.8} />
          <path d="M50,34 C44,28 36,30 34,36 C40,34 44,36 47,40 M50,34 C56,28 64,30 66,36 C60,34 56,36 53,40 M47,40 L50,44 L53,40" {...s} />
          <path d="M44,48 L56,48 L56,56 L44,56 Z" {...s} />
          <path d="M32,40 L32,80 M28,46 L36,46 M28,54 L36,54 M28,62 L36,62 M68,40 L68,80 M64,46 L72,46 M64,54 L72,54 M64,62 L72,62" {...s} strokeWidth={1.1} />
        </g>
      );
    case 'temple':
      return (
        <g>
          <path d="M28,40 L50,28 L72,40 Z M28,42 L72,42 M26,76 L74,76 M28,72 L72,72" {...s} />
          {[32, 41, 59, 68].map((x) => (
            <path key={x} d={`M${x},44 L${x},70`} {...s} />
          ))}
          <path d="M45,48 L55,48 L55,70 L45,70 Z M50,48 L50,70" {...s} strokeWidth={1.1} />
        </g>
      );
    case 'chirho':
      return (
        <g>
          <path d="M50,28 L50,78 M36,40 L64,66 M64,40 L36,66" {...s} strokeWidth={2.2} />
          <path d="M50,28 C60,28 62,40 50,41" {...s} strokeWidth={2.2} />
          <circle cx="50" cy="53" r="30" {...s} strokeWidth={1} strokeDasharray="1.5 2.5" />
        </g>
      );
    case 'crocodile':
      return (
        <g>
          <path d="M22,58 C30,52 40,50 52,52 C62,53 70,52 78,48 C74,54 66,58 56,58 C46,60 34,61 22,58 Z" {...s} />
          <path d="M34,59 L32,66 M44,60 L43,67 M56,58 L57,65 M66,56 L68,62 M74,50 L80,47" {...s} />
          <path d="M30,40 L30,48 M70,40 L70,46" {...s} strokeWidth={0} />
        </g>
      );
    case 'wreath':
      return (
        <g>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const cx = 50 + 24 * Math.cos(a);
            const cy = 52 + 24 * Math.sin(a);
            return <ellipse key={i} cx={cx} cy={cy} rx="4.2" ry="1.8" transform={`rotate(${(a * 180) / Math.PI + 60} ${cx} ${cy})`} {...s} strokeWidth={1} />;
          })}
        </g>
      );
    case 'gate':
      return (
        <g>
          <path d="M30,76 L30,44 L38,44 L38,38 L44,38 L44,44 L56,44 L56,38 L62,38 L62,44 L70,44 L70,76 Z M44,76 L44,60 C44,54 56,54 56,60 L56,76" {...s} />
          <path d="M30,52 L70,52 M30,64 L44,64 M56,64 L70,64" {...s} strokeWidth={0.8} />
          <path d="M50,30 L50,24 M46,26 L54,26" {...s} />
        </g>
      );
    case 'clasped':
      return (
        <g>
          <path d="M24,56 C32,52 40,50 48,52 L60,50 C66,49 72,52 76,56 M24,62 C32,64 42,66 52,62 L62,60 C68,59 72,60 76,62 M46,52 C48,56 52,58 56,56" {...s} />
        </g>
      );
    default:
      return <circle cx="50" cy="52" r="8" {...s} />;
  }
}

function Face({ face, id, side }: { face: CoinFace; id: string; side: string }) {
  const pid = `rim-${id}-${side}`;
  return (
    <svg viewBox="0 0 100 104" className="coin-face" role="img" aria-label={`${side}: ${face.device}. Legend: ${face.legend}`}>
      <defs>
        <path id={pid} d="M 50,52 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
      </defs>
      <circle cx="50" cy="52" r="47" className="coin-metal" />
      <circle cx="50" cy="52" r="44.5" className="coin-rim" strokeDasharray="0.8 1.6" />
      <text className="coin-legend">
        <textPath href={`#${pid}`} startOffset="2%">
          {face.legend}
        </textPath>
      </text>
      <g className="coin-device">
        <Motif m={face.motif} />
      </g>
    </svg>
  );
}

export function CoinFigure({ coin, id }: { coin: { obverse: CoinFace; reverse: CoinFace; denomination: string; ref?: string }; id: string }) {
  return (
    <figure className="coin">
      <div className="coin-pair">
        {(['obverse', 'reverse'] as const).map((side) => (
          <div key={side} className="coin-side">
            <Face face={coin[side]} id={id} side={side} />
            <p className="coin-side-label ui">{side === 'obverse' ? 'Obverse (front)' : 'Reverse (back)'}</p>
            <p className="coin-device-text">{coin[side].device}</p>
          </div>
        ))}
      </div>
      <figcaption className="ui small">
        {coin.denomination}
        {coin.ref ? `. ${coin.ref}` : ''}. Schematic drawing for study, not a photograph: legends are shown in full, devices simplified.
      </figcaption>
      {(coin.obverse.gloss?.length || coin.reverse.gloss?.length) && (
        <table className="data coin-gloss">
          <caption className="ui small">Reading the legends</caption>
          <thead>
            <tr>
              <th scope="col">Abbreviation</th>
              <th scope="col">In full</th>
              <th scope="col">What it claims</th>
            </tr>
          </thead>
          <tbody>
            {[...(coin.obverse.gloss ?? []), ...(coin.reverse.gloss ?? [])].map((g) => (
              <tr key={g.abbr}>
                <td className="coin-abbr">{g.abbr}</td>
                <td>
                  <em>{g.full}</em>
                </td>
                <td>{g.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}
