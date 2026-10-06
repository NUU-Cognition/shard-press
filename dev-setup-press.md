# Setup Press

One-time, per-machine setup for Press. The shard needs a headless Chromium-family browser to convert HTML to PDF, and the Poppler utilities to verify the result.

# Prerequisites

- A Chromium-family browser: `chromium`, `chromium-browser`, `google-chrome`, `google-chrome-stable`, `brave-browser`, or Microsoft Edge.
- Poppler utilities — `pdfinfo` and `pdftoppm` — for verification. Package name is `poppler-utils` on Debian/Ubuntu, `poppler` on Arch and Homebrew.

Both are per-machine. Nothing here is committed, which is why this shard declares `setup: local`.

# Actions

1. **Find a browser.** Run:

   ```bash
   for b in chromium chromium-browser google-chrome google-chrome-stable brave-browser microsoft-edge; do command -v "$b" && break; done
   ```

   If none is found, install one through the system package manager. A Playwright-managed Chromium already on the machine also works — pass its full path.

2. **Record the path** in the local state file at `Shards/(Shards) Local State/(Shard) Press (Local).md`, so later sessions do not have to search again:

   ```markdown
   chrome-path: /usr/bin/chromium
   ```

   If the browser is on `PATH` under one of the names above, the render script finds it automatically and this line is optional. Set `PRESS_CHROME` to override the search at any time.

3. **Install Poppler** if `pdfinfo` is missing. Without it the render script still produces a PDF but reports `verified: false`, and the page-size guarantee is lost.

# Verification

- `flint shard press render-pdf --check` prints the resolved browser path and whether `pdfinfo` and `pdftoppm` are available. All three must resolve.
- Render any small HTML file and confirm the reported `pageSize` is `A4`.

Once both checks pass, run:

```bash
flint shard setup press --complete
```
