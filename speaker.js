// speaker.js
// Fully-commented speech conversation controller using Web Speech API
// Usage: include <script src="speaker.js"></script> after your HTML elements
// Required HTML IDs:
//  - #start-btn  (button to start)
//  - #stop-btn   (button to stop)  [optional but recommended]
//  - #txt        (textarea with conversation, split by 2+ blank lines)
//  - #dialogue-text (div to append spoken lines)
//  - #img1, #img2 (images for two speakers)
// Example: <button id="start-btn">Start</button> ...

'use strict';

/* ============================
   Speech conversation script
   ============================ */

/* The SpeechSynthesis controller (web API) */
const synth = window.speechSynthesis;

/* Grab UI elements by ID */
const startBtn = document.getElementById('start-btn');      // Start button
const stopBtn = document.getElementById('stop-btn');        // Stop button (optional)
const dialogueText = document.getElementById('dialogue-text'); // Div where spoken text is shown
const txt = document.getElementById('txt');                 // Textarea input for the whole conversation
const pic1 = document.getElementById('img1');               // Image for speaker A
const pic2 = document.getElementById('img2');               // Image for speaker B

/* Storage for available voices returned by getVoices() */
let voices = [];

/* Flag used to cancel an ongoing conversation */
let isCancelled = false;

/* Tracks current spoken chunk index (declared properly, not global accidental) */
let currentLine = 0;

/* ---------------------------
   Utility: non-blocking wait
   ---------------------------
   Returns a Promise that resolves after ms milliseconds.
   Use with: await wait(1000);  // waits 1000 ms (1 second) without freezing UI
*/
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ---------------------------------------------------
   populateVoices: safely populate 'voices' array
   - speechSynthesis.getVoices() may return [] initially.
   - speechSynthesis.onvoiceschanged is fired when voices become available.
   --------------------------------------------------- */
function populateVoices() {
  voices = synth.getVoices() || [];
  // Optional: filter/sort voices if you need specific languages/genders
  // Example: voices = voices.filter(v => v.lang.startsWith('en'));
}

/* Ensure we try to populate voices right away and when they change */
populateVoices();
synth.onvoiceschanged = populateVoices;

/* ---------------------------------------------------
   splitChunks: robust splitting of textarea text into dialogue chunks
   - Splits on two or more blank lines (across CRLF and LF)
   - Trims and removes empty chunks
   --------------------------------------------------- */
function splitChunks(text) {
  // This regex splits when there are 2 or more blank lines
  return text
    .split(/\r?\n(?:\s*\r?\n){1,}/)
    .map(s => s.trim())
    .filter(Boolean);
}

/* ---------------------------------------------------
   safeAppendText: appends text to the dialogue div safely
   - Avoids innerHTML to prevent HTML injection XSS
   - Adds a <br> then a text node
   - Auto-scrolls the dialogue div to show latest entry
   --------------------------------------------------- */
function safeAppendText(container, text) {
  const br = document.createElement('br');
  const tn = document.createTextNode(text);
  container.appendChild(br);
  container.appendChild(tn);
  // Auto-scroll to bottom so new lines are visible
  container.scrollTop = container.scrollHeight;
}

/* ---------------------------------------------------
   crx_speak: speaks one chunk and resolves when utterance ends
   Parameters:
     - textToBeSpoken (string)
     - voiceno (0 or 1) - index to alternate voices/images
   Returns:
     - Promise that resolves when utterance finishes (or on error)
   --------------------------------------------------- */
function crx_speak(textToBeSpoken, voiceno) {
  // Append the chunk safely to the UI
  safeAppendText(dialogueText, textToBeSpoken);

  // Toggle pictures for a simple dialogue visual
  if (voiceno === 0) {
    if (pic1) pic1.style.visibility = "visible";
    if (pic2) pic2.style.visibility = "hidden";
  } else {
    if (pic1) pic1.style.visibility = "hidden";
    if (pic2) pic2.style.visibility = "visible";
  }

  // Return a Promise that resolves when the utterance ends
  return new Promise(resolve => {
    // Create the utterance object with the text
    const utterance = new SpeechSynthesisUtterance(textToBeSpoken);

    // Choose the desired voice if available, otherwise fallback
    // We prefer voices[voiceno] (0 or 1), else use the first available voice.
    utterance.voice = voices[voiceno] || voices[0] || null;

    // Optional: uncomment and modify to control voice properties
    // utterance.lang = 'en-US';
    // utterance.rate = 1;   // speed (0.1 - 10)
    // utterance.pitch = 1;  // pitch (0 - 2)
    // utterance.volume = 1; // volume (0 - 1)

    // Resolve the promise when the utterance ends naturally
    utterance.onend = () => {
      resolve();
    };

    // If an error occurs, log and resolve so flow continues instead of hanging
    utterance.onerror = (ev) => {
      console.error('SpeechSynthesisUtterance error', ev);
      resolve();
    };

    // Start speaking (this is async)
    synth.speak(utterance);
  });
}

/* ---------------------------------------------------
   crx_speakAll: orchestrates speaking of all chunks sequentially
   - Loads voices, splits textarea input into chunks,
   - speaks them in order, alternates speakers,
   - waits 1000 ms between lines using await wait(1000),
   - respects isCancelled flag to stop early,
   - re-enables UI when finished or cancelled.
   --------------------------------------------------- */
async function crx_speakAll() {
  // Reset cancellation flag and current line counter
  isCancelled = false;
  currentLine = 0;

  // Ensure voices are populated (call again to be safe)
  populateVoices();

  // Get the raw text and trim whitespace
  const textToSpeak = (txt && txt.value) ? txt.value.trim() : '';

  // If no text, show a friendly message and return
  if (!textToSpeak) {
    if (dialogueText) dialogueText.textContent = 'No text provided in the textarea.';
    return;
  }

  // Split the text into chunks (dialogue turns)
  const chunks = splitChunks(textToSpeak);

  // Loop through chunks sequentially
  for (let i = 0; i < chunks.length; i++) {
    // Allow cancellation before we start each chunk
    if (isCancelled) break;

    // Track the current line index
    currentLine = i;

    // Alternate voice/pic using i % 2
    const voiceIndex = i % 2;

    // Speak the chunk and wait for it to finish
    await crx_speak(chunks[i], voiceIndex);

    // After the chunk finishes, check cancellation again
    if (isCancelled) break;

    // Wait 1000 ms (1 second) between chunks — this is the exact
    // place where you asked for `await wait(1000);`
    await wait(1000);
  }
}

/* ---------------------------------------------------
   startConversation: wrapper that disables UI, runs the conversation,
   and re-enables UI when done (or if an error occurs)
   --------------------------------------------------- */
async function startConversation() {
  // Disable the start button to prevent duplicate starts
  if (startBtn) startBtn.disabled = true;

  // Clear previous dialogue output if you want a fresh view:
  // if (dialogueText) dialogueText.textContent = '';

  // Ensure there is at least one voice available
  populateVoices();
  if (!voices || voices.length < 1) {
    if (dialogueText) dialogueText.textContent = 'No speech voices available. Please check your browser or OS settings.';
    if (startBtn) startBtn.disabled = false;
    return;
  }

  try {
    // Run the sequential speak flow
    await crx_speakAll();
  } catch (err) {
    // Log unexpected errors but ensure UI is restored
    console.error('Error during conversation:', err);
  } finally {
    // Reset UI: show no speaker images and re-enable start button
    if (pic1) pic1.style.visibility = 'hidden';
    if (pic2) pic2.style.visibility = 'hidden';
    if (startBtn) startBtn.disabled = false;
  }
}

/* ---------------------------
   Event listeners for buttons
   --------------------------- */

/* Start: begin conversation */
if (startBtn) {
  startBtn.addEventListener('click', () => {
    // Prevent accidental double-clicks; startConversation handles re-enabling
    if (startBtn.disabled) return;
    startConversation();
  });
}

/* Stop: cancel current speech and reset UI */
if (stopBtn) {
  stopBtn.addEventListener('click', () => {
    // Set cancellation flag
    isCancelled = true;
    // Cancel the current utterance immediately
    synth.cancel();
    // Hide images if present
    if (pic1) pic1.style.visibility = 'hidden';
    if (pic2) pic2.style.visibility = 'hidden';
    // Re-enable start button so user can try again
    if (startBtn) startBtn.disabled = false;
    // Optional: append a message indicating conversation was stopped
    if (dialogueText) safeAppendText(dialogueText, '[Conversation stopped by user]');
  });
}

/* Export helpers to window for debugging/testing (optional) */
window.speaker = {
  wait,
  populateVoices,
  crx_speak,
  crx_speakAll,
  startConversation,
  splitChunks,
  get currentLine() { return currentLine; },
  cancel: () => { isCancelled = true; synth.cancel(); }
};
