---
description: "Print and PDF mechanics — A4 page setup, pagination control, typography, diagrams, and the verification loop"
---

# Knowledge: Print Mechanics

Everything about making an HTML file behave as a paper document. Screen HTML forgives; paper does not — there is no scrolling, and a break in the wrong place is permanent.

## Page Setup

A4 is 210 x 297mm, which is **595.28 x 841.89 pts**. Chrome emits 594.96 x 841.92 — within rounding, still A4. Verify against a tolerance, never an exact match.

```css
@page { size: A4; margin: 22mm 20mm 24mm; }
```

Margins of 20-25mm read as a document; below 15mm it reads as a leaflet. The slightly deeper bottom margin is deliberate — a page looks unbalanced when the text block sits optically centred, because the eye reads the centre as higher than it is.

Content width is `210mm - left - right`. At 20mm sides that is 170mm, which sets every internal measurement: table widths, diagram viewBox scaling, where a line of type wraps.

### Screen preview that tells the truth

Give the on-screen wrapper the full page width and the same margins as padding, then strip both in print. A preview showing only the text column hides exactly the errors you are looking for.

```css
.sheet { width: 210mm; padding: 22mm 20mm 24mm; margin: 10mm auto; background: #fff; }
@media print { .sheet { width: auto; margin: 0; padding: 0; box-shadow: none; } }
```

## Pagination Control

| Need | Property | Apply to |
|------|----------|----------|
| Never split this block | `break-inside: avoid` | figures, cards, tables, callouts |
| Heading must not end a page | `break-after: avoid` | `h1`-`h4` |
| Start a new page here | `break-before: page` | a `.page-break` utility class |

Ship `break-before: page` as a **class**, not baked into a selector. Which section starts a page is an editorial decision that changes per document.

```css
@media print { .page-break { break-before: page; margin-top: 0; } }
```

**`break-inside: avoid` costs whitespace.** A block that cannot fit in the remaining space moves whole to the next page and leaves a gap. That is the correct trade for a card or a diagram, and the wrong one for a long prose section. A block taller than one page ignores the rule entirely and splits anyway — the fix there is less content or smaller type, not more CSS.

**Orphaned headings are the most common fault.** A heading plus one list item at the foot of a page, with the rest overleaf, means either `break-after: avoid` did not reach it or the whole section wants `.page-break`.

## Typography

Set every size in `pt` for print. Body copy at **10-11pt** is right for A4; below 9pt reads as fine print.

Scaling the document means scaling *every* size by one factor — headings, tables, captions, diagram labels — or the proportions break. Diagram text lives in unitless SVG `font-size` attributes and does **not** move with the CSS, so it must be scaled in the same pass or the diagrams end up visibly undersized against the body.

### Justification

```css
p, li { text-align: justify; hyphens: auto; }
h1, h2, h3, figcaption, th, td { text-align: left; hyphens: none; }
```

Justify without hyphenation and a narrow column opens rivers of white space between words. `hyphens: auto` needs a `lang` attribute on `<html>` to pick a dictionary. Never justify headings, table cells or captions.

## Fonts

A webfont from a CDN needs **network access at PDF-generation time**. Chrome then embeds and subsets the face into the PDF, so the finished file renders anywhere — but a render on a disconnected machine silently falls back. Always ship a real fallback stack, and embed the font as base64 when the pipeline must run offline.

Confirm embedding with `pdffonts`. Chrome labels its subsets oddly — a Type 3 entry named for one weight is a naming quirk, not a weight problem; judge weights from the raster.

## Diagrams

**Convert mermaid to hand-authored inline SVG.** Two reasons: a PDF pipeline has no dependable JS runtime, and a diagramming library paints in its own palette, ignoring the document's design.

| Concern | Rule |
|---------|------|
| Edge clipping | Pad the viewBox: `viewBox="-4 -4 <w+8> <h+8>"`. A box stroke at `x = width` is half outside the canvas and renders clipped. |
| Scaling | `svg { width: 100%; height: auto; }` and let the viewBox do the work. |
| Many-to-one edges | Where several nodes feed one node, draw a collector bus — one horizontal line they drop into — instead of a fan of crossing lines. |
| Wrapped titles | A title spanning two lines must keep **both** lines in the bold group. Dropping the second line into the subtitle group turns "Short rationale bullets" into a title plus a grey subtitle that reads as a typo. |
| Contrast | Fill terminal nodes with the darkest brand colour and reverse the text; use the accent for the one node the diagram is about. |

Verify a diagram by rasterising at high DPI (150+) and cropping to it. Clipping and overlap are invisible at page scale.

## Tables

Long URLs destroy a table on a fixed-width page. Use a short anchor label and keep the URL in the `href` — clickable in the PDF, no overflow. Note the trade: a printed copy loses the destination.

Give columns explicit widths. Auto-layout distributes on content and will hand a runaway column to the longest cell.

## Verification

**Generating a PDF is not verifying one.** The loop:

```bash
flint shard press render-pdf <html> <pdf> --raster <dir>
```

The script reports engine, page count, page size and A4 conformance, and writes one PNG per page. Then **read the images** — this is the step that matters. `pdfinfo` proves the geometry; only the raster shows the layout.

What the raster catches and the numbers never do:

- A diagram box clipped at the viewBox edge
- A heading orphaned at the foot of a page
- Two rules stacking into an accidental double line where a card border meets a section rule
- A table cell overflowing its column
- A block that fell to the next page and left a quarter-page gap
- Text that reflowed into the wrong pagination after a font-size change

Re-verify after **every** change. A fix in one place moves everything after it.

## Chromium Invocation

```bash
chromium --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf=out.pdf "file:///absolute/path/to/doc.html"
```

`--no-pdf-header-footer` suppresses the default date/URL furniture. The URL must be absolute and percent-encoded — workspace paths containing spaces and parentheses break otherwise. `[[dev-render-pdf]]` handles the encoding, the browser search and the verification; prefer it to a raw command.
