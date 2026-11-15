
document.addEventListener("DOMContentLoaded", async () => {
  const $ = id => document.getElementById(id);

  const title = $("practiceTitle");
  const info = $("practiceInfo");
  const questionCard = $("questionCard");
  const questionNumber = $("questionNumber");
  const questionText = $("questionText");
  const answerOptions = $("answerOptions");
  const previousBtn = $("previousBtn");
  const nextBtn = $("nextBtn");
  const submitBtn = $("submitBtn");
  const resultSection = $("resultSection");
  const resultSummary = $("resultSummary");
  const resultSolutions = $("resultSolutions");

  let selection;
  try {
    selection = JSON.parse(
      localStorage.getItem("examPrepUGCSelection")
    );
  } catch {
    selection = null;
  }

  if (!selection) {
    title.textContent = "Please select a unit first.";
    questionCard.hidden = true;
    return;
  }

  title.textContent = selection.subject;
  info.textContent = `${selection.paper} | Unit ${selection.unit}`;

  let questions = [];
  let currentIndex = 0;
  const answers = {};

  try {
    const response = await fetch("data/ugc-questions.json");
    if (!response.ok) throw new Error("Question file missing");

    const bank = await response.json();
    if (!Array.isArray(bank)) throw new Error("Invalid question bank");

    questions = bank.filter(q =>
      q.paper === selection.paper &&
      Number(q.unit) === Number(selection.unit)
    );
  } catch (error) {
    questionText.textContent = "Unable to load questions.";
    console.error(error);
    return;
  }

  if (!questions.length) {
    questionText.textContent =
      "Questions for this unit will be added soon.";
    previousBtn.hidden = true;
    nextBtn.hidden = true;
    submitBtn.hidden = true;
    return;
  }

  function renderQuestion() {
    const q = questions[currentIndex];

    questionNumber.textContent =
      `Question ${currentIndex + 1} of ${questions.length}`;

    questionText.textContent = q.question;
    answerOptions.replaceChildren();

    q.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.margin = "12px 0";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "ugcAnswer";
      input.value = index;
      input.checked = answers[currentIndex] === index;

      input.addEventListener("change", () => {
        answers[currentIndex] = index;
      });

      label.append(input, " " + option);
      answerOptions.appendChild(label);
    });

    previousBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === questions.length - 1;
  }

  previousBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  });

  submitBtn.addEventListener("click", () => {
    if (!confirm("Submit your practice test?")) return;

    let correct = 0;
    let attempted = 0;

    resultSolutions.replaceChildren();

    questions.forEach((q, index) => {
      const answer = answers[index];
      const isAttempted = answer !== undefined;
      const isCorrect = isAttempted && answer === q.answer;

      if (isAttempted) attempted++;
      if (isCorrect) correct++;

      const card = document.createElement("div");
      card.className = "option-card";
      card.style.margin = "15px 0";

      const heading = document.createElement("h3");
      heading.textContent = `Q${index + 1}. ${q.question}`;

      const status = document.createElement("p");
      status.textContent = isCorrect ? "Correct" :
        isAttempted ? "Incorrect" : "Unattempted";

      const correctAnswer = document.createElement("p");
      correctAnswer.textContent =
        "Correct Answer: " + (q.options[q.answer] ?? "N/A");

      const explanation = document.createElement("p");
      explanation.textContent =
        "Explanation: " + (q.explanation || "Not available");

      card.append(heading, status, correctAnswer, explanation);
      resultSolutions.appendChild(card);
    });

    const score = correct * 2;
    const totalMarks = questions.length * 2;
    const accuracy = attempted
      ? ((correct / attempted) * 100).toFixed(1)
      : "0.0";

    resultSummary.textContent =
      `Score: ${score}/${totalMarks} | Correct: ${correct} | ` +
      `Attempted: ${attempted} | Accuracy: ${accuracy}%`;

    questionCard.hidden = true;
    resultSection.hidden = false;
  });

  renderQuestion();
});
