---
description: "A4 print document — page setup, design tokens, typographic scale, and component patterns"
---

# Naming and Placement

| | |
|---|---|
| Output path | `Exports/[Document Name].html` |
| Companion PDF | `Exports/[Document Name].pdf` — same stem, produced by [[dev-sk-press-render_pdf]] |
| Source | Any markdown artifact under `Mesh/` |

This template describes an A4 print document. It is a **structure to follow, not a file to copy** — emit only the components the source actually needs. A document with no diagrams needs no `figure` rules.

Token values below are placeholders. Replace them with tokens resolved per [[dev-knw-press-design]]; page and pagination mechanics are explained in [[dev-knw-press-print]].

# Body Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>[Document title — becomes the PDF title]</title>
/* Only when the design names a webfont. Always append a real fallback stack. */
<link href="https://fonts.googleapis.com/css2?family=[Family]:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --white:[ground hex]; --ink:[text hex]; --accent:[accent hex];
    --g1:[tint]; --g2:[rule]; --g4:[caption]; --g5:[secondary]; --g6:[muted body];
    --font:"[Family]",[fallback stack];
  }

  @page{ size:A4; margin:22mm 20mm 24mm; }

  *{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; background:var(--g1); }
  body{
    font-family:var(--font); font-size:10.4pt; line-height:1.5; color:var(--ink);
    font-variant-numeric:tabular-nums lining-nums;
  }

  /* Screen preview mirrors the real page; print strips the frame. */
  .sheet{ width:210mm; margin:10mm auto; padding:22mm 20mm 24mm;
          background:var(--white); box-shadow:0 2px 24px rgba(0,0,0,.13); }

  /* Masthead */
  .masthead{ border-top:3px solid var(--accent); padding-top:10px; margin-bottom:26px; }
  .eyebrow{ font-size:8pt; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
            color:var(--accent); margin:0 0 10px; }
  h1{ font-size:24.8pt; font-weight:800; letter-spacing:-.022em; line-height:1.1; margin:0 0 8px; }
  .dateline{ font-size:9.7pt; font-weight:600; color:var(--g5); margin:0; }

  /* Headings */
  h2{ font-size:14.5pt; font-weight:700; margin:30px 0 12px;
      padding-bottom:7px; border-bottom:1px solid var(--g2); break-after:avoid; }
  h3{ font-size:11.7pt; font-weight:700; margin:22px 0 9px; break-after:avoid; }

  /* Body — justified with hyphenation; headings and tabular data stay left */
  p{ margin:0 0 10px; }
  ul,ol{ margin:0 0 10px; padding-left:17px; }
  li{ margin-bottom:4px; }
  p,li{ text-align:justify; hyphens:auto; -webkit-hyphens:auto; }
  .eyebrow,.dateline,figcaption,thead th,tbody td{ text-align:left; hyphens:none; }

  /* Emphasis */
  mark{ background:[accent at ~20% alpha]; color:inherit; padding:.08em .16em;
        border-radius:2px; -webkit-box-decoration-break:clone; box-decoration-break:clone; }

  /* Tables — explicit widths; short link labels, full URL in href */
  table{ width:100%; border-collapse:collapse; margin:12px 0 16px; font-size:9.6pt; }
  thead th{ font-size:8pt; font-weight:800; letter-spacing:.11em; text-transform:uppercase;
            color:var(--g5); padding:0 10px 7px 0; border-bottom:1.5px solid var(--ink); }
  tbody td{ padding:7px 10px 7px 0; border-bottom:1px solid var(--g2); vertical-align:top; }
  a{ color:var(--accent); text-decoration:none; font-weight:600; }

  /* Diagrams — inline SVG, scaled by viewBox */
  figure{ margin:14px 0 18px; break-inside:avoid; }
  figure svg{ width:100%; height:auto; display:block; }
  figcaption{ font-size:8.4pt; font-weight:600; letter-spacing:.05em;
              text-transform:uppercase; color:var(--g4); margin-top:8px; }

  /* Repeated blocks — hairline separated, never a thick coloured side-bar */
  .block{ border-top:1px solid var(--g2); padding:11px 0 0; margin:0 0 13px; break-inside:avoid; }
  .section-label + .block{ border-top:none; padding-top:0; }

  /* Tinted panel for quoted or verbatim material */
  .panel{ background:var(--g1); border:1px solid var(--g2); border-radius:4px;
          padding:14px 16px; font-size:8.5pt; line-height:1.44; color:var(--g6); }

  @media print{
    html,body{ background:var(--white); }
    .sheet{ width:auto; margin:0; padding:0; box-shadow:none; }
    h2,h3{ break-after:avoid; }
    figure,table,.block,.panel{ break-inside:avoid; }
    .page-break{ break-before:page; margin-top:0; }
  }
</style>
</head>
<body>
<div class="sheet">

  <header class="masthead">
    <p class="eyebrow">[Document kind]</p>
    <h1>[Title]</h1>
    <p class="dateline">[Date]</p>
  </header>

  [Body — one section per source heading, in source order]
  /* Add class="page-break" to any h2 that should start a fresh page. */

</div>
</body>
</html>
```

## Component Reference

| Source construct | Renders as |
|------------------|-----------|
| `# Heading` | `.masthead` with eyebrow, `h1`, dateline |
| `## Heading` | `h2` with rule beneath |
| Paragraph / list | Justified `p` / `ul` |
| `==highlight==` | `<mark>` |
| Table | `table` with explicit column widths |
| ` ```mermaid ` fence | `figure` with hand-authored inline SVG + `figcaption` |
| Verbatim quoted block | `.panel` |
| Repeated labelled entries | `.block` under a `.section-label` |

## Design Guidelines

- **Emit only what the source needs.** Unused component CSS is noise.
- **Never inline a raw hex.** Every colour resolves through a token.
- **Scale proportionally.** Changing the document size means scaling every `pt` value *and* every SVG `font-size` by the same factor.
- **One `<mark>` colour.** Highlighting is binary; a second highlight colour needs a stated meaning and a legend.
- **Set `lang`** on `<html>` — `hyphens: auto` needs it to select a dictionary.
- **Title tag matters.** It becomes the PDF's document title.
