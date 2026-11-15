
document.addEventListener("DOMContentLoaded", () => {
  const KEY = "examPrepGateMockHistory";

  const stats = document.getElementById("performanceStats");
  const chart = document.getElementById("performanceChart");
  const historyBox = document.getElementById("performanceHistory");

  let history = [];
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    history = Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("History loading failed:", error);
  }

  if (!history.length) {
    stats.textContent = "No mock tests attempted yet.";
    chart.textContent = "Complete a mock test to see your progress.";
    historyBox.textContent = "No test history available.";
    return;
  }

  const scores = history.map(test => Number(test.score) || 0);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const highest = Math.max(...scores);
  const accuracy = history.reduce(
    (sum, test) => sum + (Number(test.accuracy) || 0), 0
  ) / history.length;

  const cards = [
    ["Tests Attempted", history.length],
    ["Average Score", average.toFixed(2)],
    ["Highest Score", highest.toFixed(2)],
    ["Average Accuracy", accuracy.toFixed(1) + "%"]
  ];

  stats.style.display = "grid";
  stats.style.gridTemplateColumns = "repeat(auto-fit, minmax(170px, 1fr))";
  stats.style.gap = "15px";

  cards.forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "test-card";

    const heading = document.createElement("h3");
    heading.textContent = label;

    const number = document.createElement("h2");
    number.textContent = value;

    card.append(heading, number);
    stats.appendChild(card);
  });

  // Score progress chart (latest 10 tests)
  const recent = history.slice(0, 10).reverse();

  const heading = document.createElement("p");
  heading.textContent = "Score percentage across recent attempts";
  chart.appendChild(heading);

  recent.forEach((test, index) => {
    const percentage = Number(test.totalMarks) > 0
      ? (Number(test.score) / Number(test.totalMarks)) * 100
      : 0;

    const row = document.createElement("div");
    row.style.margin = "15px 0";

    const label = document.createElement("p");
    label.textContent =
      `Test ${index + 1}: ${Number(percentage).toFixed(1)}%`;

    const track = document.createElement("div");
    track.style.background = "#e5e7eb";
    track.style.borderRadius = "8px";
    track.style.height = "16px";

    const bar = document.createElement("div");
    bar.style.width = Math.max(0, Math.min(100, percentage)) + "%";
    bar.style.height = "100%";
    bar.style.background = "#2563eb";
    bar.style.borderRadius = "8px";

    track.appendChild(bar);
    row.append(label, track);
    chart.appendChild(row);
  });

  // Previous attempts
  history.forEach(test => {
    const card = document.createElement("div");
    card.className = "test-card";

    const name = document.createElement("h3");
    name.textContent = test.testName || "GATE Mock Test";

    const date = document.createElement("p");
    date.textContent = new Date(test.date).toLocaleString("en-IN");

    const score = document.createElement("p");
    score.textContent = `Score: ${test.score} / ${test.totalMarks}`;

    const details = document.createElement("p");
    details.textContent =
      `Correct: ${test.correct} | Incorrect: ${test.incorrect} | Accuracy: ${test.accuracy}%`;

    card.append(name, date, score, details);
    historyBox.appendChild(card);
  });
});
