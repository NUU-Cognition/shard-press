---
description: "Render a Mesh markdown artifact into a branded A4 HTML document and PDF"
---

> [!important] THIS FILE IS AN INSTRUCTION. WHEN REFERENCED IT IS MEANT TO BE TAKEN AS AN ACTION.

Run `flint shard start press` if you haven't already.

# Workflow: Render Document

Take a markdown artifact from the Mesh to a finished, verified PDF, with a review gate before the PDF is cut.

# Input

- The source markdown artifact under `Mesh/`
- (Optional) A design file — brand guidelines, a style note, anything describing a visual identity
- (Optional) An output name; defaults to the artifact title without its `(Type)` prefix

# Actions

## Stage 1: Resolve

- Confirm the source artifact and read it in full. If the user named it loosely, search `Mesh/` and confirm the match before proceeding.
- Establish whether a design file is in play. If the user mentioned one, read it; if they did not, say plainly that the neutral default will be used rather than assuming a house style.
- Run [[dev-sk-press-derive_design]] and present the resolved tokens as a short table — token, value, source.
- Note anything in the source that will need a judgement call: mermaid diagrams, wide tables, long URLs, sections that should start their own page.
- Once the source, the design tokens and the output name are settled, progress to the next stage.

## Stage 2: Build

- Run [[dev-sk-press-build_html]] to produce `Exports/<name>.html`.
- Render it once with [[dev-sk-press-render_pdf]] and read every page, so the review is based on the real pagination rather than the markup.
- **Human checkpoint.** Show the user what they are getting: page count, how each diagram resolved, any layout compromise you made, and anything from the source you could not represent faithfully. Name the trade-offs — a quarter-page gap from an unsplittable block, a table whose URLs became short labels.
- Once the user confirms the document reads correctly, progress to the next stage.

## Stage 3: Finalise

- Apply any corrections the user asked for, in the **HTML** — it is the source of truth.
- Regenerate the PDF and re-verify page by page. Every change reflows what follows it, so re-check the whole document, not the part you edited.
- Confirm the final numbers: `isA4` true, expected page count, fonts embedded.
- Report the two output paths and state what changed since the review.

# Output

- `Exports/<name>.html` — the editable source of truth
- `Exports/<name>.pdf` — verified A4
- A statement of page count, design source (design file or default), and any remaining layout compromise
