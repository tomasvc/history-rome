import { useState } from 'react';
import { imageById } from '../data';

const commonsUrl = (file: string, width: number) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, '_'))}?width=${width}`;
export const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`;

const KIND: Record<string, string> = {
  artifact: 'Object',
  site: 'Site photograph',
  reconstruction: 'Modern reconstruction',
  manuscript: 'Manuscript',
  coin: 'Coin',
  portrait: 'Portrait',
};

/**
 * Museum and site photographs are loaded from Wikimedia Commons (with credits).
 * If the image cannot load (offline, blocked), the caption and provenance still render.
 */
export function MuseumImage({ id, width = 900, compact = false }: { id: string; width?: number; compact?: boolean }) {
  const img = imageById.get(id);
  const [failed, setFailed] = useState(false);
  if (!img) return null;
  return (
    <figure className={`museum ${compact ? 'compact' : ''}`}>
      <div className="museum-frame">
        {!failed ? (
          <img src={commonsUrl(img.file, width)} alt={img.title} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        ) : (
          <div className="museum-missing ui">
            <span>Image not available offline.</span>
            <a href={commonsPage(img.file)} target="_blank" rel="noreferrer">
              View on Wikimedia Commons
            </a>
          </div>
        )}
      </div>
      <figcaption>
        <span className="museum-kind ui">{KIND[img.kind]}</span>
        <span className="museum-title">{img.title}</span>
        <span className="museum-meta">
          {img.object}. {img.date}
          {img.holding ? `. ${img.holding}` : ''}.
        </span>
        {img.caveat && <span className="museum-caveat">{img.caveat}</span>}
        {!compact && (
          <span className="museum-credit ui">
            Photo: {img.credit}, {img.license},{' '}
            <a href={commonsPage(img.file)} target="_blank" rel="noreferrer">
              Wikimedia Commons
            </a>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
