import { Fragment, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { bibById, checkById, entityHref, eventById, figureById, formatLife, placeById, sourceById, termById, debateById, lessonById } from '../data';
import { formatDate } from '../lib/dates';
import { parseBlocks, parseInline, type Block, type Inline, type Note } from '../lib/markup';
import { shortNote } from '../lib/cite';
import type { Certainty } from '../types';
import { CertaintyBadge } from './Certainty';
import { KnowledgeCheck } from './KnowledgeCheck';
import { StemmaById } from './Stemma';
import { Diagram } from './diagrams';
import { MuseumImage } from './MuseumImage';
import { SourceCard, DebateTeaser, MiniChronology, PeopleRow } from './Embeds';

/** Renders italic markers (*x*) in short strings such as citations. */
export function Em({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith('*') && p.endsWith('*') && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

function preview(kind: string, id: string, anchor?: string): { title?: string; meta?: string; text?: string } {
  switch (kind) {
    case 'fig': {
      const f = figureById.get(id);
      return f ? { title: f.name, meta: formatLife(f), text: f.summary } : {};
    }
    case 'evt': {
      const e = eventById.get(id);
      return e ? { title: e.title, meta: formatDate(e.date), text: e.summary } : {};
    }
    case 'src': {
      const s = sourceById.get(id);
      return s ? { title: s.title, meta: `${s.kind} · ${formatDate(s.date)}`, text: s.tells } : {};
    }
    case 'place': {
      const p = placeById.get(id);
      return p ? { title: p.name, meta: p.modern ? `Modern ${p.modern}` : p.kind, text: p.summary } : {};
    }
    case 'debate': {
      const d = debateById.get(id);
      return d ? { title: d.title, meta: 'Debate', text: d.question } : {};
    }
    case 'lesson': {
      const l = lessonById.get(id);
      const sec = anchor ? l?.sections.find((x) => x.id === anchor) : undefined;
      return l ? { title: sec ? sec.title : l.title, meta: sec ? `Section of “${l.title}”` : 'Lesson', text: sec ? undefined : l.subtitle } : {};
    }
  }
  return {};
}

const stripMarkup = (s?: string) =>
  (s ?? '')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[[a-z]+:[a-z0-9-]+(?:#[a-z0-9-]+)?\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[[a-z]+:([a-z0-9-]+)(?:#[a-z0-9-]+)?\]\]/g, (_, x: string) => x.replace(/-/g, ' '))
    .replace(/\*/g, '');

export function EntityLink({ kind, id, anchor, label }: { kind: string; id: string; anchor?: string; label?: string }) {
  if (kind === 'term') return <TermRef id={id} label={label} />;
  const p = preview(kind, id, anchor);
  const text = label ?? p.title ?? id;
  if (!p.title) return <span className="xref missing" title={`Unresolved link: ${kind}:${id}`}>{text}</span>;
  const tip = `tip-${kind}-${id}`;
  return (
    <span className="xref-wrap">
      <Link to={entityHref(kind, id) + (anchor ? `#${anchor}` : '')} className={`xref xref-${kind}`} aria-describedby={tip}>
        {text}
      </Link>
      <span className="xref-tip" role="tooltip" id={tip}>
        <span className="xref-tip-title">{p.title}</span>
        {p.meta && <span className="xref-tip-meta">{p.meta}</span>}
        {p.text && <span className="xref-tip-text">{stripMarkup(p.text).slice(0, 240)}</span>}
      </span>
    </span>
  );
}

export function TermRef({ id, label }: { id: string; label?: string }) {
  const t = termById.get(id);
  if (!t) return <span className="xref missing">{label ?? id}</span>;
  const tip = `term-${id}`;
  return (
    <span className="xref-wrap">
      <Link to={`/glossary#${id}`} className="term" aria-describedby={tip}>
        {label ?? t.term}
      </Link>
      <span className="xref-tip" role="tooltip" id={tip}>
        <span className="xref-tip-title">
          {t.term}
          {t.lang && t.lang !== 'English' ? <span className="xref-tip-meta"> {t.lang}</span> : null}
        </span>
        {t.literal && <span className="xref-tip-meta">“{t.literal}”</span>}
        <span className="xref-tip-text">{stripMarkup(t.def)}</span>
      </span>
    </span>
  );
}

export function Inlines({ c, notesInline = false }: { c: Inline[]; notesInline?: boolean }) {
  return (
    <>
      {c.map((x, i) => {
        switch (x.t) {
          case 'text':
            return <Fragment key={i}>{x.v}</Fragment>;
          case 'em':
            return (
              <em key={i}>
                <Inlines c={x.c} notesInline={notesInline} />
              </em>
            );
          case 'strong':
            return (
              <strong key={i}>
                <Inlines c={x.c} notesInline={notesInline} />
              </strong>
            );
          case 'link':
            return <EntityLink key={i} kind={x.kind} id={x.id} anchor={x.anchor} label={x.label} />;
          case 'note':
            return notesInline ? (
              <span key={i} className="cite-inline">
                {' '}
                (<NoteBody note={x} />)
              </span>
            ) : (
              <sup key={i} className="nref" aria-describedby={`note-${x.n}`}>
                {x.n}
              </sup>
            );
        }
      })}
    </>
  );
}

export function NoteBody({ note }: { note: Note }) {
  if (note.kind === 'ref') {
    const b = note.id ? bibById.get(note.id) : undefined;
    if (!b) return <span className="missing">[reference {note.id} not found]</span>;
    return (
      <Link to={`/library#${b.id}`} className="note-ref">
        <Em text={shortNote(b, note.loc)} />
      </Link>
    );
  }
  if (note.kind === 'anc') return <span className="note-anc">{note.text}</span>;
  return <Inlines c={note.c ?? []} notesInline />;
}

function Sidenotes({ notes }: { notes: Note[] }) {
  if (!notes.length) return null;
  return (
    <aside className="sidenotes" aria-label="Notes">
      {notes.map((n) => (
        <p key={n.n} id={`note-${n.n}`} className={`sidenote sidenote-${n.kind}`}>
          <span className="sn-num">{n.n}</span>
          <span>
            <NoteBody note={n} />
          </span>
        </p>
      ))}
    </aside>
  );
}

export function Blocks({ blocks, notesInline = false }: { blocks: Block[]; notesInline?: boolean }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} notesInline={notesInline} />
      ))}
    </>
  );
}

function wrapNotes(node: ReactNode, notes: Note[], notesInline: boolean) {
  if (notesInline || !notes.length) return <div className="para">{node}</div>;
  return (
    <div className="para has-notes">
      {node}
      <Sidenotes notes={notes} />
    </div>
  );
}

function BlockView({ b, notesInline }: { b: Block; notesInline: boolean }) {
  switch (b.t) {
    case 'p':
      return wrapNotes(
        <p>
          <Inlines c={b.c} notesInline={notesInline} />
        </p>,
        b.notes,
        notesInline,
      );
    case 'h3':
      return (
        <h3 className="sub">
          <Inlines c={b.c} notesInline />
        </h3>
      );
    case 'ul':
    case 'ol': {
      const Tag = b.t;
      return wrapNotes(
        <Tag>
          {b.items.map((it, i) => (
            <li key={i}>
              <Inlines c={it} notesInline={notesInline} />
            </li>
          ))}
        </Tag>,
        b.notes,
        notesInline,
      );
    }
    case 'dir':
      return <Directive b={b} notesInline={notesInline} />;
  }
}

function Directive({ b, notesInline }: { b: Extract<Block, { t: 'dir' }>; notesInline: boolean }) {
  switch (b.name) {
    case 'claim': {
      const level = (b.arg || 'interpretation') as Certainty;
      return (
        <div className={`claim claim-${level}`}>
          <CertaintyBadge level={level} />
          <div className="claim-body">
            <Blocks blocks={b.blocks} notesInline={notesInline} />
          </div>
        </div>
      );
    }
    case 'aside':
      return (
        <aside className="aside-box">
          {b.arg && <h4>{b.arg}</h4>}
          <Blocks blocks={b.blocks} notesInline={notesInline} />
        </aside>
      );
    case 'quote':
      return (
        <figure className="quote">
          <blockquote>
            <Blocks blocks={b.blocks} notesInline />
          </blockquote>
          {b.arg && (
            <figcaption>
              <Em text={b.arg} />
            </figcaption>
          )}
        </figure>
      );
    case 'check': {
      const c = checkById.get(b.arg);
      return c ? <KnowledgeCheck check={c} /> : <p className="missing">Check “{b.arg}” not found.</p>;
    }
    case 'source':
      return <SourceCard id={b.arg} caption={b.blocks} />;
    case 'debate':
      return <DebateTeaser id={b.arg} />;
    case 'diagram':
      return <Diagram id={b.arg} />;
    case 'image':
      return <MuseumImage id={b.arg} />;
    case 'timeline':
      return <MiniChronology lines={b.lines} />;
    case 'stemma':
      return <StemmaById id={b.arg} />;
    case 'people':
      return <PeopleRow ids={b.lines.join(' ').split(/[\s,]+/).filter(Boolean)} />;
    default:
      return <Blocks blocks={b.blocks} notesInline={notesInline} />;
  }
}

/** Renders a markup string from YAML (bios, commentary). Notes appear inline as citations. */
export function Rich({ text, inline = false, className }: { text?: string; inline?: boolean; className?: string }) {
  const parsed = useMemo(() => (inline ? parseInline(text ?? '') : parseBlocks(text ?? '')), [text, inline]);
  if (!text) return null;
  if (inline) return <Inlines c={parsed as Inline[]} notesInline />;
  return (
    <div className={className ?? 'rich'}>
      <Blocks blocks={parsed as Block[]} notesInline />
    </div>
  );
}
