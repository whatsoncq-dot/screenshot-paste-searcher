const els = {
  drop: document.getElementById('drop'),
  file: document.getElementById('file'),
  preview: document.getElementById('preview'),
  lang: document.getElementById('lang'),
  run: document.getElementById('run'),
  progress: document.getElementById('progress'),
  text: document.getElementById('text'),
  copy: document.getElementById('copy'),
  google: document.getElementById('google'),
  bing: document.getElementById('bing'),
  ddg: document.getElementById('ddg'),
  autosearch: document.getElementById('autosearch'),
};

let currentImageBlob = null;
let currentPreviewURL = null;

function setProgress(msg) {
  els.progress.textContent = msg ?? '';
}

function createPreviewURL(fileOrBlob) {
  // Clean up previous preview URL
  if (currentPreviewURL) {
    URL.revokeObjectURL(currentPreviewURL);
    currentPreviewURL = null;
  }
  currentPreviewURL = URL.createObjectURL(fileOrBlob);
  els.preview.src = currentPreviewURL;
  els.preview.style.display = 'block';
}

async function doOCR() {
  if (!currentImageBlob) {
    alert('Load a screenshot or image first.');
    return;
  }

  els.run.disabled = true;
  setProgress('Initializing…');

  try {
    const lang = els.lang?.value || 'eng';


    const worker = await Tesseract.createWorker(lang, 1, {
      logger: ({ status, progress }) => {
        if (typeof progress === 'number') {
          setProgress(`${status} ${Math.round(progress * 100)}%`);
        } else if (status) {
          setProgress(status);
        }
      },
    });

    // IMPORTANT: Pass the Blob/File directly. Do NOT pass a blob: URL.
    const { data } = await worker.recognize(currentImageBlob);

    await worker.terminate();

    const text = (data?.text || '').trim();
    els.text.value = text;
    setProgress(text ? 'Done' : 'No text detected');

    if (text && els.autosearch?.checked) {
      searchEngine('google', text);
    }
  } catch (err) {
    console.error(err);
    setProgress('');
    alert('OCR failed. See console for details.');
  } finally {
    els.run.disabled = false;
  }
}

function searchEngine(engine, text) {
  const q = encodeURIComponent(text.replace(/\s+/g, ' ').slice(0, 1800));
  let url = '';
  if (engine === 'google') url = `https://www.google.com/search?q=${q}`;
  if (engine === 'bing') url = `https://www.bing.com/search?q=${q}`;
  if (engine === 'ddg') url = `https://duckduckgo.com/?q=${q}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function pickFile(file) {
  if (!file || !file.type?.startsWith?.('image/')) return;
  currentImageBlob = file;
  createPreviewURL(file); // show preview (don’t revoke until the next pick)
}

// Drag & drop UX
['dragenter', 'dragover'].forEach(evt =>
  els.drop.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
    els.drop.classList.add('drag');
  })
);
['dragleave', 'drop'].forEach(evt =>
  els.drop.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
    els.drop.classList.remove('drag');
  })
);
els.drop.addEventListener('drop', e => {
  const file = e.dataTransfer?.files?.[0];
  if (file) pickFile(file);
});
els.drop.addEventListener('click', () => els.file.click());
els.file.addEventListener('change', e => pickFile(e.target.files[0]));

// Paste from clipboard (handles image/png, image/jpeg, etc.)
window.addEventListener('paste', e => {
  const items = Array.from(e.clipboardData?.items || []);
  const imgItem = items.find(i => i.type && i.type.startsWith('image/'));
  if (imgItem) {
    const blob = imgItem.getAsFile();
    if (blob) pickFile(blob);
  }
});

// Buttons
els.run.addEventListener('click', doOCR);
els.copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(els.text.value || '');
    els.copy.textContent = 'Copied!';
    setTimeout(() => (els.copy.textContent = 'Copy'), 900);
  } catch {}
});
els.google.addEventListener('click', () => searchEngine('google', els.text.value));
els.bing.addEventListener('click', () => searchEngine('bing', els.text.value));
els.ddg.addEventListener('click', () => searchEngine('ddg', els.text.value));


window.addEventListener('beforeunload', () => {
  if (currentPreviewURL) URL.revokeObjectURL(currentPreviewURL);
});
