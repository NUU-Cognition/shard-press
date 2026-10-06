# Press

Render a Mesh markdown artifact into a branded, print-ready A4 HTML document and PDF.

Press is a renderer, not an artifact manager. It owns no Mesh type, changes no source file, and writes only to `Exports/`.

```
markdown artifact  ──►  design tokens  ──►  A4 HTML  ──►  PDF
   (Mesh/)            (optional design      (Exports/)     (Exports/)
                       file, else default)
```

## Usage

Run the workflow:

```
[[wkfl-press-render_document]]
```

It resolves the source and design, builds the HTML, pauses for review, then cuts and verifies the PDF.

To re-render an HTML that already exists:

```bash
flint shard press render-pdf "Exports/Doc.html" "Exports/Doc.pdf" --raster /tmp/proof
```

## Design input is optional

Pass a design file — a brand guideline page, a style note — and its palette, typeface and treatment drive the document. Omit it and Press uses a deliberately quiet neutral default. It never invents a palette.

## Structure

| Path | Purpose |
|------|---------|
| `init-press.md` | Shard context |
| `setup-press.md` | Per-machine setup: Chromium + Poppler |
| `skills/sk-press-derive_design.md` | Design file → CSS tokens |
| `skills/sk-press-build_html.md` | Markdown → A4 HTML |
| `skills/sk-press-render_pdf.md` | HTML → PDF, then verify |
| `workflows/wkfl-press-render_document.md` | The three-stage pipeline |
| `templates/tmp-press-document-v0.1.md` | A4 document structure |
| `knowledge/knw-press-print.md` | Print mechanics and the verification loop |
| `knowledge/knw-press-design.md` | Design file contract and the neutral default |
| `scripts/render-pdf.js` | `flint shard press render-pdf` |

## Requirements

A Chromium-family browser and the Poppler utilities (`pdfinfo`, `pdftoppm`), both per-machine. See `setup-press.md`.
