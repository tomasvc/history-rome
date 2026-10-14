import type { Certainty } from '../types';

export const CERTAINTY_LABEL: Record<Certainty, string> = {
  established: 'Established',
  interpretation: 'Interpretation',
  contested: 'Contested',
  speculative: 'Speculative',
};
export const CERTAINTY_HELP: Record<Certainty, string> = {
  established: 'Securely attested by independent evidence; few specialists would dispute it.',
  interpretation: 'A reasonable reading of the evidence that most historians share, though it involves judgement.',
  contested: 'Historians actively disagree; the evidence supports more than one view.',
  speculative: 'A hypothesis the evidence cannot currently confirm or refute.',
};

/** Glyphs differ in shape as well as colour so the distinction never relies on colour alone. */
export function CertaintyGlyph({ level, size = 14 }: { level: Certainty; size?: number }) {
  const c = `var(--cert-${level})`;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" className="cert-glyph">
      {level === 'established' && <circle cx="8" cy="8" r="6.5" fill={c} />}
      {level === 'interpretation' && (
        <>
          <circle cx="8" cy="8" r="6" fill="none" stroke={c} strokeWidth="1.5" />
          <path d="M8 2 A6 6 0 0 1 8 14 Z" fill={c} />
        </>
      )}
      {level === 'contested' && (
        <>
          <path d="M8 1.5 L14.5 8 L8 14.5 L1.5 8 Z" fill="none" stroke={c} strokeWidth="1.5" />
          <path d="M4.5 4.5 L11.5 11.5 M11.5 4.5 L4.5 11.5" stroke={c} strokeWidth="1.5" />
        </>
      )}
      {level === 'speculative' && <circle cx="8" cy="8" r="6" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2.2" />}
    </svg>
  );
}

export function CertaintyBadge({ level }: { level: Certainty }) {
  return (
    <span className={`cert-badge cert-${level}`} title={CERTAINTY_HELP[level]}>
      <CertaintyGlyph level={level} />
      {CERTAINTY_LABEL[level]}
    </span>
  );
}

export function CertaintyKey() {
  return (
    <dl className="cert-key">
      {(Object.keys(CERTAINTY_LABEL) as Certainty[]).map((k) => (
        <div key={k}>
          <dt>
            <CertaintyGlyph level={k} /> {CERTAINTY_LABEL[k]}
          </dt>
          <dd>{CERTAINTY_HELP[k]}</dd>
        </div>
      ))}
    </dl>
  );
}
