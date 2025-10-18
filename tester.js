// tester.js (improved)
// Speak text from a textarea line-by-line, showing words and highlighting the current word.
// Public API (unchanged): showText(text, { rate, pitch, voiceName })
// Controls: pauseSpeech(), resumeSpeech(), stopSpeech()

const UI_PRE_SPEAK_WAIT = 10;     // ms before speaking a new word (tiny)
const INTER_WORD_MIN_PAUSE = 40;  // ms minimum pause after a word
const synth = window.speechSynthesis;
let voices = [];

// DOM (expects these IDs in your HTML)
const displayDiv = document.getElementById('dd');
const totaldiv = document.getElementById('currentdiv');

// control flags
let shouldStop = false;          // set true to abort the speaking loop
let isSpeakingSequence = false;  // true while a showText run is active

// ------------------------- voices loading -------------------------
function getAllVoices(){
  voices = synth.getVoices() || [];
  // sort for stable order (by language then name)
  voices.sort((a,b) => {
    if (a.lang === b.lang) return (a.name > b.name) ? 1 : -1;
    return (a.lang > b.lang) ? 1 : -1;
  });
}
synth.onvoiceschanged = getAllVoices;
getAllVoices();

// Promise that resolves when voices are available (or after timeout)
function ensureVoices(timeout = 1500){
  return new Promise((resolve) => {
    if (voices.length > 0) return resolve(voices);
    let resolved = false;
    const onVoices = () => {
      if (resolved) return;
      getAllVoices();
      resolved = true;
      resolve(voices);
      cleanup();
    };
    const cleanup = () => {
      clearTimeout(timer);
      synth.removeEventListener?.('voiceschanged', onVoices);
    };
    synth.addEventListener?.('voiceschanged', onVoices);
    const timer = setTimeout(() => {
      if (resolved) return;
      getAllVoices();
      resolved = true;
      resolve(voices);
      cleanup();
    }, timeout);
  });
}

// ------------------------- helpers -------------------------
function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

function addWord(word, className = 'defaultwords'){
  const p = document.createElement('p');
  p.className = className;
  p.textContent = word;
  displayDiv.appendChild(p);
  return p;
}

// speak single word and resolve when utterance ends or errors
function speakWord(word, { rate = 1.0, pitch = 1.0, volume = 1.0, voiceName = null } = {}){
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('speechSynthesis not available in this browser');
      return resolve();
    }

    const u = new SpeechSynthesisUtterance(word);
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;

    // try to set voice by name (if provided); otherwise choose first English-like voice
    if (voices.length > 0) {
      if (voiceName) {
        const match = voices.find(v => v.name === voiceName);
        if (match) u.voice = match;
      }
      if (!u.voice) {
        const en = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
        u.voice = en || voices[0];
      }
    }

    u.onend = () => resolve();
    u.onerror = (e) => {
      console.warn('Utterance error for:', word, e);
      resolve();
    };

    synth.speak(u);
  });
}

// speak one sentence word-by-word
async function speakSentenceWords(sentence, opts){
  displayDiv.innerHTML = '';
  totaldiv.innerHTML = '';

  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  const elements = words.map(w => addWord(w, 'defaultwords'));

  for (let i=0; i<words.length; i++){
    if (shouldStop) return false; // aborted
    const word = words[i];
    const el = elements[i];

    // highlight current
    elements.forEach(e => e.classList.remove('currentword'));
    el.classList.add('currentword');
    totaldiv.textContent = word;

    // tiny pause before speaking (UI smoothing)
    await wait(UI_PRE_SPEAK_WAIT);

    // if paused via API (synth.paused), wait until resumed (or aborted)
    while (synth.paused) {
      await wait(50);
      if (shouldStop) return false;
    }

    // speak and wait
    await speakWord(word, opts);

    // natural pause: depends a bit on word length
    await wait(Math.max(INTER_WORD_MIN_PAUSE, word.length * 25));
  }

  // cleanup UI for this sentence
  elements.forEach(e => e.classList.remove('currentword'));
  totaldiv.innerHTML = '';
  displayDiv.innerHTML = '';
  return true;
}

// ------------------------- public API -------------------------
async function showText(text, opts = { rate: 1.0, pitch: 1.0, voiceName: null }){
  if (!('speechSynthesis' in window)) {
    console.warn('speechSynthesis not supported in this browser.');
    return;
  }

  // if already running, stop previous run and give tiny breathing room
  if (isSpeakingSequence) {
    stopSpeech();
    await wait(60);
  }

  shouldStop = false;
  isSpeakingSequence = true;

  // ensure voices loaded (best-effort)
  await ensureVoices();

  // split into non-empty trimmed lines
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  for (let i=0; i<lines.length; i++){
    if (shouldStop) break;
    const completed = await speakSentenceWords(lines[i], opts);
    if (!completed) break;
    // pause between sentences
    await wait(120);
  }

  isSpeakingSequence = false;
}

// Pause / resume / stop
function pauseSpeech(){
  if (synth.speaking && !synth.paused) synth.pause();
}
function resumeSpeech(){
  if (synth.paused) synth.resume();
}
function stopSpeech(){
  shouldStop = true;
  if (synth.speaking || synth.pending) synth.cancel();
  displayDiv.innerHTML = '';
  totaldiv.innerHTML = '';
  isSpeakingSequence = false;
}

// Expose publicly for HTML to call
window.showText = showText;
window.pauseSpeech = pauseSpeech;
window.resumeSpeech = resumeSpeech;
window.stopSpeech = stopSpeech;

// Optional: helper to list voices (useful for building a simple selector in your page)
window.__getAvailableVoices = () => voices.slice();
