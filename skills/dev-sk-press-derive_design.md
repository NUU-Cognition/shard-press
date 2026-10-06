---
description: "Read an optional design file and resolve it into CSS design tokens"
---

> [!important] THIS FILE IS AN INSTRUCTION. WHEN REFERENCED IT IS MEANT TO BE TAKEN AS AN ACTION.

Run `flint shard start press` if you haven't already.

# Skill: Derive Design

Resolve a design file — or its absence — into the CSS custom properties the document will use.

# Input

- (Optional) Path to a design file: a brand guideline, style note, or any markdown describing a visual identity
- Nothing else. With no design file this skill still produces a complete token set.

# Actions

1. **Read the design file** if one was given. Read it in full — palettes are often split across sections, and the treatment sentence is usually separate from the colour list.

2. **Extract the signals** named in [[dev-knw-press-design]] § What Press Extracts: primary colours, greyscale ramp, typeface, treatment sentence. Take every hex **verbatim**.

3. **Assign roles** from the treatment sentence. "White background, navy text, purple accents" maps directly to ground / text / accent. With no treatment sentence, infer: lightest is ground, darkest is text, the remaining saturated colour is the accent.

4. **Fill gaps per-signal** from the neutral default in [[dev-knw-press-design]] § The Neutral Default. A file naming only a typeface keeps the default palette; one naming only colours keeps the default stack. Never invent a palette to fill a gap.

5. **Order the greyscale ramp** light to dark and assign structural jobs: panel tint, rule, caption, secondary text, muted body. If the file supplies fewer than four neutrals, interpolate between ground and text rather than borrowing the accent.

6. **Compose the fallback stack.** Append real faces to any named webfont, so a render without network still produces a readable document.

7. **Report the resolved tokens** as a short table — token, value, source (`design file` or `default`) — so the choice is auditable before any HTML is written.

# Output

- A complete set of CSS custom properties: ground, text, accent, greyscale ramp, font stack
- A statement of which tokens came from the design file and which from the default
- No files written — this skill only resolves values
