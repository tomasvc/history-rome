// Usage: node scripts/screenshots.mjs <outDir> <width> <route> [route...]
// Requires a running server at http://localhost:4173 (npm run build && npx vite preview --port 4173)
import { chromium } from 'playwright-core';
const [out, width, ...routes] = process.argv.slice(2);
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(width) < 700 ? 900 : 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|commons\.wikimedia/.test(m.text())) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
for (const r of routes) {
  const [route, mode] = r.split('@');
  await page.goto(`http://localhost:4173/#${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  if (mode === 'dark') await page.evaluate(() => (document.documentElement.dataset.theme = 'dark'));
  else await page.evaluate(() => delete document.documentElement.dataset.theme);
  const name = route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home';
  await page.screenshot({ path: `${out}/${name}${mode ? '_' + mode : ''}_${width}.png`, fullPage: mode === 'full' });
}
await browser.close();
console.log(errors.length ? 'ERRORS:\n' + [...new Set(errors)].join('\n') : 'no console errors');
