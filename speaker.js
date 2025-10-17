<!-- Example HTML (for reference) -->
<!--
<button id="start-btn">Start</button>
<div id="dialogue-text" style="max-height:300px; overflow:auto; border:1px solid #ddd; padding:8px;"></div>
<textarea id="txt" rows="8" style="width:100%">
Hello student. Let's learn bubble sort.

OK teacher. Show me how it works.
</textarea>
<img id="img1" src="teacher.png" style="visibility:hidden; width:80px;">
<img id="img2" src="student.png" style="visibility:hidden; width:80px;">
-->

<style>
/* Highlight style for the currently spoken word */
.highlighted-word {
  background: #ffea61;
  border-radius: 3px;
  padding: 0 2px;
}
.dialogue-paragraph { margin: 0 0 0.6rem 0; line-height:1.5; }
</style>

<script>
const synth = window.speechSynthesis;
const startBtn = document.getElementById('start-btn');
const dialogueText = document.getElementById('dialogue-text');
let voices = [];
const txt = document.getElementById("txt");
const divshow = dialogueText;
const pic1 = document.getElementById("img1");
const pic2 = document.getElementById("img2");

/* Delay helper */
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* Voice loader */
function loadVoicesAsync(timeout = 2000) {
    return new Promise((resolve) => {
        const got = () => {
            voices = synth.getVoices().filter(v => v && v.name);
            if (voices.length > 0) resolve(voices);
        };
        got();
        if (voices.length === 0) {
            synth.onvoiceschanged = () => {
                got();
                if (voices.length > 0) resolve(voices);
            };
            setTimeout(() => {
                got();
                resolve(voices); // resolve whatever we have
            }, timeout);
        } else {
            resolve(voices);
        }
    });
}

/* Turn a paragraph string into a paragraph element whose words are wrapped in spans.
   Also returns an array of {start,end,span} for quick lookup. */
function createParagraphSpans(text) {
    const p = document.createElement('p');
    p.className = 'dialogue-paragraph';

    // We'll use regex to find contiguous non-whitespace tokens and their indices
    // This preserves punctuation attached to words (so highlighting matches what the speech engine reports).
    const wordRegex = /(\S+)/g;
    let match;
    const indexMap = []; // {start, end, span}

    let lastIndex = 0;
    while ((match = wordRegex.exec(text)) !== null) {
        const word = match[0];
        const start = match.index;
        const end = start + word.length; // exclusive

        // append the text between lastIndex and start as plain text node (preserves spaces)
        if (start > lastIndex) {
            p.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }

        // create span for word
        const span = document.createElement('span');
        span.textContent = word;
        span.dataset.start = start;
        span.dataset.end = end;
        p.appendChild(span);

        indexMap.push({ start, end, span });

        lastIndex = end;
    }

    // append any trailing whitespace/text
    if (lastIndex < text.length) {
        p.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    return { paragraphElement: p, indexMap };
}

/* Highlight the word whose span contains charIndex */
function highlightForCharIndex(indexMap, charIndex) {
    // naive linear search is OK for paragraphs of moderate size
    for (let i = 0; i < indexMap.length; i++) {
        const { start, end, span } = indexMap[i];
        if (charIndex >= start && charIndex < end) {
            // clear others
            indexMap.forEach(m => m.span.classList.toggle('highlighted-word', m.span === span));
            // ensure the highlighted span is visible in the container
            span.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            return;
        }
    }
    // if none matched, clear highlights
    indexMap.forEach(m => m.span.classList.remove('highlighted-word'));
}

/* Append paragraph to dialogue display and return its indexMap */
function appendDialogueWithSpans(text) {
    const { paragraphElement, indexMap } = createParagraphSpans(text);
    divshow.appendChild(paragraphElement);
    paragraphElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return indexMap;
}

/* Speak full set of paragraphs split by triple-newline, highlighting words in real time */
async function crx_speakAll() {
    startBtn.disabled = true;
    await loadVoicesAsync();

    let texttospeak = txt.value.trim();
    if (!texttospeak) {
        dialogueText.textContent = 'Nothing to speak — please enter text.';
        startBtn.disabled = false;
        return;
    }

    let speakarray = texttospeak.split("\n\n\n").map(s => s.trim()).filter(Boolean);
    if (speakarray.length === 0) {
        dialogueText.textContent = 'No valid lines found after splitting. Check separators.';
        startBtn.disabled = false;
        return;
    }

    const voiceCount = Math.max(1, voices.length);

    for (let i = 0; i < speakarray.length; i++) {
        const paragraph = speakarray[i];

        // toggle pics based on parity
        if ((i % 2) === 0) {
            pic1 && (pic1.style.visibility = "visible");
            pic2 && (pic2.style.visibility = "hidden");
        } else {
            pic1 && (pic1.style.visibility = "hidden");
            pic2 && (pic2.style.visibility = "visible");
        }

        // create spans for the paragraph and get index map
        const indexMap = appendDialogueWithSpans(paragraph);

        try {
            await crx_speakWithHighlight(paragraph, i % voiceCount, indexMap);
        } catch (err) {
            console.error("Speech error:", err);
        }

        // small pause between paragraphs
        await wait(250);
    }

    // finished: hide pics, clear highlights, re-enable
    pic1 && (pic1.style.visibility = "hidden");
    pic2 && (pic2.style.visibility = "hidden");
    startBtn.disabled = false;
}

/* Speak a single paragraph and highlight words using onboundary if available */
function crx_speakWithHighlight(texttobespoken, voiceIdx, indexMap) {
    // cancel any previous queued utterances so we don't overlap
    synth.cancel();

    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(texttobespoken);

        // set voice if available
        if (voices && voices.length > 0) {
            const idx = Math.max(0, Math.min(voiceIdx, voices.length - 1));
            utterance.voice = voices[idx];
        }

        // fallback pitch/ rate adjustments if only one voice
        if (!utterance.voice || voices.length < 2) {
            utterance.pitch = (voiceIdx % 2 === 0) ? 1.0 : 0.9;
            utterance.rate = 1.0;
        } else {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
        }

        // Safety timeout in case onend doesn't fire (per-utterance)
        let finished = false;
        const safetyTimeout = setTimeout(() => {
            if (!finished) {
                finished = true;
                console.warn("Utterance safety timeout reached — resolving anyway.");
                try { synth.cancel(); } catch (e) {}
                // clear any highlights
                indexMap.forEach(m => m.span.classList.remove('highlighted-word'));
                resolve();
            }
        }, 20000);

        // If the browser supports onboundary, use it to highlight words
        // event.charIndex is relative to utterance.text
        if ('onboundary' in SpeechSynthesisUtterance.prototype) {
            utterance.onboundary = (event) => {
                // We are only interested in word boundaries; some engines produce 'word' or boundaryType 2
                // Different browsers may behave slightly differently; rely on charIndex presence
                if (typeof event.charIndex === 'number') {
                    highlightForCharIndex(indexMap, event.charIndex);
                }
            };
        } else {
            // Browser doesn't support boundary events; we can try a naive fallback using time-based highlighting
            // (not implemented here — keep words unhighlighted)
            console.info('onboundary not supported in this browser; real-time word highlighting unavailable.');
        }

        utterance.onend = () => {
            if (finished) return;
            finished = true;
            clearTimeout(safetyTimeout);
            // clear highlights when finished speaking the paragraph
            indexMap.forEach(m => m.span.classList.remove('highlighted-word'));
            resolve();
        };

        utterance.onerror = (ev) => {
            if (finished) return;
            finished = true;
            clearTimeout(safetyTimeout);
            console.error("Utterance error:", ev);
            indexMap.forEach(m => m.span.classList.remove('highlighted-word'));
            resolve(); // resolve so we continue with next paragraphs
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
    if (startBtn.disabled) return;
    crx_speakAll();
});
</script>
