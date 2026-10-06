#!/usr/bin/env node
// Render an HTML file to PDF with headless Chromium, then verify the result.
// Invocation: flint shard press render-pdf <html> <pdf> [--raster <dir>] [--check]
// Outputs: one line of JSON — { ok, engine, pdf, pages, pageSize, isA4, verified, raster? }

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CANDIDATES = [
  'chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable',
  'brave-browser', 'microsoft-edge', 'microsoft-edge-stable',
];

// A4 in PostScript points, with a tolerance for Chrome's rounding (594.96 x 841.92).
const A4_W = 595.28;
const A4_H = 841.89;
const TOLERANCE = 1.5;

// Resolve a binary on PATH without a shell (no quoting hazards, no deprecation).
function which(bin) {
  if (bin.includes(path.sep)) return fs.existsSync(bin) ? bin : null;
  const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const dir of dirs) {
    const full = path.join(dir, bin);
    try {
      fs.accessSync(full, fs.constants.X_OK);
      return full;
    } catch {
      // not here; keep looking
    }
  }
  return null;
}

function findChrome() {
  if (process.env.PRESS_CHROME) return process.env.PRESS_CHROME;
  const stateFile = path.join(
    process.env.FLINT_ROOT || process.cwd(),
    'Shards/(Shards) Local State/(Shard) Press (Local).md'
  );
  if (fs.existsSync(stateFile)) {
    const m = fs.readFileSync(stateFile, 'utf8').match(/^chrome-path:\s*(.+)$/m);
    if (m && fs.existsSync(m[1].trim())) return m[1].trim();
  }
  for (const c of CANDIDATES) {
    const p = which(c);
    if (p) return p;
  }
  return null;
}

function fail(msg) {
  process.stderr.write(msg + '\n');
  process.exit(1);
}

function fileUrl(p) {
  return 'file://' + path.resolve(p).split(path.sep).map(encodeURIComponent).join('/');
}

function check() {
  const out = {
    chrome: findChrome(),
    pdfinfo: which('pdfinfo'),
    pdftoppm: which('pdftoppm'),
  };
  out.ok = Boolean(out.chrome && out.pdfinfo && out.pdftoppm);
  console.log(JSON.stringify(out));
  process.exit(out.ok ? 0 : 1);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--check')) return check();

  const positional = args.filter((a) => !a.startsWith('--'));
  const htmlPath = positional[0];
  const pdfPath = positional[1];
  if (!htmlPath || !pdfPath) fail('usage: render-pdf <html> <pdf> [--raster <dir>] [--check]');
  if (!fs.existsSync(htmlPath)) fail(`html not found: ${htmlPath}`);

  const chrome = findChrome();
  if (!chrome) fail('no Chromium-family browser found — see setup-press.md, or set PRESS_CHROME');

  fs.mkdirSync(path.dirname(path.resolve(pdfPath)), { recursive: true });

  const r = spawnSync(chrome, [
    '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
    `--print-to-pdf=${path.resolve(pdfPath)}`,
    fileUrl(htmlPath),
  ], { encoding: 'utf8', timeout: 120000 });

  if (r.error) fail(`chromium failed: ${r.error.message}`);
  if (!fs.existsSync(pdfPath)) fail(`chromium produced no file\n${r.stderr || ''}`);

  const result = {
    ok: true,
    engine: chrome,
    pdf: pdfPath,
    bytes: fs.statSync(pdfPath).size,
    pages: null,
    pageSize: null,
    isA4: null,
    verified: false,
  };

  if (which('pdfinfo')) {
    const info = spawnSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
    if (info.status === 0) {
      const pages = info.stdout.match(/^Pages:\s+(\d+)/m);
      const size = info.stdout.match(/^Page size:\s+([\d.]+) x ([\d.]+)/m);
      if (pages) result.pages = Number(pages[1]);
      if (size) {
        const w = Number(size[1]);
        const h = Number(size[2]);
        result.pageSize = `${w} x ${h} pts`;
        result.isA4 = Math.abs(w - A4_W) < TOLERANCE && Math.abs(h - A4_H) < TOLERANCE;
      }
      result.verified = true;
    }
  }

  const rasterIdx = args.indexOf('--raster');
  if (rasterIdx !== -1 && args[rasterIdx + 1] && which('pdftoppm')) {
    const dir = args[rasterIdx + 1];
    fs.mkdirSync(dir, { recursive: true });
    const rr = spawnSync('pdftoppm', ['-png', '-r', '96', pdfPath, path.join(dir, 'pg')], { encoding: 'utf8' });
    if (rr.status === 0) {
      result.raster = fs.readdirSync(dir).filter((f) => f.startsWith('pg') && f.endsWith('.png')).sort();
    }
  }

  console.log(JSON.stringify(result));
  if (result.isA4 === false) process.exit(2);
}

main();
