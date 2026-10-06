---
description: "Render a document HTML to PDF and verify the result page by page"
---

> [!important] THIS FILE IS AN INSTRUCTION. WHEN REFERENCED IT IS MEANT TO BE TAKEN AS AN ACTION.

Run `flint shard start press` if you haven't already.

# Skill: Render PDF

Convert a document HTML to PDF and confirm it is correct — not merely that it was produced.

# Input

- Path to the document HTML, normally `Exports/<name>.html`
- (Optional) Output PDF path; defaults to the same stem with a `.pdf` extension

# Actions

1. **Render and rasterise** in one command:

   ```bash
   flint shard press render-pdf "Exports/<name>.html" "Exports/<name>.pdf" --raster <scratch-dir>
   ```

   The script resolves the browser, encodes the file URL, applies the Chromium flags, and reports engine, page count, page size and A4 conformance as JSON.

2. **Check the JSON.** `isA4` must be `true`. If `verified` is `false`, Poppler is missing — install it per [[dev-setup-press]] rather than accepting an unverified render. A non-zero exit means the page size is wrong; fix `@page` in the HTML.

3. **Read every rasterised page.** This is the step that matters and the one most often skipped. Look for the faults listed in [[dev-knw-press-print]] § Verification: clipped diagram edges, orphaned headings, doubled rules, overflowing cells, large gaps left by an unsplittable block.

4. **Inspect diagrams closely.** Re-rasterise at 150 DPI or higher and crop to each figure. Clipping and label overlap are invisible at page scale.

5. **Fix in the HTML, never the PDF**, then regenerate and re-verify from step 1. A fix reflows everything after it, so a clean page can become a broken one.

6. **Report** page count, page size, and what you checked. If a layout compromise remains — a deliberate whitespace gap from `break-inside: avoid`, for example — state it rather than leaving it to be discovered.

# Output

- `Exports/<name>.pdf`, verified A4
- A statement of page count and what the page-by-page check found
