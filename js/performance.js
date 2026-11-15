
/* =========================================
   EXAMPREP - PERFORMANCE ANALYSIS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const totalTestsEl = document.getElementById("totalTests");
    const averageScoreEl = document.getElementById("averageScore");
    const highestScoreEl = document.getElementById("highestScore");
    const totalCorrectEl = document.getElementById("totalCorrect");

    const subjectPerformanceEl =
        document.getElementById("subjectPerformance");

    const testHistoryEl =
        document.getElementById("testHistory");

    // Read MCQ results saved by mcq-test.js
    let history = [];

    try {
        const savedData = JSON.parse(
            localStorage.getItem("examPrepMcqHistory") || "[]"
        );

        history = Array.isArray(savedData) ? savedData : [];
    } catch (error) {
        console.error("Unable to read test history:", error);
    }

    // Show default message when no tests exist
    if (history.length === 0) {
        subjectPerformanceEl.innerHTML =
            "<p>No subject performance available yet.</p>";

        testHistoryEl.innerHTML =
            '<tr><td colspan="6">No tests attempted yet.</td></tr>';

        return;
    }

    // =====================================
    // 1. OVERALL PERFORMANCE
    // =====================================

    const totalTests = history.length;

    const totalCorrect = history.reduce(
        (sum, test) => sum + Number(test.correct || 0),
        0
    );

    const totalPercentage = history.reduce(
        (sum, test) => sum + Number(test.percentage || 0),
        0
    );

    const averageScore = totalPercentage / totalTests;

    const highestScore = Math.max(
        ...history.map(test => Number(test.percentage || 0))
    );

    totalTestsEl.textContent = totalTests;

    averageScoreEl.textContent =
        averageScore.toFixed(2) + "%";

    highestScoreEl.textContent =
        highestScore.toFixed(2) + "%";

    totalCorrectEl.textContent = totalCorrect;

    // =====================================
    // 2. SUBJECT-WISE PERFORMANCE
    // =====================================

    const subjectData = {};

    history.forEach(test => {
        const code = test.subjectCode || "unknown";
        const name = test.subject || code;

        if (!subjectData[code]) {
            subjectData[code] = {
                name: name,
                tests: 0,
                totalPercentage: 0,
                highest: 0
            };
        }

        const percentage = Number(test.percentage || 0);

        subjectData[code].tests++;
        subjectData[code].totalPercentage += percentage;

        subjectData[code].highest = Math.max(
            subjectData[code].highest,
            percentage
        );
    });

    subjectPerformanceEl.innerHTML = "";

    Object.values(subjectData).forEach(subject => {

        const average =
            subject.totalPercentage / subject.tests;

        const card = document.createElement("div");
        card.className = "subject-performance-card";

        const heading = document.createElement("h3");
        heading.textContent = subject.name;

        const details = document.createElement("p");
        details.textContent =
            `Tests: ${subject.tests} | ` +
            `Average: ${average.toFixed(2)}% | ` +
            `Best: ${subject.highest.toFixed(2)}%`;

        const progressTrack = document.createElement("div");
        progressTrack.className = "performance-progress-track";

        const progressBar = document.createElement("div");
        progressBar.className = "performance-progress-bar";

        progressBar.style.width =
            Math.max(0, Math.min(100, average)) + "%";

        progressTrack.appendChild(progressBar);

        card.appendChild(heading);
        card.appendChild(details);
        card.appendChild(progressTrack);

        subjectPerformanceEl.appendChild(card);
    });

    // =====================================
    // 3. PREVIOUS TEST HISTORY
    // =====================================

    testHistoryEl.innerHTML = "";

    // Latest tests first
    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedHistory.forEach(test => {

        const row = document.createElement("tr");

        const date = new Date(test.date);

        const formattedDate = isNaN(date.getTime())
            ? "Unknown"
            : date.toLocaleString("en-IN");

        const cells = [
            formattedDate,
            test.subject || test.subjectCode || "Unknown",
            `${test.correct || 0} / ${test.total || 20}`,
            `${Number(test.percentage || 0).toFixed(2)}%`,
            test.correct || 0,
            test.incorrect || 0
        ];

        cells.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        testHistoryEl.appendChild(row);
    });

});
