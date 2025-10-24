<head >
  <meta property = "og:title" content = "Interactive Pattern Programs in Python" >
  <meta property = "og:description" content = "Python,Pattern Programs,Interactive,Coding Practice,Pyodide,Champak Roy,Learn With Champak,Programming Exercises," >
  <meta property = "og:image" content = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyoQWoe62o54odkLj67MDHu-SbqOPQyEjep0AC4oruXdr15y9uQsx8nRu6P6pWgJQGMEvgI4l_7S4q-mvyO57ln5modPmoL18iKF4y5wRCQZkvS7ISoKmTz5hl1bIaS-IFGIy-5jbZ8vBEE2z1fJNb6wi-MMjG_zzCu8E0nh6QY8eKqXfTOh0_IfDccsM/s16000/1000030701.jpg" >
</head >


<!--Interactive Pattern Programs(data-driven)
Includes Introduction, Importance, Keywords, Spinoffs & Further Study-->
<link href = "https://varanasi-software-junction.github.io/blogger/blogger-assets/crx_styles_v1.css" rel = "stylesheet" > </link >

<style >
  .info-section, .further-study {
    background:  # f8fbff;
    border: 1px solid  # e6f3ff;
    padding: 16px 20px;
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  }
  .info-section h3, .further-study h3 {color:  # 0b4b74; margin-bottom:8px; }
  .info-section p, .further-study p {color:  # 07385b; line-height:1.7; }
  .info-section ul, .further-study ul {margin-left: 18px; color:  # 083047; }
  .further-study a {color:  # 0b63b8; font-weight:600; text-decoration:none; }
  .further-study a: hover {text-decoration: underline;}

  .pattern-box {border: 1px solid  # e0e6ef; background:#fff; padding:14px; border-radius:12px; margin:20px 0; box-shadow:0 6px 18px rgba(0,0,0,0.04); }
  .pattern-head {display: flex; align-items: center; justify-content: space-between; gap: 12px;}
  .pattern-diagram {font-family: monospace; white-space: pre; background:  # fbfdff; padding:12px; border-radius:8px; display:inline-block; margin-top:10px; color:#0b3a66; }
  .pattern-actions {margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .pattern-actions button {background:  # 0b63b8; color:white; border:0; border-radius:8px; padding:8px 12px; cursor:pointer; font-weight:600; }
  .pattern-actions button.secondary {background:  # 6b7fa6; }
  pre.pattern-code {background:  # f6f9ff; padding:12px; border-radius:8px; overflow:auto; border:1px solid #e8f0ff; position:relative; }
  pre.pattern-code code{font-family: monospace; display: block; white-space: pre; color:  # 062a44; }
  .copy-btn {position: absolute; top: 8px; right: 8px; background:  # e8f0ff; color:#0b3a66; border:1px solid #d6e5ff; border-radius:8px; padding:6px 10px; cursor:pointer; font-size:12px; }
  .explain {margin-top: 10px; color:  # 0b3a66; background:#f7fbff; border:1px solid #e7f2ff; padding:10px; border-radius:8px; }
  # editor-area { border:2px solid #0b63b8; border-radius:12px; padding:12px; background:#ffffff; margin-top:22px; }
  # python-code { width:100%; min-height:260px; border:0; background:#f8fbff; font-family:monospace; padding:12px; border-radius:8px; resize:vertical; box-sizing:border-box; color:#083047; }
  # controls { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:10px; }
  # run-btn { background:#16a34a; color:white; border:0; border-radius:8px; padding:10px 14px; cursor:pointer; font-weight:700; }
  # stop-btn { background:#ef4444; color:#fff; border:0; border-radius:8px; padding:10px 14px; cursor:not-allowed; opacity:.6; }
  # copy-out { background:#0b63b8; color:#fff; border:0; border-radius:8px; padding:10px 14px; cursor:pointer; font-weight:700; }
  # rows-input { width:110px; padding:9px 10px; border:1px solid #cfe1ff; border-radius:8px; background:#fbfdff; font-weight:600; color:#063152; }
  # output { background:#000; color:#00ff80; padding:12px; border-radius:8px; height:240px; overflow:auto; font-family:monospace; margin-top:10px; white-space:pre-wrap; line-height:1.5; }
  .top-note {padding: 10px 12px; background:  # f0fbff; border-radius:8px; border:1px solid #e6f4ff; color:#0b4b74; margin-bottom:16px; }
  .small {font-size: 13px; color:  # 56708b; }
  # patterns { margin-top:16px; }
  # loader { padding:12px; border-radius:8px; background:#f8fbff; border:1px solid #e6f4ff; color:#0b4b74; }
  @ media(max-width: 600px){
    .pattern-diagram{width: 100%; }
    # output{height:220px;}
  }
< /style >

< div class = "post-body" >

  < div >
  < h2 > Questions on Series < /h2 >

  < / div >




  < div class = "separator" style = "clear: both; text-align: center;" > </div > <br / > < h2 > <br / > < /h2 > <h2 > <br / > < /h2 > <h2 > 🐍 Interactive Series Questions on Series < /h2 >

  < !--INTRODUCTION, IMPORTANCE & KEYWORDS-->
  < div class = "info-section" >
    < h3 > 💡 Introduction < /h3 >
    < p > Pattern programs are one of the most enjoyable ways to learn Python. They help you master < b > loops, nested structures, and logic flow < /b > while building creative outputs. From stars and numbers to pyramids and diamonds, these programs build your foundation for solving algorithmic problems efficiently. < /p >

    < h3 > 📘 Importance < /h3 >
    < p > Series problems are common in programming interviews and academic exams. They test your grasp of logic, control flow, and nested iterations — skills that directly translate into real-world algorithm design. With consistent practice, you’ll gain the ability to visualize problems, break them into smaller steps, and express them clearly through code. < /p >

    < ul >
      < li > Boosts problem-solving and analytical thinking < /li >
      < li > Strengthens understanding of loops and conditions < /li >
      < li > Prepares for coding interviews and DSA concepts < /li >
      < li > Encourages creative and structured thinking < /li >
    < / ul >

    < h3 > 🔑 Keywords < /h3 >
    < p > <b > Natural Numbers, Even Numbers, Odd Numbers, factorials, Prime Numbers, Sine Series, Cosine Series, Multiplication Tables of a given number, longest increasing series, decreasing series and more < /b > </p >
  < / div >

  < div class = "top-note" >
    This gallery is powered by JSON. Click < b > ▶ Run in Editor < /b > to load any pattern below into the live Python editor and run it directly in your browser.
  < /div >

  < !--Dynamic patterns from JSON-->
  < div id = "loader" > ⏳ Loading Series… < /div >
  < div hidden = "" id = "patterns" > </div >

  < h2 > 💻 Live Python Editor(Pyodide) < /h2 >
  < p > Write or modify code, optionally set < b > rows < /b >, then click < b > Run Code < /b > to execute instantly. < /p >

  < div aria-live = "polite" id = "editor-area" >
    < textarea aria-label = "Python code" id = "python-code" > print("Hello from Champak Roy!") < /textarea >

    < div id = "controls" >
      < label class = "small" > rows: < /label >
      < input id = "rows-input" type = "number" value = "5" / >
      < button id = "run-btn" > ▶ Run Code < /button >
      < button disabled = "" id = "stop-btn" > ⏹ Running… < /button >
      < button id = "copy-out" title = "Copy output" > Copy output < /button >
      < span class = "small" id = "status" > </span >
    < / div >

    < div aria-label = "Program output" id = "output" > Loading Python runtime… < /div >
  < / div >

  < !--SPINOFFS & FURTHER STUDY-->
  < div class = "further-study" >
    < h3 > 📘 Spinoffs & amp; Further Study < /h3 >
    < p > Once you’ve mastered these Python series programs, continue your learning journey with these practical extensions: < /p >
    < ul >
      < li > 🔄 < a href = "https://www.learnwithchampak.live/2025/10/python-loops-and-nesting.html" target = "_blank" > Loops and Nesting in Python < /a > — deep dive into < code > for < /code > and < code > while < /code > structures. < /li >
      < li > 🧮 < a href = "https://www.learnwithchampak.live/2025/10/recursion-in-python-simple-examples.html" target = "_blank" > Recursion Explained with Patterns < /a > — learn how recursion can print patterns elegantly. < /li >
      < li > 🧠 < a href = "https://www.learnwithchampak.live/2025/10/data-structures-visualized-in-python.html" target = "_blank" > Data Structures Visualized < /a > — visualize arrays, stacks, and sorting algorithms interactively. < /li >
      < li > 🎨 < a href = "https://www.learnwithchampak.live/2025/10/css-animations-for-programming-demos.html" target = "_blank" > Add Animations with CSS < /a > — style your pattern visualizations beautifully for web display. < /li >
      < li > 🧩 < a href = "https://www.learnwithchampak.live/2025/10/dsa-quizzes-python.html" target = "_blank" > DSA Quizzes in Python < /a > — test your concepts with real interview-style MCQs. < /li >
    < / ul >

    < p > All lessons are part of the < b > Learning Sutras < /b > series by < b > Champak Roy < /b > — designed to make coding fun, interactive, and conceptually clear. < /p >
  < / div >
< / div >


  < div >




< script src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js" > </script >
< script >
const JSON_URL = "https://varanasi-software-junction.github.io/blogger/blogger-assets/series.json";
const patternsWrap = document.getElementById("patterns");
const loader = document.getElementById("loader");

// ---------- Load and Render Patterns - ---------
async function loadPatterns() {
  try {
    const res = await fetch(JSON_URL, {cache: "no-store"});
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    renderPatterns(Array.isArray(data) ? data: []);
    loader.hidden = true;
    patternsWrap.hidden = false;
  } catch(e) {
    loader.innerHTML = "❌ Failed to load patterns.json. Please check the URL and CORS.";
  }
}

function renderPatterns(list) {
  patternsWrap.innerHTML = "";
  list.forEach((item, idx)= > {
    const box = document.createElement("div");
    box.className = "pattern-box";
    const head = document.createElement("div");
    head.className = "pattern-head";
    const h3 = document.createElement("h3");
    h3.innerHTML = `${(idx+1).toString().padStart(2, "0")} — ${item.title | | "Untitled Pattern"}`;
    head.appendChild(h3);
    box.appendChild(head);

    if (item.diagram) {
      const diagram = document.createElement("div");
      diagram.className = "pattern-diagram";
      diagram.textContent = item.diagram;
      box.appendChild(diagram);
    }

    const pre = document.createElement("pre");
    pre.className = "pattern-code";
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", async ()= > {
      try {
        await navigator.clipboard.writeText((item.code | | "").trim());
        const old = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(()=> copyBtn.textContent = old, 900);
      } catch {alert("Copy failed.");}
    });
    const code = document.createElement("code");
    const codeId= `pattern-code-${item.id | | idx}`;
    code.id = codeId;
    code.textContent= item.code | | "";
    pre.appendChild(copyBtn);
    pre.appendChild(code);
    box.appendChild(pre);

    const act = document.createElement("div");
    act.className = "pattern-actions";
    const runBtn = document.createElement("button");
    runBtn.innerHTML = "▶ Run in Editor";
    runBtn.addEventListener("click", ()= > loadToEditor(codeId));
    act.appendChild(runBtn);
    const tip = document.createElement("span");
    tip.className = "small";
    tip.innerHTML = `Tip: change < code > rows < /code > in the editor or use the input below.`;
    act.appendChild(tip);
    box.appendChild(act);

    if (item.explanation) {
      const ex = document.createElement("div");
      ex.className = "explain";
      ex.textContent = item.explanation;
      box.appendChild(ex);
    }

    patternsWrap.appendChild(box);
  });
}

loadPatterns();

// ---------- Pyodide Runtime - ---------
let pyodide = null;
const outputDiv = document.getElementById("output");
const runBtn = document.getElementById("run-btn");
const stopBtn = document.getElementById("stop-btn");
const statusEl = document.getElementById("status");
const rowsInput = document.getElementById("rows-input");
const copyOutBtn = document.getElementById("copy-out");
let running = false;

async function initPyodide() {
  setStatus("⏳ Loading Python (Pyodide)…");
  outputDiv.innerText = "⏳ Loading Python (Pyodide)…";
  try {
    pyodide = await loadPyodide({indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"});
    outputDiv.innerText = "✅ Pyodide ready! Paste or load a snippet, then click Run.";
    setStatus("Ready.");
  } catch {
    setStatus("Failed to load Pyodide.", true);
    outputDiv.innerText = "❌ Failed to load Pyodide. Check your connection.";
  }
}
initPyodide();

function attachStdIO() {
  pyodide.setStdout({batched: t = > {outputDiv.innerText += t; if (!t.endsWith("\n")) outputDiv.innerText += "\n"; outputDiv.scrollTop = outputDiv.scrollHeight;} });
  pyodide.setStderr({batched: t = > {outputDiv.innerText += "❌ " + t + (t.endsWith("\n") ? "": "\n"); outputDiv.scrollTop = outputDiv.scrollHeight; } });
}
function setStatus(msg, err=false){statusEl.textContent = msg; statusEl.style.color = err?"#d11": "#56708b"; }
async function runCode(){
  if(!pyodide){outputDiv.innerText = "Please wait… Pyodide still loading."; return;}
  if (running)return ;
  running = true; runBtn.disabled = true; stopBtn.disabled = false;
  outputDiv.innerText = ""; setStatus("Running…"); attachStdIO();
  const code = document.getElementById("python-code").value | |"";
  const rowsVal = Math.max(1, parseInt(rowsInput.value | |"5", 10));
  const injected = `rows = ${rowsVal}\n`+code+"\n";
  try{ await pyodide.runPythonAsync(injected); setStatus("Done."); }
  catch(e){ outputDiv.innerText+="❌ "+e+"\n"; setStatus("Error",true); }
  finally{ running=false; runBtn.disabled=false; stopBtn.disabled=true; }
}
runBtn.addEventListener("click",runCode);
stopBtn.addEventListener("click",()=>setStatus("Cannot stop mid-run in this version.",true));
function loadToEditor(id){ const code=document.getElementById(id)?.innerText?.trim()??""; document.getElementById("python-code").value=code; document.getElementById("editor-area").scrollIntoView({behavior:"smooth"}); }
copyOutBtn.addEventListener("click",async()=>{ try{ await navigator.clipboard.writeText(outputDiv.innerText); copyOutBtn.textContent="Copied!"; setTimeout(()=>copyOutBtn.textContent="Copy output",900);}catch{alert("Copy failed.");}});
</script>
