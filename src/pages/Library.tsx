import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { bibliography, lessonById, lessonsCitingBib } from '../data';
import { bibliographyEntry, shortNote } from '../lib/cite';
import { Em } from '../components/Markup';
import { VerifyMark } from '../components/Biblio';
import type { BibType } from '../types';
import './study.css';

const TYPE_LABEL: Record<BibType, string> = {
  primary: 'Ancient source in translation',
  sourcebook: 'Sourcebook',
  monograph: 'Monograph',
  edited: 'Edited volume',
  article: 'Journal article',
  chapter: 'Chapter',
  reference: 'Reference work',
  digital: 'Digital resource',
};
const plain = (s: string) => s.replace(/\*/g, '');

export default function LibraryPage() {
  const [type, setType] = useState<'all' | 'ancient' | 'modern' | 'reference'>('all');
  const [topic, setTopic] = useState('all');
  const [level, setLevel] = useState('all');
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState('');
  const loc = useLocation();
  const target = loc.hash.slice(1);
  useEffect(() => {
    if (target) setTimeout(() => document.getElementById(target)?.scrollIntoView({ block: 'center' }), 60);
  }, [target]);
  const topics = useMemo(() => [...new Set(bibliography.flatMap((b) => b.topics))].sort(), []);
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return bibliography
      .filter(
        (b) =>
          type === 'all' ||
          (type === 'ancient' ? b.type === 'primary' || b.type === 'sourcebook' : type === 'reference' ? b.type === 'reference' || b.type === 'digital' : !['primary', 'sourcebook', 'reference', 'digital'].includes(b.type)),
      )
      .filter((b) => topic === 'all' || b.topics.includes(topic))
      .filter((b) => level === 'all' || b.level === level)
      .filter((b) => !qq || `${b.title} ${(b.authors ?? []).join(' ')} ${(b.editors ?? []).join(' ')} ${b.note}`.toLowerCase().includes(qq))
      .sort((a, b) => ((a.authors ?? a.editors ?? [a.title])[0] ?? '').localeCompare((b.authors ?? b.editors ?? [b.title])[0] ?? '') || a.year.localeCompare(b.year));
  }, [type, topic, level, q]);
  const checked = bibliography.filter((b) => b.verified === 'catalogue').length;
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setCopied('');
    }
  };

  return (
    <div className="page library-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Bibliography</p>
          <h1>Library</h1>
          <p className="lede">
            Every work cited in the course, in Chicago notes-and-bibliography style, with a note on what it is good for and which lessons use it.
            Ancient sources in translation are listed separately from modern scholarship.
          </p>
          <p className="ui small library-verify">
            {checked} of {bibliography.length} entries were checked in October 2026 against publisher pages, library catalogues, journal archives or
            published reviews; the note under each entry says what it was checked against. Where a catalogue confirmed an article or chapter but not
            its page range, the entry is marked “pages unconfirmed”. Any entry marked “to verify” has not been checked yet.
          </p>
        </header>
        <div className="toolbar library-filters">
          <div className="group" role="group" aria-label="Type">
            {(
              [
                ['all', 'Everything'],
                ['ancient', 'Ancient sources'],
                ['modern', 'Modern scholarship'],
                ['reference', 'Reference and digital'],
              ] as const
            ).map(([k, l]) => (
              <button key={k} className="chip" aria-pressed={type === k} onClick={() => setType(k)}>
                {l}
              </button>
            ))}
          </div>
          <label className="group">
            <span className="group-label">Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="all">Any</option>
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="group">
            <span className="group-label">Level</span>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="all">Any</option>
              <option value="introductory">Start here</option>
              <option value="intermediate">Core reading</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Author, title or subject" aria-label="Search the library" />
          <span className="faint">{list.length} works</span>
        </div>
        <ol className="library-list">
          {list.map((b) => {
            const cites = lessonsCitingBib.get(b.id) ?? [];
            return (
              <li key={b.id} id={b.id} className={target === b.id ? 'target' : ''}>
                <p className="lib-cite">
                  <Em text={bibliographyEntry(b)} />
                </p>
                <p className="lib-note">{b.note}</p>
                <div className="lib-meta ui">
                  <span>{TYPE_LABEL[b.type]}</span>
                  <span className={`level level-${b.level}`}>{b.level === 'introductory' ? 'Start here' : b.level === 'intermediate' ? 'Core reading' : 'Advanced'}</span>
                  <VerifyMark id={b.id} />
                  <span>{b.topics.join(', ')}</span>
                  <button className="linklike" onClick={() => copy(plain(bibliographyEntry(b)), b.id + 'b')}>
                    {copied === b.id + 'b' ? 'Copied' : 'Copy bibliography entry'}
                  </button>
                  <button className="linklike" onClick={() => copy(plain(shortNote(b)), b.id + 'n')}>
                    {copied === b.id + 'n' ? 'Copied' : 'Copy short note'}
                  </button>
                </div>
                {b.verifiedNote && <p className="lib-vnote ui small">{b.verifiedNote}</p>}
                {cites.length > 0 && (
                  <p className="lib-cited ui small">
                    Cited in:{' '}
                    {cites.map((l, i) => (
                      <span key={l}>
                        {i > 0 && ', '}
                        <Link to={`/lesson/${l}`}>{lessonById.get(l)?.title}</Link>
                      </span>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
