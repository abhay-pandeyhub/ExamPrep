
document.addEventListener("DOMContentLoaded", () => {

  const STORAGE_KEY = "examPrepUGCMockHistory";

  const totalAttempts = document.getElementById("totalAttempts");
  const averageScore = document.getElementById("averageScore");
  const highestScore = document.getElementById("highestScore");
  const averageAccuracy = document.getElementById("averageAccuracy");

  const scorePercentage = document.getElementById("scorePercentage");
  const accuracyPercentage = document.getElementById("accuracyPercentage");

  const scoreProgress = document.getElementById("scoreProgress");
  const accuracyProgress = document.getElementById("accuracyProgress");

  const historyBody = document.getElementById("historyBody");

  // Load saved UGC NET mock test results
  function loadHistory() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Unable to load mock history:", error);
      return [];
    }
  }

  function calculatePercentage(score, totalMarks) {
    const obtained = Number(score);
    const total = Number(totalMarks);

    if (!Number.isFinite(obtained) ||
        !Number.isFinite(total) ||
        total <= 0) {
      return 0;
    }

    return (obtained / total) * 100;
  }

  function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
  }

  function setProgress(element, percentage) {
    const safeValue = Math.max(
      0,
      Math.min(100, percentage)
    );

    element.style.width = `${safeValue}%`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function showEmptyHistory() {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.className = "empty-message";
    cell.textContent =
      "No mock tests attempted yet. Complete a UGC NET mock test to see your performance.";

    row.appendChild(cell);
    historyBody.appendChild(row);
  }

  function renderHistory(history) {
    historyBody.replaceChildren();

    if (history.length === 0) {
      showEmptyHistory();
      return;
    }

    const sortedHistory = [...history].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedHistory.forEach(test => {
      const row = document.createElement("tr");

      const percentage = calculatePercentage(
        test.score,
        test.totalMarks
      );

      const cells = [
        formatDate(test.date),
        test.testName || "UGC NET Mock Test",
        `${Number(test.score) || 0}/${Number(test.totalMarks) || 0} (${formatPercentage(percentage)})`,
        formatPercentage(Number(test.accuracy) || 0),
        String(Number(test.correct) || 0),
        String(Number(test.incorrect) || 0)
      ];

      cells.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      historyBody.appendChild(row);
    });
  }

  function renderPerformance() {
    const history = loadHistory();

    totalAttempts.textContent = history.length;

    if (history.length === 0) {
      averageScore.textContent = "0%";
      highestScore.textContent = "0%";
      averageAccuracy.textContent = "0%";

      scorePercentage.textContent = "0%";
      accuracyPercentage.textContent = "0%";

      setProgress(scoreProgress, 0);
      setProgress(accuracyProgress, 0);

      renderHistory([]);
      return;
    }

    const scorePercentages = history.map(test =>
      calculatePercentage(test.score, test.totalMarks)
    );

    const accuracyValues = history.map(test =>
      Number(test.accuracy) || 0
    );

    const avgScore =
      scorePercentages.reduce((sum, value) => sum + value, 0)
      / history.length;

    const bestScore = Math.max(...scorePercentages);

    const avgAccuracy =
      accuracyValues.reduce((sum, value) => sum + value, 0)
      / history.length;

    totalAttempts.textContent = history.length;
    averageScore.textContent = formatPercentage(avgScore);
    highestScore.textContent = formatPercentage(bestScore);
    averageAccuracy.textContent = formatPercentage(avgAccuracy);

    scorePercentage.textContent = formatPercentage(avgScore);
    accuracyPercentage.textContent = formatPercentage(avgAccuracy);

    setProgress(scoreProgress, avgScore);
    setProgress(accuracyProgress, avgAccuracy);

    renderHistory(history);
  }

  renderPerformance();

});
