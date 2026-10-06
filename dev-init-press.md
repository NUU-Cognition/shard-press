---
required-reading:
  - "[[dev-knw-press-print]]"
  - "[[dev-knw-press-design]]"
---

# Press

Press turns a Mesh markdown artifact into a branded, print-ready A4 HTML document and then into a PDF. It is a renderer, not an artifact manager — it owns no Mesh type and changes no source file.

## The Pipeline

```
markdown artifact  ──►  design tokens  ──►  A4 HTML  ──►  PDF
   (Mesh/)            (optional design      (Exports/)     (Exports/)
                       file, else default)
```

Three properties define the shard:

| Property | Rule |
|----------|------|
| Source | Any markdown file under `Mesh/`. Read it fresh at render time — never render from memory of an earlier read. |
| Design | An **optional** design file supplies palette, typography and treatment. Absent one, the neutral default applies. |
| Output | `Exports/<Document Name>.html` and `Exports/<Document Name>.pdf`. Same stem for both. |

## The HTML Is The Source Of Truth

The PDF is a build artifact. Every correction — spacing, pagination, colour, a diagram fix — is made in the HTML and the PDF is regenerated. Never hand-edit a PDF, and never let the two drift.

## Verify By Looking

A PDF that "was generated" is not a PDF that is correct. Every render ends by rasterising pages to images and **actually reading them**. Page size and page count come from `pdfinfo`; layout faults — clipped diagram edges, orphaned headings, doubled rules, overflowing table cells — are only visible in the raster. See [[dev-knw-press-print]] § Verification.

## Diagrams Are Inline SVG

Mermaid fences in the source are converted to hand-authored inline SVG, not left for a client-side renderer. A PDF pipeline has no reliable JS runtime, and a library's default palette ignores the design. See [[dev-knw-press-print]] § Diagrams.

## Scripts

| Script | Command | Output |
|--------|---------|--------|
| Render PDF | `flint shard press render-pdf <html> <pdf>` | One-line JSON: engine, page count, page size, A4 conformance |

## Rules

- Read the source markdown at render time; the file may have changed since it was written.
- Reproduce source text **verbatim**. Press reformats; it does not rewrite, summarise, or fix wording.
- Preserve the author's own edits — if the source was edited after a previous render, the new render follows the source.
- Do not invent branding. With no design file, use the neutral default rather than guessing a palette.
- Regenerate the PDF after every HTML change, and re-verify.
