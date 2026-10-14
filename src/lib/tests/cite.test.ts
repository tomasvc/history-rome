import { describe, expect, it } from 'vitest';
import { authorDate, bibliographyEntry, shortNote } from '../cite';
import type { BibEntry } from '../../types';

const book = { id: 'syme-1939', type: 'monograph', authors: ['Syme, Ronald'], title: 'The Roman Revolution', place: 'Oxford', publisher: 'Clarendon Press', year: '1939', level: 'advanced', topics: [], note: '' } as unknown as BibEntry;
const article = { id: 'sf', type: 'article', authors: ['Scheidel, Walter', 'Friesen, Steven J.'], title: 'The Size of the Economy', container: 'Journal of Roman Studies', volume: '99', year: '2009', pages: '61–91', level: 'advanced', topics: [], note: '' } as unknown as BibEntry;
const many = { ...article, id: 'm', authors: ['McConnell, Joseph R.', 'et al.'], title: 'Extreme Climate', container: 'PNAS', volume: '117', year: '2020', pages: '15443–49' } as unknown as BibEntry;

describe('Chicago citations', () => {
  it('formats a monograph', () => {
    expect(bibliographyEntry(book)).toBe('Syme, Ronald. *The Roman Revolution*. Oxford: Clarendon Press, 1939.');
  });
  it('formats a co-authored article with the second author in natural order', () => {
    expect(bibliographyEntry(article)).toBe('Scheidel, Walter, and Steven J. Friesen. “The Size of the Economy.” *Journal of Roman Studies* 99 (2009): 61–91.');
  });
  it('handles et al.', () => {
    expect(bibliographyEntry(many)).toMatch(/^McConnell, Joseph R\., et al\. /);
    expect(authorDate(many)).toBe('McConnell et al. 2020');
  });
  it('puts commas inside quotation marks in short notes', () => {
    expect(shortNote(article, '75')).toBe('Scheidel and Friesen, “Size of the Economy,” 75.');
    expect(shortNote(book, '12')).toBe('Syme, *The Roman Revolution*, 12.');
  });
});
