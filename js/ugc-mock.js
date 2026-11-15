
document.addEventListener("DOMContentLoaded", async () => {
  const $ = id => document.getElementById(id);
  const KEY = "examPrepUGCMockHistory";
  const USED_KEY = "examPrepUGCUsedQuestions";

  const dashboard = $("mockDashboard");
  const exam = $("examScreen");
  const resultScreen = $("resultScreen");

  let bank = [];
  let questions = [];
  let answers = {};
  let reviews = new Set();
  let current = 0;
  let seconds = 0;
  let timerId = null;
  let testName = "";
  let active = false;

  function show(screen) {
    dashboard.hidden = screen !== "dashboard";
    exam.hidden = screen !== "exam";
    resultScreen.hidden = screen !== "result";
  }

  function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getUsage() {
    try {
      return JSON.parse(localStorage.getItem(USED_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function selectQuestions(pool, count) {
    const usage = getUsage();
    return shuffle(pool)
      .sort((a, b) => (usage[a.id] || 0) - (usage[b.id] || 0))
      .slice(0, count);
  }

  function remember(selected) {
    const usage = getUsage();
    selected.forEach(q => {
      usage[q.id] = (usage[q.id] || 0) + 1;
    });
    localStorage.setItem(USED_KEY, JSON.stringify(usage));
  }

  function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map(n => String(n).padStart(2, "0")).join(":");
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function tick() {
    $("timer").textContent = formatTime(seconds);
    if (seconds <= 0) {
      submit(true);
      return;
    }
    seconds--;
  }

  function start(selected, name, duration) {
    if (!selected.length) {
      alert("Questions not available.");
      return;
    }

    questions = shuffle(selected);
    remember(questions);
    answers = {};
    reviews = new Set();
    current = 0;
    seconds = duration;
    testName = name;
    active = true;

    $("examTitle").textContent = name;
    show("exam");
    render();
    tick();
    timerId = setInterval(tick, 1000);
  }

  function render() {
    const q = questions[current];
    $("questionNumber").textContent =
      `Question ${current + 1} of ${questions.length} | ${q.paper}`;
    $("questionMarks").textContent = "2 Marks";
    $("questionText").textContent = q.question;

    const options = $("answerOptions");
    options.replaceChildren();

    q.options.forEach((option, i) => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.margin = "12px 0";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.checked = answers[q.id] === i;

      input.addEventListener("change", () => {
        answers[q.id] = i;
        renderPalette();
      });

      label.append(input, " " + option);
      options.append(label);
    });

    $("previousBtn").disabled = current === 0;
    $("nextBtn").disabled = current === questions.length - 1;
    $("reviewBtn").textContent = reviews.has(q.id)
      ? "Remove Review Mark" : "Mark for Review";

    renderPalette();
  }

  function renderPalette() {
    const palette = $("questionPalette");
    palette.replaceChildren();

    questions.forEach((q, i) => {
      const btn = document.createElement("button");
      btn.textContent = i + 1;
      btn.style.margin = "4px";

      if (answers[q.id] !== undefined) {
        btn.style.background = "#16a34a";
        btn.style.color = "white";
      }
      if (reviews.has(q.id)) {
        btn.style.background = "#9333ea";
        btn.style.color = "white";
      }
      if (i === current) {
        btn.style.outline = "3px solid #2563eb";
      }

      btn.addEventListener("click", () => {
        current = i;
        render();
      });
      palette.append(btn);
    });
  }

  $("previousBtn").addEventListener("click", () => {
    if (current > 0) {
      current--;
      render();
    }
  });

  $("nextBtn").addEventListener("click", () => {
    if (current < questions.length - 1) {
      current++;
      render();
    }
  });

  $("reviewBtn").addEventListener("click", () => {
    const id = questions[current].id;
    if (reviews.has(id)) reviews.delete(id);
    else reviews.add(id);
    render();
  });

  function submit(auto = false) {
    if (!active) return;
    if (!auto && !confirm("Submit your test?")) return;

    active = false;
    stopTimer();

    let correct = 0;
    let attempted = 0;
    const solutions = $("resultSolutions");
    solutions.replaceChildren();

    questions.forEach((q, i) => {
      const userAnswer = answers[q.id];
      const tried = userAnswer !== undefined;
      const right = tried && userAnswer === q.answer;

      if (tried) attempted++;
      if (right) correct++;

      const card = document.createElement("div");
      card.className = "option-card";
      card.style.margin = "12px 0";

      const heading = document.createElement("h3");
      heading.textContent = `Q${i + 1}. ${q.question}`;

      const status = document.createElement("p");
      status.textContent = right ? "Correct" : tried ? "Incorrect" : "Unattempted";

      const answer = document.createElement("p");
      answer.textContent = "Correct Answer: " + q.options[q.answer];

      const explanation = document.createElement("p");
      explanation.textContent = "Explanation: " + (q.explanation || "Not available");

      card.append(heading, status, answer, explanation);
      solutions.append(card);
    });

    const score = correct * 2;
    const totalMarks = questions.length * 2;
    const accuracy = attempted ? +(correct / attempted * 100).toFixed(2) : 0;

    $("resultSummary").textContent =
      `Score: ${score}/${totalMarks} | Correct: ${correct} | ` +
      `Incorrect: ${attempted - correct} | Unattempted: ${questions.length - attempted} | ` +
      `Accuracy: ${accuracy}%`;

    try {
      const history = JSON.parse(localStorage.getItem(KEY) || "[]");
      history.unshift({
        id: Date.now(),
        testName,
        date: new Date().toISOString(),
        score,
        totalMarks,
        correct,
        incorrect: attempted - correct,
        unattempted: questions.length - attempted,
        accuracy
      });
      localStorage.setItem(KEY, JSON.stringify(history.slice(0, 100)));
    } catch (error) {
      console.error("History saving failed:", error);
    }

    show("result");
  }

  $("submitTestBtn").addEventListener("click", () => submit(false));

  $("backToDashboardBtn").addEventListener("click", () => {
    stopTimer();
    show("dashboard");
  });

  $("fullMockBtn").addEventListener("click", () => {
    const p1 = bank.filter(q => q.paper === "Paper 1");
    const p2 = bank.filter(q => q.paper === "Paper 2");

    if (p1.length < 50 || p2.length < 100) {
      alert("Not enough questions for full mock.");
      return;
    }

    start([
      ...selectQuestions(p1, 50),
      ...selectQuestions(p2, 100)
    ], "Full UGC NET Mock Test", 180 * 60);
  });

  $("paperMockBtn").addEventListener("click", () => {
    const paper = $("paperSelect").value;
    if (!paper) {
      alert("Select a paper first.");
      return;
    }

    const pool = bank.filter(q => q.paper === paper);
    const count = paper === "Paper 1" ? 50 : 100;

    if (pool.length < count) {
      alert("Not enough questions for this paper.");
      return;
    }

    start(
      selectQuestions(pool, count),
      paper + " Mock Test",
      paper === "Paper 1" ? 60 * 60 : 120 * 60
    );
  });

  try {
    const response = await fetch("data/ugc-questions.json");
    if (!response.ok) throw new Error("Question bank missing");

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid question bank");

    const ids = new Set();
    bank = data.filter(q => {
      if (!q || !q.id || ids.has(q.id)) return false;
      if (!["Paper 1", "Paper 2"].includes(q.paper)) return false;
      if (!Array.isArray(q.options) || q.options.length < 2) return false;
      if (!Number.isInteger(q.answer) || q.answer < 0 ||
          q.answer >= q.options.length) return false;
      ids.add(q.id);
      return true;
    });

    console.log("UGC NET questions loaded:", bank.length);
  } catch (error) {
    console.error(error);
    alert("UGC NET question bank could not load.");
  }
});
