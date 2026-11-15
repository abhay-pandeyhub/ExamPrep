
/* ==========================================
   EXAMPREP - GATE MOCK TEST SYSTEM
   ========================================== */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const dashboard = $("mockDashboard");
  const examScreen = $("examScreen");
  const resultScreen = $("resultScreen");

  const fullMockBtn = $("fullMockBtn");
  const subjectMockBtn = $("subjectMockBtn");
  const subjectSelect = $("subjectSelect");

  const examTitle = $("examTitle");
  const timerDisplay = $("timer");
  const questionNumber = $("questionNumber");
  const questionMarks = $("questionMarks");
  const questionText = $("questionText");
  const answerOptions = $("answerOptions");
  const questionPalette = $("questionPalette");

  const previousBtn = $("previousBtn");
  const reviewBtn = $("reviewBtn");
  const nextBtn = $("nextBtn");
  const submitTestBtn = $("submitTestBtn");

  const resultSummary = $("resultSummary");
  const resultSolutions = $("resultSolutions");
  const backBtn = $("backToDashboardBtn");

  const HISTORY_KEY = "examPrepGateMockHistory";
  const USED_KEY = "examPrepGateMockUsedQuestionsV1";
  const QUESTION_FILE = "data/gate-mock-questions.json";

  const FULL_TEST_SECONDS = 180 * 60;
  const SUBJECT_TEST_SECONDS = 30 * 60;

  let questionBank = [];
  let questions = [];
  let answers = {};
  let reviewQuestions = new Set();

  let currentIndex = 0;
  let remainingSeconds = 0;
  let timerInterval = null;
  let deadline = 0;
  let testActive = false;
  let currentTestName = "";

  /* ---------- LOAD QUESTION BANK ---------- */

  async function loadQuestionBank() {
    const response = await fetch(QUESTION_FILE, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        "Question bank could not load: " + response.status
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "Question bank must contain a JSON array."
      );
    }

    const ids = new Set();

    questionBank = data.map((q, index) => {
      if (!q || typeof q !== "object") {
        throw new Error("Invalid question at " + index);
      }

      if (!q.id || ids.has(String(q.id))) {
        throw new Error(
          "Missing or duplicate question ID: " + q.id
        );
      }

      ids.add(String(q.id));

      const type = String(q.type || "").toUpperCase();

      if (!["MCQ", "MSQ", "NAT"].includes(type)) {
        throw new Error(
          "Invalid question type: " + q.id
        );
      }

      if (
        !q.subject ||
        !q.question ||
        ![1, 2].includes(Number(q.marks))
      ) {
        throw new Error(
          "Missing subject, question or marks: " + q.id
        );
      }

      if (type === "NAT") {
        if (
          typeof q.answer !== "number" ||
          !Number.isFinite(q.answer)
        ) {
          throw new Error(
            "NAT answer must be numeric: " + q.id
          );
        }
      } else {
        if (
          !Array.isArray(q.options) ||
          q.options.length < 2
        ) {
          throw new Error(
            "Invalid options: " + q.id
          );
        }

        if (type === "MCQ") {
          if (
            !Number.isInteger(q.answer) ||
            q.answer < 0 ||
            q.answer >= q.options.length
          ) {
            throw new Error(
              "Invalid MCQ answer: " + q.id
            );
          }
        }

        if (type === "MSQ") {
          if (
            !Array.isArray(q.answer) ||
            q.answer.length === 0 ||
            new Set(q.answer).size !== q.answer.length ||
            q.answer.some(
              (a) =>
                !Number.isInteger(a) ||
                a < 0 ||
                a >= q.options.length
            )
          ) {
            throw new Error(
              "Invalid MSQ answer: " + q.id
            );
          }
        }
      }

      return {
        ...q,
        type,
        marks: Number(q.marks)
      };
    });

    console.log(
      "GATE question bank loaded:",
      questionBank.length,
      "questions"
    );
  }

  /* ---------- UTILITIES ---------- */

  function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  function showScreen(screen) {
    dashboard.hidden = screen !== "dashboard";
    examScreen.hidden = screen !== "exam";
    resultScreen.hidden = screen !== "result";
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [h, m, s]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  }

  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function hasAnswer(index) {
    const q = questions[index];
    const value = answers[q.id];

    if (q.type === "MSQ") {
      return Array.isArray(value) && value.length > 0;
    }

    if (q.type === "NAT") {
      return (
        value !== undefined &&
        String(value).trim() !== "" &&
        Number.isFinite(Number(value))
      );
    }

    return value !== undefined && value !== null;
  }

  function createElement(tag, text, className) {
    const element = document.createElement(tag);

    if (text !== undefined) {
      element.textContent = String(text);
    }

    if (className) {
      element.className = className;
    }

    return element;
  }

function getUsage() {
  try {
    return JSON.parse(localStorage.getItem(USED_KEY) || "{}");
  } catch {
    return {};
  }
}

function selectFresh(pool, count, usage) {
  return shuffle(pool)
    .sort((a, b) =>
      (usage[a.id] || 0) - (usage[b.id] || 0)
    )
    .slice(0, count);
}

function createFullMock() {
  const usage = getUsage();

  const groups = [
    { subject: "General Aptitude", one: 5, two: 5 },
    { subject: "Engineering Mathematics", one: 5, two: 4 },
    { subject: "CORE", one: 20, two: 26 }
  ];

  const selected = [];

  for (const group of groups) {
    const pool = questionBank.filter(q => {
      if (group.subject === "CORE") {
        return q.subject !== "General Aptitude" &&
               q.subject !== "Engineering Mathematics";
      }
      return q.subject === group.subject;
    });

    const one = pool.filter(q => q.marks === 1);
    const two = pool.filter(q => q.marks === 2);

    if (one.length < group.one || two.length < group.two) {
      alert("Not enough questions for " + group.subject);
      return null;
    }

    selected.push(
      ...selectFresh(one, group.one, usage),
      ...selectFresh(two, group.two, usage)
    );
  }

  return selected;
}

function rememberQuestions(selected) {
  const usage = getUsage();

  selected.forEach(q => {
    usage[q.id] = (usage[q.id] || 0) + 1;
  });

  try {
    localStorage.setItem(USED_KEY, JSON.stringify(usage));
  } catch (error) {
    console.warn("Could not save question usage", error);
  }
}

  /* ---------- START TEST ---------- */

  function startTest(selectedQuestions, name, duration) {
    if (!selectedQuestions.length) {
      alert("No questions available for this test.");
      return;
    }

    stopTimer();

    questions = shuffle(selectedQuestions);
    rememberQuestions(questions);
    answers = {};
    reviewQuestions = new Set();

    currentIndex = 0;
    currentTestName = name;
    remainingSeconds = duration;
    testActive = true;

    examTitle.textContent = name;

    showScreen("exam");
    renderQuestion();
    renderPalette();

    deadline = Date.now() + duration * 1000;

    updateTimer();

    timerInterval = setInterval(() => {
      updateTimer();
    }, 1000);
  }

  function updateTimer() {
    if (!testActive) return;

    remainingSeconds = Math.max(
      0,
      Math.ceil((deadline - Date.now()) / 1000)
    );

    timerDisplay.textContent = formatTime(
      remainingSeconds
    );

    if (remainingSeconds <= 0) {
      submitTest(true);
    }
  }

  /* ---------- RENDER QUESTION ---------- */

  function renderQuestion() {
    if (!testActive) return;

    const q = questions[currentIndex];

    questionNumber.textContent =
      "Question " +
      (currentIndex + 1) +
      " of " +
      questions.length;

    questionMarks.textContent =
      q.type +
      " | " +
      q.marks +
      (q.marks === 1 ? " Mark" : " Marks");

    questionText.textContent = q.question;

    answerOptions.replaceChildren();

    const savedAnswer = answers[q.id];

    if (q.type === "MCQ" || q.type === "MSQ") {
      q.options.forEach((option, index) => {
        const label = createElement("label");

        const input = document.createElement("input");

        input.type =
          q.type === "MCQ" ? "radio" : "checkbox";

        input.name = "questionAnswer";
        input.value = String(index);

        if (q.type === "MCQ") {
          input.checked = savedAnswer === index;
        } else {
          input.checked =
            Array.isArray(savedAnswer) &&
            savedAnswer.includes(index);
        }

        input.addEventListener("change", () => {
          if (q.type === "MCQ") {
            answers[q.id] = index;
          } else {
            const selected = [
              ...answerOptions.querySelectorAll(
                'input[type="checkbox"]:checked'
              )
            ].map((el) => Number(el.value));

            answers[q.id] = selected;
          }

          renderPalette();
        });

        const letter = String.fromCharCode(65 + index);

        const span = createElement(
          "span",
          letter + ". " + option
        );

        label.append(input, span);
        answerOptions.append(label);
      });
    }

    if (q.type === "NAT") {
      const input = document.createElement("input");

      input.type = "number";
      input.step = "any";
      input.placeholder = "Enter numerical answer";

      input.value =
        savedAnswer === undefined
          ? ""
          : String(savedAnswer);

      input.addEventListener("input", () => {
        answers[q.id] = input.value;
        renderPalette();
      });

      answerOptions.append(input);
    }

    previousBtn.disabled = currentIndex === 0;

    nextBtn.textContent =
      currentIndex === questions.length - 1
        ? "Save Answer"
        : "Save & Next";

    reviewBtn.textContent =
      reviewQuestions.has(q.id)
        ? "Remove Review Mark"
        : "Mark for Review";
  }

  /* ---------- QUESTION PALETTE ---------- */

  function renderPalette() {
    questionPalette.replaceChildren();

    questions.forEach((q, index) => {
      const btn = createElement(
        "button",
        index + 1
      );

      btn.type = "button";

      if (hasAnswer(index)) {
        btn.classList.add("answered");
      } else if (index < currentIndex) {
        btn.classList.add("not-answered");
      }

      if (reviewQuestions.has(q.id)) {
        btn.classList.add("review");
      }

      if (index === currentIndex) {
        btn.classList.add("current");
      }

      btn.title =
        "Question " +
        (index + 1) +
        " - " +
        q.type;

      btn.addEventListener("click", () => {
        currentIndex = index;
        renderQuestion();
        renderPalette();
      });

      questionPalette.append(btn);
    });
  }

  /* ---------- NAVIGATION ---------- */

  previousBtn.addEventListener("click", () => {
    if (!testActive || currentIndex === 0) return;

    currentIndex--;
    renderQuestion();
    renderPalette();
  });

  nextBtn.addEventListener("click", () => {
    if (!testActive) return;

    if (currentIndex < questions.length - 1) {
      currentIndex++;
    }

    renderQuestion();
    renderPalette();
  });

  reviewBtn.addEventListener("click", () => {
    if (!testActive) return;

    const id = questions[currentIndex].id;

    if (reviewQuestions.has(id)) {
      reviewQuestions.delete(id);
    } else {
      reviewQuestions.add(id);
    }

    renderQuestion();
    renderPalette();
  });

  /* ---------- ANSWER CHECKING ---------- */

  function isCorrect(q, userAnswer) {
    if (q.type === "MCQ") {
      return userAnswer === q.answer;
    }

    if (q.type === "MSQ") {
      if (!Array.isArray(userAnswer)) return false;

      const actual = [...q.answer].sort((a, b) => a - b);
      const selected = [...userAnswer].sort(
        (a, b) => a - b
      );

      return (
        actual.length === selected.length &&
        actual.every(
          (value, index) => value === selected[index]
        )
      );
    }

    if (q.type === "NAT") {
      if (
        userAnswer === undefined ||
        String(userAnswer).trim() === ""
      ) {
        return false;
      }

      const value = Number(userAnswer);

      if (!Number.isFinite(value)) return false;

      const tolerance =
        typeof q.tolerance === "number"
          ? Math.max(0, q.tolerance)
          : 0.0001;

      return Math.abs(value - q.answer) <= tolerance;
    }

    return false;
  }

  function calculateResult() {
    let score = 0;
    let totalMarks = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const details = [];

    questions.forEach((q, index) => {
      const attempted = hasAnswer(index);
      const userAnswer = answers[q.id];

      const right =
        attempted && isCorrect(q, userAnswer);

      totalMarks += q.marks;

      let awarded = 0;

      if (!attempted) {
        unattempted++;
      } else if (right) {
        correct++;
        awarded = q.marks;
      } else {
        incorrect++;

        // Negative marking applies only to MCQs.
        if (q.type === "MCQ") {
          awarded = -q.marks / 3;
        }
      }

      score += awarded;

      details.push({
        question: q,
        userAnswer,
        attempted,
        correct: right,
        awarded
      });
    });

    return {
      score: Number(score.toFixed(2)),
      totalMarks,
      correct,
      incorrect,
      unattempted,
      attempted: correct + incorrect,
      accuracy:
        correct + incorrect > 0
          ? Number(
              (
                (correct / (correct + incorrect)) *
                100
              ).toFixed(2)
            )
          : 0,
      details
    };
  }

  /* ---------- RESULT FORMATTING ---------- */

  function formatAnswer(q, value) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && !value.length)
    ) {
      return "Not attempted";
    }

    if (q.type === "NAT") {
      return String(value);
    }

    if (q.type === "MCQ") {
      return q.options[value] ?? "Invalid answer";
    }

    if (q.type === "MSQ") {
      return value
        .map((index) => q.options[index])
        .join(", ");
    }

    return String(value);
  }

  function saveHistory(result) {
    const record = {
      id: Date.now(),
      testName: currentTestName,
      date: new Date().toISOString(),
      score: result.score,
      totalMarks: result.totalMarks,
      correct: result.correct,
      incorrect: result.incorrect,
      unattempted: result.unattempted,
      accuracy: result.accuracy
    };

    try {
      const previous = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
      );

      const history = Array.isArray(previous)
        ? previous
        : [];

      history.unshift(record);

      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history.slice(0, 100))
      );
    } catch (error) {
      console.warn(
        "Could not save mock history:",
        error
      );
    }
  }

  function showResult(result) {
    showScreen("result");

    resultSummary.replaceChildren();
    resultSolutions.replaceChildren();

    const heading = createElement(
      "h2",
      result.score + " / " + result.totalMarks
    );

    resultSummary.append(heading);

    const stats = [
      ["Test", currentTestName],
      ["Correct", result.correct],
      ["Incorrect", result.incorrect],
      ["Unattempted", result.unattempted],
      ["Accuracy", result.accuracy + "%"]
    ];

    stats.forEach(([label, value]) => {
      resultSummary.append(
        createElement("p", label + ": " + value)
      );
    });

    result.details.forEach((item, index) => {
      const q = item.question;

      const card = createElement(
        "div",
        undefined,
        "solution-card"
      );

      card.append(
        createElement(
          "h3",
          "Q" + (index + 1) + ". " + q.question
        )
      );

      const status = createElement(
        "p",
        !item.attempted
          ? "Unattempted"
          : item.correct
          ? "Correct"
          : "Incorrect",
        item.correct ? "correct" : "incorrect"
      );

      card.append(status);

      card.append(
        createElement(
          "p",
          "Your answer: " +
            formatAnswer(q, item.userAnswer)
        )
      );

      card.append(
        createElement(
          "p",
          "Correct answer: " +
            formatAnswer(q, q.answer)
        )
      );

      card.append(
        createElement(
          "p",
          "Marks awarded: " +
            Number(item.awarded.toFixed(2))
        )
      );

      if (q.explanation) {
        card.append(
          createElement(
            "p",
            "Explanation: " + q.explanation
          )
        );
      }

      resultSolutions.append(card);
    });
  }

  /* ---------- SUBMIT TEST ---------- */

  function submitTest(autoSubmit = false) {
    if (!testActive) return;

    if (!autoSubmit) {
      const confirmed = confirm(
        "Are you sure you want to submit the test?"
      );

      if (!confirmed) return;
    }

    testActive = false;
    stopTimer();

    const result = calculateResult();

    saveHistory(result);
    showResult(result);
  }

  submitTestBtn.addEventListener("click", () => {
    submitTest(false);
  });

  /* ---------- DASHBOARD BUTTONS ---------- */

  fullMockBtn.addEventListener("click", () => {
  if (!questionBank.length) {
    alert("Question bank is not loaded yet.");
    return;
  }

  const selected = createFullMock();
  if (!selected) return;

  startTest(
    selected,
    "Full GATE CSE Mock Test",
    FULL_TEST_SECONDS
  );
});

  subjectMockBtn.addEventListener("click", () => {
    const subject = subjectSelect.value;

    if (!subject) {
      alert("Please select a subject first.");
      return;
    }

    const available = questionBank.filter(
      (q) => q.subject === subject
    );

    if (!available.length) {
      alert(
        "No questions available for " +
        subject +
        " yet."
      );
      return;
    }

    startTest(
     selectFresh(available, 20, getUsage()),
      subject + " Mock Test",
      SUBJECT_TEST_SECONDS
    );
  });

  backBtn.addEventListener("click", () => {
    stopTimer();
    testActive = false;
    showScreen("dashboard");
  });

  /* ---------- PAGE EXIT WARNING ---------- */

  window.addEventListener("beforeunload", (event) => {
    if (testActive) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  /* ---------- INITIALIZE ---------- */

  async function initialize() {
    showScreen("dashboard");

    fullMockBtn.disabled = true;
    subjectMockBtn.disabled = true;

    try {
      await loadQuestionBank();

      fullMockBtn.disabled = false;
      subjectMockBtn.disabled = false;
    } catch (error) {
      console.error(error);

      const message = createElement(
        "p",
        "Question bank not available yet. " +
        "Create data/gate-mock-questions.json " +
        "in Step 4."
      );

      message.style.color = "#dc2626";
      message.style.marginTop = "15px";

      dashboard.append(message);
    }
  }

  initialize();
})();
