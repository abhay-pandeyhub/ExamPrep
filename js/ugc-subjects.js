
document.addEventListener("DOMContentLoaded", () => {

  // Official UGC NET Paper 1 - Code 00
  const paper1 = [
    "Teaching Aptitude",
    "Research Aptitude",
    "Comprehension",
    "Communication",
    "Mathematical Reasoning and Aptitude",
    "Logical Reasoning",
    "Data Interpretation",
    "Information and Communication Technology (ICT)",
    "People, Development and Environment",
    "Higher Education System"
  ];

  // Official UGC NET Paper 2 - Computer Science - Code 87
  const paper2 = [
    "Discrete Structures and Optimization",
    "Computer System Architecture",
    "Programming Languages and Computer Graphics",
    "Database Management Systems",
    "System Software and Operating System",
    "Software Engineering",
    "Data Structures and Algorithms",
    "Theory of Computation and Compilers",
    "Data Communication and Computer Networks",
    "Artificial Intelligence (AI)"
  ];

  function createCards(subjects, containerId, paper, code) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    subjects.forEach((subject, index) => {
      const card = document.createElement("div");
      card.className = "option-card";

      const icon = document.createElement("div");
      icon.className = "option-icon";
      icon.textContent = "📚";

      const heading = document.createElement("h3");
      heading.textContent = `Unit ${index + 1}: ${subject}`;

      const button = document.createElement("button");
      button.textContent = "Start Practice";

      button.addEventListener("click", () => {
        localStorage.setItem(
          "examPrepUGCSelection",
          JSON.stringify({
            paper,
            subjectCode: code,
            unit: index + 1,
            subject
          })
        );

        window.location.href = "ugc-practice.html";
      });

      card.append(icon, heading, button);
      container.appendChild(card);
    });
  }

  createCards(paper1, "paper1Subjects", "Paper 1", "00");
  createCards(paper2, "paper2Subjects", "Paper 2", "87");

});
