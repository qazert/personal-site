/**
 * Generates the placeholder plates that sit in every image slot on the site.
 *
 * These are NOT artwork. They exist so layout, aspect ratios and loading
 * behaviour are real while the actual project imagery is missing. Replace the
 * files in /public with real exports at the same paths and dimensions.
 *
 *   node scripts/gen-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public");

/* Deterministic PRNG so re-running the script does not churn the git diff. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Brand-family palettes. These are graphite-and-paper plates. The accent is a
   trace at the edge of perception, never a coloured field. */
const PALETTES = {
  graphite: { a: "#2a2a2e", b: "#0e0e10", glow: "#5b23ff", glowOpacity: 0.08 },
  ink: { a: "#1c1c20", b: "#0b0b0c", glow: "#5b23ff", glowOpacity: 0.05 },
  paper: { a: "#f2f2f3", b: "#a9a9b0", glow: "#5b23ff", glowOpacity: 0.05 },
  bone: { a: "#e6e6e8", b: "#94949c", glow: "#5b23ff", glowOpacity: 0.04 },
  slate: { a: "#3a3a42", b: "#131316", glow: "#5b23ff", glowOpacity: 0.1 },
};

function plateSvg({ w, h, palette, seed }) {
  const p = PALETTES[palette];
  const r = rng(seed);
  const angle = 20 + r() * 50;
  const gx = 12 + r() * 60;
  const gy = 8 + r() * 50;
  const gr = 55 + r() * 35;
  const bx = 40 + r() * 55;
  const by = 45 + r() * 50;

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="base" gradientTransform="rotate(${angle.toFixed(2)} 0.5 0.5)">
      <stop offset="0%" stop-color="${p.a}"/>
      <stop offset="100%" stop-color="${p.b}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${gx.toFixed(2)}%" cy="${gy.toFixed(2)}%" r="${gr.toFixed(2)}%">
      <stop offset="0%" stop-color="${p.glow}" stop-opacity="${p.glowOpacity}"/>
      <stop offset="100%" stop-color="${p.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lift" cx="${bx.toFixed(2)}%" cy="${by.toFixed(2)}%" r="58%">
      <stop offset="0%" stop-color="${p.a}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${p.a}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="46%" r="76%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#base)"/>
  <rect width="${w}" height="${h}" fill="url(#lift)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
</svg>`);
}

/* Film grain, composited in overlay so the plates do not band on wide gradients. */
async function grain(w, h, seed, strength) {
  const r = rng(seed ^ 0x9e3779b9);
  const sw = Math.ceil(w / 2);
  const sh = Math.ceil(h / 2);
  const buf = Buffer.alloc(sw * sh);
  for (let i = 0; i < buf.length; i++) {
    buf[i] = 128 + Math.round((r() - 0.5) * 255 * strength);
  }
  return sharp(buf, { raw: { width: sw, height: sh, channels: 1 } })
    .resize(w, h, { kernel: "cubic" })
    .toColourspace("b-w")
    .png()
    .toBuffer();
}

async function plate({ file, w, h, palette, strength = 0.17 }) {
  const seed = hashSeed(file);
  const abs = path.join(OUT, file);
  await mkdir(path.dirname(abs), { recursive: true });

  const base = await sharp(plateSvg({ w, h, palette, seed }))
    .png()
    .toBuffer();
  const noise = await grain(w, h, seed, strength);

  await sharp(base)
    .composite([{ input: noise, blend: "overlay" }])
    .jpeg({ quality: 84, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(abs);

  console.log(`  ${file}  ${w}x${h}`);
}

const jobs = [
  // Home
  { file: "home/hero.jpg", w: 1600, h: 1400, palette: "graphite" },
  { file: "home/system.jpg", w: 1400, h: 1000, palette: "slate" },
  { file: "home/craft.jpg", w: 1200, h: 900, palette: "bone" },

  // Work covers, 16:10
  { file: "work/ledgerline-cover.jpg", w: 1760, h: 1100, palette: "graphite" },
  { file: "work/northbeam-cover.jpg", w: 1760, h: 1100, palette: "bone" },
  { file: "work/atlas-cover.jpg", w: 1760, h: 1100, palette: "slate" },
  { file: "work/cadence-cover.jpg", w: 1760, h: 1100, palette: "ink" },

  // Work galleries, 3:2
  { file: "work/ledgerline-01.jpg", w: 1680, h: 1120, palette: "ink" },
  { file: "work/ledgerline-02.jpg", w: 1680, h: 1120, palette: "paper" },
  { file: "work/northbeam-01.jpg", w: 1680, h: 1120, palette: "paper" },
  { file: "work/northbeam-02.jpg", w: 1680, h: 1120, palette: "graphite" },
  { file: "work/atlas-01.jpg", w: 1680, h: 1120, palette: "ink" },
  { file: "work/atlas-02.jpg", w: 1680, h: 1120, palette: "slate" },
  { file: "work/cadence-01.jpg", w: 1680, h: 1120, palette: "bone" },
  { file: "work/cadence-02.jpg", w: 1680, h: 1120, palette: "graphite" },

  // About, 4:5 portrait
  { file: "about/portrait.jpg", w: 1200, h: 1500, palette: "ink", strength: 0.2 },

  // Social card
  { file: "og.jpg", w: 1200, h: 630, palette: "graphite" },
];

console.log("Generating placeholder plates into /public");
for (const job of jobs) {
  await plate(job);
}
console.log(`Done. ${jobs.length} files. Replace these with real imagery.`);
