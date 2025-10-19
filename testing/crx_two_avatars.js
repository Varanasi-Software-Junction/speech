// ----------------------
// Utility
// ----------------------
function crx_wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ----------------------
// SVG templates
// ----------------------
function crx_svg_teacher_speaking() {
  return `
  <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="crx_grad_t_s" x1="0" x2="1"><stop offset="0" stop-color="#bfe9ff"/><stop offset="1" stop-color="#8fd7ff"/></linearGradient></defs>
    <rect x="6" y="6" width="128" height="128" rx="16" fill="url(#crx_grad_t_s)"/>
    <g transform="translate(26,26)">
      <circle cx="26" cy="26" r="18" fill="#fff" stroke="#cdeeff" stroke-width="2"/>
      <rect x="6" y="52" rx="8" width="40" height="18" fill="#fff" stroke="#cdeeff" stroke-width="2"/>
      <g stroke="#435b72" stroke-width="1.6" fill="none">
        <circle cx="14" cy="24" r="4.5"/><circle cx="38" cy="24" r="4.5"/><line x1="18" y1="24" x2="34" y2="24"/>
      </g>
    </g>
    <g transform="translate(72,36)">
      <rect x="0" y="6" width="30" height="16" rx="3" fill="#fff" opacity="0.92" stroke="#d8f0ff"/>
      <polygon points="30,6 44,0 44,28 30,22" fill="#fff" opacity="0.92" stroke="#d8f0ff"/>
      <g class="crx_wave" fill="none" stroke="#0077dd" stroke-width="2">
        <path d="M46 14 C52 6,60 6,66 14" />
      </g>
    </g>
  </svg>`;
}

function crx_svg_teacher_listening() {
  return `
  <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="128" height="128" rx="16" fill="#f8fdff"/>
    <g transform="translate(26,26)">
      <circle cx="26" cy="26" r="18" fill="#fff" stroke="#e6f6ff" stroke-width="2"/>
      <rect x="6" y="52" rx="8" width="40" height="18" fill="#fff" stroke="#e6f6ff" stroke-width="2"/>
      <g transform="translate(60,20)" stroke="#4a6a84" stroke-width="1.6" fill="none">
        <path d="M6 6 C10 2,18 2,24 6 C28 9,28 18,24 22" />
      </g>
    </g>
  </svg>`;
}

function crx_svg_student_speaking() {
  return `
  <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="crx_grad_s_s" x1="0" x2="1"><stop offset="0" stop-color="#fff6d8"/><stop offset="1" stop-color="#ffeaa0"/></linearGradient></defs>
    <rect x="6" y="6" width="128" height="128" rx="16" fill="url(#crx_grad_s_s)"/>
    <g transform="translate(26,26)">
      <circle cx="26" cy="26" r="18" fill="#fff" stroke="#fde9b7" stroke-width="2"/>
      <rect x="6" y="52" rx="7" width="40" height="18" fill="#fff" stroke="#fde9b7" stroke-width="2"/>
      <path d="M8 22 C18 6,36 6,46 22" fill="#ffd88a"/>
    </g>
    <g transform="translate(72,36)">
      <rect x="0" y="6" width="34" height="18" rx="6" fill="#fff" stroke="#ffd48a"/>
      <polygon points="12,24 6,30 18,26" fill="#fff" stroke="#ffd48a"/>
      <g class="crx_wave" fill="none" stroke="#c77400" stroke-width="2">
        <path d="M42 14 C48 6,56 6,62 14" />
      </g>
    </g>
  </svg>`;
}

function crx_svg_student_listening() {
  return `
  <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="128" height="128" rx="16" fill="#fffdf7"/>
    <g transform="translate(26,26)">
      <circle cx="26" cy="26" r="18" fill="#fff" stroke="#fff4dc" stroke-width="2"/>
      <rect x="6" y="52" rx="7" width="40" height="18" fill="#fff" stroke="#fff4dc" stroke-width="2"/>
      <g transform="translate(64,28)" fill="none" stroke="#b07a00" stroke-width="1.6">
        <path d="M6 6 C10 2,18 2,24 6 C28 9,28 18,24 22" />
      </g>
    </g>
  </svg>`;
}

// ----------------------
// DOM render functions
// ----------------------
function crx_drawTeacher(state) {
  const inner = document.getElementById("crx_avatar_teacher_inner");
  const zone = document.getElementById("crx_avatar_zone_teacher");
  if (!inner || !zone) return;
  inner.innerHTML =
    state === "speaking"
      ? crx_svg_teacher_speaking()
      : crx_svg_teacher_listening();
  zone.classList.toggle("crx_speaking", state === "speaking");
  zone.classList.toggle("crx_listening", state !== "speaking");
}

function crx_drawStudent(state) {
  const inner = document.getElementById("crx_avatar_student_inner");
  const zone = document.getElementById("crx_avatar_zone_student");
  if (!inner || !zone) return;
  inner.innerHTML =
    state === "speaking"
      ? crx_svg_student_speaking()
      : crx_svg_student_listening();
  zone.classList.toggle("crx_speaking", state === "speaking");
  zone.classList.toggle("crx_listening", state !== "speaking");
}

// ----------------------
// SpeechSynthesis
// ----------------------
const crx_synth = window.speechSynthesis;
let crx_currentUtterance = null;

function crx_findVoiceByName(name) {
  const vs = crx_synth.getVoices() || [];
  if (!name) return vs[0] || null;
  return vs.find((v) => v.name === name) || vs.find((v) => v.lang.startsWith("en")) || vs[0];
}

async function crx_teacherSpeak(sentence, voiceName) {
  if (!sentence || !sentence.trim()) return;
  crx_teacherStop();
  crx_drawTeacher("speaking");
  crx_drawStudent("listening");

  const utt = new SpeechSynthesisUtterance(sentence);
  utt.voice = crx_findVoiceByName(voiceName);
  utt.onend = () => crx_drawTeacher("listening");

  crx_currentUtterance = utt;
  crx_synth.speak(utt);
}

function crx_teacherStop() {
  if (crx_currentUtterance) crx_synth.cancel();
  crx_drawTeacher("listening");
}

async function crx_studentSpeak(sentence, voiceName) {
  if (!sentence || !sentence.trim()) return;
  crx_studentStop();
  crx_drawStudent("speaking");
  crx_drawTeacher("listening");

  const utt = new SpeechSynthesisUtterance(sentence);
  utt.voice = crx_findVoiceByName(voiceName);
  utt.onend = () => crx_drawStudent("listening");

  crx_currentUtterance = utt;
  crx_synth.speak(utt);
}

function crx_studentStop() {
  if (crx_currentUtterance) crx_synth.cancel();
  crx_drawStudent("listening");
}

// ----------------------
// Button wiring
// ----------------------
document.getElementById("crx_btn_teacher_speak").onclick = () => {
  const t = document.getElementById("crx_teacher_text").value.trim() ||
            "Hello students. Today we will learn arrays.";
  crx_teacherSpeak(t);
};

document.getElementById("crx_btn_teacher_listen").onclick = () => crx_drawTeacher("listening");
document.getElementById("crx_btn_teacher_stop").onclick = () => crx_teacherStop();

document.getElementById("crx_btn_student_speak").onclick = () => {
  const t = document.getElementById("crx_student_text").value.trim() ||
            "Yes teacher. What is an array?";
  crx_studentSpeak(t);
};

document.getElementById("crx_btn_student_listen").onclick = () => crx_drawStudent("listening");
document.getElementById("crx_btn_student_stop").onclick = () => crx_studentStop();

// initial state
crx_drawTeacher("listening");
crx_drawStudent("listening");
