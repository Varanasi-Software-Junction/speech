<!-- Example HTML elements (for reference) -->
<!--
<button id="start-btn">Start</button>
<div id="dialogue-text"></div>
<textarea id="txt"></textarea>
<img id="img1" src="teacher.png" style="visibility:hidden">
<img id="img2" src="student.png" style="visibility:hidden">
-->

<script>
const synth = window.speechSynthesis;
const startBtn = document.getElementById('start-btn');
const dialogueText = document.getElementById('dialogue-text');
let voices = [];
const txt = document.getElementById("txt");
const divshow = dialogueText; // same element
const pic1 = document.getElementById("img1");
const pic2 = document.getElementById("img2");

/* Delay helper */
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* Load voices and return a Promise that resolves when voices are available */
function loadVoicesAsync(timeout = 2000) {
    return new Promise((resolve) => {
        const got = () => {
            voices = synth.getVoices();
            // Filter out nulls; keep unique by name if needed
            voices = voices.filter(v => v && v.name);
            if (voices.length > 0) resolve(voices);
        };

        // Try immediately
        got();

        // If voices are not yet available, wait for the event
        if (voices.length === 0) {
            // Some browsers fire this event; attach handler once
            synth.onvoiceschanged = () => {
                got();
                if (voices.length > 0) resolve(voices);
            };

            // Fallback timeout: resolve whatever we have after `timeout` ms
            setTimeout(() => {
                got();
                resolve(voices);
            }, timeout);
        } else {
            resolve(voices);
        }
    });
}

/* Speak entire text area split by triple-newline (as your original code used) */
async function crx_speakAll() {
    startBtn.disabled = true;
    // load voices (wait until populated or timeout)
    await loadVoicesAsync();

    let texttospeak = txt.value.trim();
    if (!texttospeak) {
        dialogueText.textContent = 'Nothing to speak — please enter text.';
        startBtn.disabled = false;
        return;
    }

    // split by triple newline (preserve your original separator)
    let speakarray = texttospeak.split("\n\n\n").map(s => s.trim()).filter(Boolean);
    if (speakarray.length === 0) {
        dialogueText.textContent = 'No valid lines found after splitting. Check separators.';
        startBtn.disabled = false;
        return;
    }

    // Ensure at least two distinct voices; if only one available, reuse it but flip pitch slightly
    const voiceCount = Math.max(1, voices.length);
    for (let i = 0; i < speakarray.length; i++) {
        const paragraph = speakarray[i];
        // choose voice index (wrap if not enough)
        let voiceIndex = i % voiceCount;

        // toggle pictures based on parity (teacher/student)
        if ((i % 2) === 0) {
            pic1 && (pic1.style.visibility = "visible");
            pic2 && (pic2.style.visibility = "hidden");
        } else {
            pic1 && (pic1.style.visibility = "hidden");
            pic2 && (pic2.style.visibility = "visible");
        }

        // show text progressively
        appendDialogue(paragraph);

        try {
            // await the speech; pass voiceIndex
            await crx_speak(paragraph, voiceIndex);
        } catch (err) {
            console.error("Speech error:", err);
            // continue to next line
        }

        // short pause between lines so it doesn't sound abrupt
        await wait(250);
    }

    // finished
    pic1 && (pic1.style.visibility = "hidden");
    pic2 && (pic2.style.visibility = "hidden");
    startBtn.disabled = false;
}

/* Append text to dialogue and scroll into view */
function appendDialogue(text) {
    const p = document.createElement('p');
    p.textContent = text;
    divshow.appendChild(p);
    // scroll the last line into view
    p.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/* Speak one chunk and resolve when it ends (or on error/timeouts) */
function crx_speak(texttobespoken, voiceIdx) {
    // cancel any previous queued utterances to avoid overlaps
    // (optional — comment out if you prefer queuing)
    synth.cancel();

    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(texttobespoken);

        // Choose voice if available
        if (voices && voices.length > 0) {
            // clamp index
            const idx = Math.max(0, Math.min(voiceIdx, voices.length - 1));
            utterance.voice = voices[idx];
        }

        // Slightly vary pitch/ rate for alternating speakers if only one voice
        if (!utterance.voice || voices.length < 2) {
            // use pitch to simulate a different 'speaker' if needed
            utterance.pitch = (voiceIdx % 2 === 0) ? 1.0 : 0.9;
            utterance.rate = 1.0;
        } else {
            // optional: set rate/pitch for clarity
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
        }

        // Resolve on end or onerror; add a safety timeout
        let finished = false;
        const safetyTimeout = setTimeout(() => {
            if (!finished) {
                finished = true;
                console.warn("Utterance safety timeout reached — resolving anyway.");
                try { synth.cancel(); } catch (e) {}
                resolve();
            }
        }, 20000); // 20s fallback per utterance

        utterance.onend = () => {
            if (finished) return;
            finished = true;
            clearTimeout(safetyTimeout);
            resolve();
        };
        utterance.onerror = (ev) => {
            if (finished) return;
            finished = true;
            clearTimeout(safetyTimeout);
            console.error("Utterance error:", ev);
            resolve(); // resolve so the sequence continues
        };

        try {
            synth.speak(utterance);
        } catch (err) {
            clearTimeout(safetyTimeout);
            reject(err);
        }
    });
}

/* Start button wiring */
startBtn.addEventListener('click', () => {
    // prevent double clicks
    if (startBtn.disabled) return;
    crx_speakAll();
});

// Optional: expose a Stop button API if you want to stop mid-way
// Example:
// document.getElementById('stop-btn').addEventListener('click', () => {
//    synth.cancel();
//    startBtn.disabled = false;
//});
</script>
