import react from '@vitejs/plugin-react';
import { load as yamlLoad } from 'js-yaml';
import { defineConfig, type Plugin } from 'vite';

/**
 * Content pipeline: YAML files become JS objects, and lesson Markdown files
 * (YAML front matter + body) become { ...meta, body } at build time.
 */
/**
 * Everything the rest of the app needs to know about a lesson body without loading it:
 * size, inline cross-references, cited readings and section headings (for search).
 */
function digest(body: string) {
  const words = body.replace(/^:::.*$/gm, ' ').split(/\s+/).filter(Boolean).length;
  const count = (re: RegExp) => (body.match(re) ?? []).length;
  const mentions: Record<string, string[]> = {};
  for (const [, kind, id] of body.matchAll(/\[\[(fig|evt|src|term|place|debate|lesson|scenario|compare):([a-z0-9-]+)/g)) {
    mentions[kind] = [...new Set([...(mentions[kind] ?? []), id])];
  }
  for (const [, kind, id] of body.matchAll(/^:::(source|debate) ([a-z0-9-]+)/gm)) {
    const k = kind === 'source' ? 'src' : 'debate';
    mentions[k] = [...new Set([...(mentions[k] ?? []), id])];
  }
  const refs = [...new Set([...body.matchAll(/\{\{ref:([a-z0-9-]+)/g)].map((x) => x[1]))];
  const headings = [...body.matchAll(/^##+ (.+?)(?: \{#[^}]+\})?$/gm)].map((x) => x[1]);
  const sections = [...body.matchAll(/^## (.+?) \{#([a-z0-9-]+)\}$/gm)].map((x) => ({ id: x[2], title: x[1] }));
  return { stats: { words, sources: count(/^:::source /gm), diagrams: count(/^:::diagram /gm) }, mentions, refs, headings, sections };
}

function content(): Plugin {
  return {
    name: 'tabularium-content',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (file.endsWith('.yaml')) {
        try {
          const data = yamlLoad(code, { filename: file });
          return { code: `export default ${JSON.stringify(data)};`, map: null };
        } catch (e) {
          this.error(`YAML error in ${file}: ${(e as Error).message}`);
        }
      }
      if (file.endsWith('.md') && file.includes('/content/')) {
        const m = code.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (!m) this.error(`Missing front matter in ${file}`);
        const body = m![2];
        // `?body` imports carry only the lesson text, so that it can be loaded on demand.
        if (id.includes('?body')) return { code: `export default ${JSON.stringify(body)};`, map: null };
        try {
          const meta = yamlLoad(m![1], { filename: file }) as Record<string, unknown>;
          return { code: `export default ${JSON.stringify({ ...meta, ...digest(body) })};`, map: null };
        } catch (e) {
          this.error(`Front matter error in ${file}: ${(e as Error).message}`);
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [content(), react()],
  build: { chunkSizeWarningLimit: 2500 },
});
