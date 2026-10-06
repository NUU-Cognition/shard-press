---
description: "Design file contract — what a design file may declare, how it maps to CSS tokens, and the neutral default"
---

# Knowledge: Design Input

The design file is **optional**. It is the one place a document's visual identity comes from, and when it is absent Press uses a neutral default rather than inventing one.

## What A Design File Is

Any markdown file describing a visual identity. It is prose, not a schema — a brand guideline page, a section of a style doc, a few lines in a note. Press reads it and extracts what it can.

A minimal one:

```markdown
**Primary colours:**
- `#FFFFFF` — White
- `#0F0B27` — Deep Navy
- `#8674F6` — Purple

**Secondary / Greyscale palette:**
- `#EDEFF7` … `#000000`

**Typography:** Manrope

Standard treatment: white background, navy text, purple accents.
```

## What Press Extracts

| Signal | Looked for | Used for |
|--------|-----------|----------|
| Primary colours | Hex values named primary/brand | Ground, body text, accent |
| Greyscale ramp | An ordered list of neutral hexes | Rules, borders, secondary text, diagram strokes |
| Typeface | A named font family | Whole document, with a fallback stack appended |
| Treatment | A sentence on how the colours are combined | Which colour is ground vs. text vs. accent |

**The treatment sentence decides roles.** "White background, navy text, purple accents" assigns three colours to three jobs. Without it, infer: lightest is ground, darkest is text, the remaining saturated colour is the accent.

## Mapping To Tokens

Extracted values become CSS custom properties on `:root`. Everything downstream references the token — never a raw hex in a rule.

```css
:root {
  --white:  #FFFFFF;   /* ground */
  --navy:   #0F0B27;   /* body text, terminal diagram nodes */
  --purple: #8674F6;   /* accent: masthead rule, eyebrows, links, highlights */
  --g1: #EDEFF7;       /* tinted panel fills */
  --g2: #D3D6E0;       /* rules, borders, card separators */
  --g4: #9DA2B3;       /* captions, diagram arrowheads */
  --g5: #6E7180;       /* secondary text, table headers */
  --g6: #40424D;       /* de-emphasised body copy */
  --font: "Manrope", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

The greyscale ramp does the structural work. A document reads as designed when rules, borders and secondary text sit at distinct, deliberate steps of one ramp — not when it uses more colour.

### Accent discipline

The accent earns attention by being rare. A reasonable budget for a report: the masthead rule, section eyebrows, links, highlight fills, and one emphasised diagram node. Past that it stops signalling.

**Avoid the thick coloured side-bar on stacked cards.** One is a nice accent; twelve in a column read as templated. Separate repeated blocks with a hairline from the grey ramp and let the heading carry the emphasis.

## The Neutral Default

With no design file:

| Token | Value |
|-------|-------|
| Ground | `#FFFFFF` |
| Text | `#1A1A1A` |
| Accent | `#3D5A80` (a restrained slate blue) |
| Ramp | `#F4F5F7` `#E1E4E8` `#C3C7CE` `#8B9099` `#5A5F68` |
| Typeface | System stack: `-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |

The default is deliberately quiet. A document with no stated identity should look unbranded, not like a guess at one.

## Rules

- **Never invent branding.** No design file means the default, not an improvised palette.
- **Take hexes verbatim.** Do not "improve" a brand colour's contrast or saturation.
- **Fall back per-signal.** A design file naming only a typeface keeps the default palette; one naming only colours keeps the default stack.
- **Always append a fallback font stack.** A webfont that fails to load must degrade to a real face — see [[dev-knw-press-print]] § Fonts.
- **A logo is not a palette.** Do not synthesise a wordmark or logo from a design file. If the file ships an image asset, place it; otherwise set the title in type.
