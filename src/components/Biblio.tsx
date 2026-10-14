import { Link } from 'react-router-dom';
import { bibById } from '../data';
import { addsToTitle, bibliographyEntry, normTitle } from '../lib/cite';
import type { ReadingRef } from '../types';
import { Em } from './Markup';

export function VerifyMark({ id }: { id: string }) {
  const b = bibById.get(id);
  if (!b) return null;
  return b.verified === 'catalogue' ? (
    <>
      <span className="verify verified" title={b.verifiedNote ?? 'Details checked against a publisher or library catalogue'}>
        checked
      </span>
      {b.pagesUnchecked && (
        <span className="verify unverified" title="The page range could not be confirmed against a catalogue. Check it before citing pages.">
          pages unconfirmed
        </span>
      )}
    </>
  ) : (
    <span className="verify unverified" title="Bibliographic details not yet checked against a catalogue. Verify before citing.">
      to verify
    </span>
  );
}

const LEVEL: Record<string, string> = { introductory: 'Start here', intermediate: 'Core reading', advanced: 'Advanced' };


export function ReadingList({ refs, showLevel = true }: { refs: (ReadingRef | string)[]; showLevel?: boolean }) {
  const items = refs.map((r) => (typeof r === 'string' ? { ref: r } : r));
  return (
    <ul className="reading-list">
      {items.map((r) => {
        const b = bibById.get(r.ref);
        if (!b) return (
          <li key={r.ref} className="missing">
            Missing reference: {r.ref}
          </li>
        );
        return (
          <li key={r.ref}>
            <div className="reading-cite">
              <Em text={bibliographyEntry(b)} />
              {r.loc && <span className="reading-loc"> {r.loc}.</span>}
            </div>
            <div className="reading-meta ui">
              {showLevel && <span className={`level level-${b.level}`}>{LEVEL[b.level]}</span>}
              {b.type === 'primary' || b.type === 'sourcebook' ? <span className="kind-tag">Ancient source in translation</span> : null}
              <VerifyMark id={b.id} />
              <Link to={`/library#${b.id}`}>Library entry</Link>
            </div>
            {b.note && <p className="reading-note">{b.note}</p>}
            {r.note && addsToTitle(r.note, b.title) && normTitle(r.note) !== normTitle(b.note ?? '') && (
              <p className="reading-why">
                <span className="ui">For this lesson:</span> {r.note}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
