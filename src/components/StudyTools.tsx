import { useEffect, useState } from 'react';
import { refKey, saveNote, toggleBookmark, useStudy, type Ref } from '../lib/store';

export function BookmarkButton({ refItem }: { refItem: Ref }) {
  const on = useStudy((s) => Boolean(s.bookmarks[refKey(refItem.kind, refItem.id)]));
  return (
    <button className="btn small" aria-pressed={on} onClick={() => toggleBookmark(refItem)} title={on ? 'Remove bookmark' : 'Bookmark this page'}>
      <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
        <path d="M1 1h10v12l-5-3.5L1 13z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3" />
      </svg>
      {on ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}

/** A per-page notebook. Saves as you type (debounced). */
export function NoteBox({ refItem, prompt }: { refItem: Ref; prompt?: string }) {
  const saved = useStudy((s) => s.notes[refKey(refItem.kind, refItem.id)]);
  const [text, setText] = useState(saved?.text ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  useEffect(() => setText(saved?.text ?? ''), [refItem.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (text === (saved?.text ?? '')) return;
    setStatus('saving');
    const t = setTimeout(() => {
      saveNote(refItem, text);
      setStatus('saved');
    }, 600);
    return () => clearTimeout(t);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="notebox">
      <label className="field">
        <span>Your notes</span>
        <textarea rows={6} value={text} placeholder={prompt ?? 'Questions, connections, things to look up…'} onChange={(e) => setText(e.target.value)} />
      </label>
      <p className="ui small faint" aria-live="polite">
        {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved in this browser.' : saved ? `Last edited ${new Date(saved.at).toLocaleDateString('en-GB')}` : ''}
      </p>
    </div>
  );
}
