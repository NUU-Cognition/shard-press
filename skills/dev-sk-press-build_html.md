---
description: "Convert a markdown artifact into a branded A4 HTML document"
---

> [!important] THIS FILE IS AN INSTRUCTION. WHEN REFERENCED IT IS MEANT TO BE TAKEN AS AN ACTION.

Run `flint shard start press` if you haven't already.

# Skill: Build HTML

Render a markdown artifact as a print-ready A4 HTML document.

# Input

- Path to the source markdown artifact under `Mesh/`
- Design tokens from [[dev-sk-press-derive_design]]
- (Optional) Output name; defaults to the source artifact's title without its `(Type)` prefix

# Actions

1. **Read the source in full, now.** Do not render from an earlier read in this conversation — the file may have been edited since. If a previous version of this document exists in `Exports/`, the source still wins.

2. **Inventory the constructs** present: headings, tables, mermaid fences, highlights, quoted verbatim blocks, repeated labelled entries. This decides which components from [[dev-tmp-press-document-v0.1]] you emit. Skip the rest.

3. **Strip the frontmatter.** YAML frontmatter is workspace metadata, not document content. The title and date belong in the masthead; `id`, `tags`, `orbh-sessions` and `template` do not appear in the output.

4. **Build the document** per [[dev-tmp-press-document-v0.1]]: token block, `@page`, typographic scale, then the body in source order.

5. **Reproduce text verbatim.** Press reformats; it does not rewrite. Preserve wording, numbers and emphasis exactly — including `==highlights==`, which become `<mark>`. Convert typographic characters to entities so encoding cannot corrupt them.

6. **Convert each mermaid fence to hand-authored inline SVG** per [[dev-knw-press-print]] § Diagrams. Pad the viewBox, use a collector bus for many-to-one edges, keep wrapped titles in the bold group, and paint in design tokens. Never leave a mermaid fence for a client-side renderer.

7. **Handle long URLs in tables** with a short anchor label and the full URL in the `href`.

8. **Write the file** to `Exports/<name>.html`.

# Output

- `Exports/<name>.html` — a self-contained A4 print document
- A note of any construct that needed a judgement call, especially diagram layout
