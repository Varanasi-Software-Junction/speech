// tester.js
// Speak text from a textarea line-by-line, showing words and highlighting the current word.
// Includes pause/resume/stop controls and rate/pitch settings.

// small waits to allow UI update and spacing between words
const UI_PRE_SPEAK_WAIT = 10;     // ms before speaking a new word (tiny)
const INTER_WORD_MIN_PAUSE = 40;  // ms minimum pause after a word
const synth = window.speechSynthesis;
let voices = [];

// DOM
const displayDiv = document.getElementById('dd');
const totaldiv = document.getElementById('currentdiv');

// control flags
let shouldStop = false;    // set true to abort the speaking loop
let isSpeakingSequence = false; // true while speaking sequence is running

// load voices (browsers load voices asynchronously)
function getAllVoices(){
  voices = synth.getVoices() || [];
  voices.sort((a,b) => (a.lang > b.lang ? 1 : -1));
}
synth.onvoiceschanged = getAllVoices;
getAllVoices();

// simple wait helper
function wait(ms){
  return new Promise(res => setTimeout(res, ms));
}

// Add a word element and return the element (for highlighting)
function addWord(word, className = 'defaultwords'){
  const p = document.createElement('p');
  p.className = className;
  p.textContent = word;
  displayDiv.appendChild(p);
  return p;
}

// Speak a single word and resolve when utterance ends (or on error).
// Accepts voice/rate/pitch/volume in options.
function speakWord(word, { rate = 1.0, pitch = 1.0, volume = 1.0 } = {}){
  return new Promise((resolve) => {
    // create utterance
    const u = new SpeechSynthesisUtterance(word);
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;

    // pick english voice if available
    if (voices.length > 0) {
      const en = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
      u.voice = en || voices[0];
    }

    u.onend = () => resolve();
    u.onerror = () => {
      console.warn('Utterance error for:', word);
      resolve();
    };

    // speak
    synth.speak(u);
  });
}

// Speak a single sentence word-by-word. This checks shouldStop between words to allow immediate abort.
// Returns true if completed normally, false if aborted.
async function speakSentenceWords(sentence, opts){
  // clear display for this sentence
  displayDiv.innerHTML = '';
  totaldiv.innerHTML = '';

  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  const elements = words.map(w => addWord(w, 'defaultwords'));

  for (let i=0; i<words.length; i++){
    if (shouldStop) return false; // aborted
    const word = words[i];
    const el = elements[i];

    // highlight current word
    elements.forEach(e => e.classList.remove('currentword'));
    el.classList.add('currentword');
    totaldiv.textContent = word;

    // small UI pause before speaking
    await wait(UI_PRE_SPEAK_WAIT);

    // if paused externally, wait until resumed
    while (synth.paused) {
      await wait(50);
      if (shouldStop) return false;
    }

    // speak and wait for it to finish
    await speakWord(word, opts);

    // post-word pause (natural rhythm)
    await wait(Math.max(INTER_WORD_MIN_PAUSE, word.length * 25));
  }

  // clear highlight after sentence
  elements.forEach(e => e.classList.remove('currentword'));
  totaldiv.innerHTML = '';
  displayDiv.innerHTML = '';
  return true;
}

// Public API: Speak the text from textarea.
// The text is split into lines; each non-empty line is treated as a sentence.
// options: { rate, pitch }
async function showText(text, opts = { rate: 1.0, pitch: 1.0 }){
  if (isSpeakingSequence) {
    // If already speaking, stop and start fresh
    stopSpeech();
    // tiny pause to allow cancellation to take effect
    await wait(50);
  }

  shouldStop = false;
  isSpeakingSequence = true;

  // Ensure speech permissions triggered by a user gesture (most browsers require it).
  // If no voice loaded yet, trigger voices load again (best-effort).
  if (voices.length === 0) getAllVoices();

  // Split into lines (user places each sentence on its own line)
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  for (let i=0; i<lines.length; i++){
    if (shouldStop) break;

    // speak the sentence word by word; abort early if user pressed Stop
    const completed = await speakSentenceWords(lines[i], opts);
    if (!completed) break;

    // small pause between sentences
    await wait(120);
  }

  isSpeakingSequence = false;
}

// Pause the current speech (browser API)
function pauseSpeech(){
  if (synth.speaking && !synth.paused){
    synth.pause();
  }
}

// Resume if paused
function resumeSpeech(){
  if (synth.paused){
    synth.resume();
  }
}

// Stop everything immediately
function stopSpeech(){
  shouldStop = true;
  if (synth.speaking || synth.pending) synth.cancel();
  // cleanup UI
  displayDiv.innerHTML = '';
  totaldiv.innerHTML = '';
  isSpeakingSequence = false;
}

// expose simple functions to window so the HTML can call them
window.showText = showText;
window.pauseSpeech = pauseSpeech;
window.resumeSpeech = resumeSpeech;
window.stopSpeech = stopSpeech;
