// Builds the atlas TopoJSON from AWMC (ODbL) and historical-basemaps (GPL-3.0) sources.
// Usage: node scripts/build-geo.mjs <awmcDir> <historicalBasemapsDir>
import fs from 'node:fs';
import path from 'node:path';
import mapshaper from 'mapshaper';

const [awmc, hb] = process.argv.slice(2);
const BBOX = '-12,14,52,58';
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const fc = (features) => ({ type: 'FeatureCollection', features });

function hbPick(year, test, label) {
  const d = read(path.join(hb, `geojson/world_${year}.geojson`));
  return fc(
    d.features
      .filter((f) => test(f.properties))
      .map((f) => ({ ...f, properties: { name: f.properties.NAME, role: label(f.properties) } })),
  );
}
const isRomanCore = (p) => ['Roman Empire', 'Roman Republic', 'Rome', 'Eastern Roman Empire', 'Byzantine Empire'].includes(p.NAME);

const inputs = {};
const cmds = [];
function add(name, geojson, extra = '') {
  inputs[`${name}.json`] = geojson;
  cmds.push(`-i ${name}.json name=${name} -clip bbox=${BBOX} ${extra}`);
}

// Base land (Natural Earth via world-atlas, public domain)
const topojsonLand = read('node_modules/world-atlas/land-50m.json');
inputs['land.json'] = topojsonLand;
cmds.push(`-i land.json name=land -clip bbox=${BBOX} -simplify 35% keep-shapes`);

// AWMC extents
for (const [name, file] of [
  ['ext_m60', 'roman_empire_bce_60/roman_empire_bce_60.geojson'],
  ['ext_117', 'roman_empire_ce_117_extent/roman_empire_ce_117_extent.geojson'],
  ['ext_200', 'roman_empire_ce_200_extent/roman_empire_ce_200_extent.geojson'],
]) {
  const g = read(path.join(awmc, 'Cultural-Data/political_shading', file));
  g.features.forEach((f) => (f.properties = { name: 'Roman territory', role: 'core' }));
  add(name, g, '-dissolve2 role copy-fields=name -simplify 12% keep-shapes');
}
for (const [name, file] of [
  ['prov_200', 'roman_empire_ce_200_provinces/roman_empire_ce_200_provinces.geojson'],
  ['prov_late', 'roman_empire_provinces post_diocletian/roman_empire_provinces post_diocletian.geojson'],
]) {
  const g = read(path.join(awmc, 'Cultural-Data/political_shading', file));
  g.features.forEach((f) => (f.properties = {}));
  add(name, g, '-simplify 15%');
}
// Roads: AWMC major roads only
{
  const g = read(path.join(awmc, 'Cultural-Data/roads/roads.geojson'));
  g.features = g.features
    .filter((f) => f.geometry && String(f.properties.Major_or_M) === '1')
    .map((f) => {
      let n = f.properties.en_name || f.properties.Name || '';
      n = String(n).replace(/_/g, ' ').replace(/\?$/, '').trim();
      if (!/^Via |^Strata |^Hodos /i.test(n)) n = '';
      return { ...f, properties: n ? { name: n } : {} };
    });
  add('roads', g, '-simplify 8%');
}
// Walls: label by location
{
  const g = read(path.join(awmc, 'Cultural-Data/walls/walls.geojson'));
  const label = (lon, lat) => {
    if (lat > 55.6 && lon < -3) return 'Antonine Wall';
    if (lat > 54.6 && lat < 55.3 && lon > -3.6 && lon < -1.4) return "Hadrian's Wall";
    if (lat > 48.5 && lat < 51 && lon > 6 && lon < 12) return 'Upper German–Raetian limes';
    if (lat > 31 && lat < 36.5 && lon > 4.5 && lon < 13) return 'Fossatum Africae';
    return null;
  };
  g.features = g.features
    .filter((f) => f.geometry)
    .map((f) => {
      const pts = f.geometry.coordinates.flat();
      const lon = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const lat = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      return { ...f, properties: { name: label(lon, lat) } };
    })
    .filter((f) => f.properties.name);
  add('walls', g, '');
}
// historical-basemaps snapshots
const snap = [
  ['hb_m200', 'bc200', (p) => p.NAME === 'Rome', () => 'core'],
  ['hb_m100', 'bc100', (p) => p.NAME === 'Roman Republic', () => 'core'],
  ['hb_1', 'bc1', (p) => p.SUBJECTO === 'Roman Empire', (p) => (p.NAME === 'Roman Empire' ? 'core' : 'client')],
  ['hb_300', '300', (p) => /^Rome \(/.test(p.NAME), (p) => p.NAME.replace(/^Rome \((.*)\)$/, '$1')],
  ['hb_400', '400', (p) => /Roman Empire/.test(p.NAME), (p) => (/Western/.test(p.NAME) ? 'west' : 'east')],
  ['hb_500', '500', (p) => /Roman Empire/.test(p.NAME), (p) => (/Western/.test(p.NAME) ? 'west' : 'east')],
  ['hb_600', '600', (p) => p.NAME === 'Eastern Roman Empire', () => 'east'],
  ['hb_700', '700', (p) => p.NAME === 'Eastern Roman Empire', () => 'east'],
  ['hb_900', '900', (p) => p.NAME === 'Byzantine Empire', () => 'east'],
  ['hb_1000', '1000', (p) => p.NAME === 'Byzantine Empire', () => 'east'],
  ['hb_1100', '1100', (p) => p.NAME === 'Byzantine Empire', () => 'east'],
  ['hb_1200', '1200', (p) => p.NAME === 'Byzantine Empire', () => 'east'],
  ['hb_1300', '1300', (p) => p.NAME === 'Byzantine Empire' || p.NAME === 'Trebizond', (p) => (p.NAME === 'Trebizond' ? 'successor' : 'east')],
  ['hb_1400', '1400', (p) => p.NAME === 'Byzantine Empire' || p.NAME === 'Trebizond', (p) => (p.NAME === 'Trebizond' ? 'successor' : 'east')],
];
for (const [name, year, test, role] of snap) add(name, hbPick(year, test, role), '-simplify 30% keep-shapes');

const names = ['land', 'ext_m60', 'ext_117', 'ext_200', 'prov_200', 'prov_late', 'roads', 'walls', ...snap.map((s) => s[0])];
cmds.push(`-o format=topojson target=${names.join(',')} quantization=20000 out.json`);
const out = await mapshaper.applyCommands(cmds.join(' '), inputs);
const json = out['out.json'];
fs.writeFileSync('src/geo/atlas.topo.json', json);
console.log('atlas.topo.json', (json.length / 1024).toFixed(0), 'KB');
const topo = JSON.parse(json);
for (const [k, v] of Object.entries(topo.objects)) console.log(k, v.geometries.length, [...new Set(v.geometries.map((g) => g.properties?.role || g.properties?.name).filter(Boolean))].slice(0, 8).join(' | '));
