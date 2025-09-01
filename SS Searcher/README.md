# Screenshot Paste Searcher

Paste or drop a screenshot, extract text with in-browser OCR (Tesseract.js), then search Google/Bing/DuckDuckGo instantly.  
**Privacy-friendly:** no servers, no accounts—everything runs locally in your browser.

> Live demo (after enabling GitHub Pages):  
> `https://whatsoncq-dot.github.io/ocr-search/`

---

## Features
- **Paste / Drag-drop / File pick** a screenshot or image
- **One-click OCR** → text appears in a textarea
- **Search buttons** for Google, Bing, and DuckDuckGo
- **Auto-search** toggle (open results as soon as OCR finishes)
- **Copy to clipboard** button
- **Language selector** (defaults to English)
- **All client-side** (loads Tesseract from CDN; no uploads to any server)

---

## Quick Start

1. Download or clone this repo.
2. Open `index.html` in your browser.
3. Paste (Ctrl/⌘+V) or drop a screenshot into the drop zone.
4. Click **Extract Text**, then click **Search Google** (or enable **Auto-search**).

> Tip: On macOS/Windows, copy any image to clipboard (Cmd/Ctrl+Shift+4 on macOS, Snipping Tool/Win+Shift+S on Windows), then paste directly into the page.

---

## Project Structure
/
├─ index.html # UI & layout
├─ styles.css # Minimal dark theme styles
└─ app.js # OCR + search logic (Tesseract.js from CDN)

---

## How It Works
- Uses **Tesseract.js** (WebAssembly) in the browser to run OCR.
- Accepts **File/Blob** directly—no network fetch of `blob:` URLs.
- Opens your preferred search engine in a new tab with the extracted text.

---

## Deploy to GitHub Pages

1. Create a **public** repo (e.g., `ocr-search`) and push/upload these files.
2. Repo **Settings → Pages** → **Source: Deploy from a branch** → Branch `main` + **/(root)** → **Save**.
3. Your site will be live at:
https://<your-username>.github.io/ocr-search/

---

## Configuration

- **Default language:** English (`eng`).  
You can add more options in the `<select id="lang">` menu in `index.html`.
- **Search engines:** controlled in `app.js` (`searchEngine()` function).

---

## Troubleshooting

**“Failed to load resource: net::ERR_FILE_NOT_FOUND” or `TypeError: Failed to fetch` during OCR**  
This usually happens if a `blob:` URL was revoked or a loader tried to `fetch` it.  
Fixes in this repo:
- The app **passes the File/Blob directly** to Tesseract (`worker.recognize(currentImageBlob)`).
- The preview `blob:` URL is only revoked when a **new** image is selected or on page unload.

**OCR accuracy is poor**  
- Use clean, high-contrast screenshots.
- Try switching language in the dropdown (e.g., `eng+osd`).
- Crop out irrelevant UI where possible before OCR.

**Paste doesn’t work**  
- Clipboard image paste requires HTTPS in some browsers. GitHub Pages is HTTPS—use the hosted version if needed.

---

## Privacy
- No images or text leave your device.
- OCR and search happens locally (search opens your browser with the query text).

---

## Roadmap (nice-to-haves)
- Optional **crop tool** before OCR
- **Auto-watch** a folder (desktop app variant) for new screenshots
- **History panel** of recent OCR results
- **Hotkey** to run OCR automatically on paste

---

## Tech
- **Tesseract.js** (CDN, no build tools)
- Plain **HTML/CSS/JavaScript** (no frameworks)

---

## License
MIT
