
document.addEventListener("DOMContentLoaded", () => {
  const base = "https://gate2026.iitg.ac.in/doc/download/";

  const papers = [
    { year: 2026, set: "CS-1", paper: "2026/QPs/CS1.pdf", key: "2026/Keys/CS1_Keys.pdf" },
    { year: 2026, set: "CS-2", paper: "2026/QPs/CS2.pdf", key: "2026/Keys/CS2_Keys.pdf" },
    { year: 2025, set: "CS-1", paper: "2025/CS12025.pdf", key: "2025_Key/CS1_Keys.pdf" },
    { year: 2025, set: "CS-2", paper: "2025/CS22025.pdf", key: "2025_Key/CS2_Keys.pdf" },
    { year: 2024, set: "CS-1", paper: "2024/CS124S5.pdf", key: "2024/CS1FinalAnswerKey.pdf" },
    { year: 2024, set: "CS-2", paper: "2024/CS224S6.pdf", key: "2024/CS2FinalAnswerKey.pdf" },
    { year: 2023, set: "CS", paper: "2023/cs_2023.pdf", key: "Answer_keys2023/CS_ANS_GATE2023.pdf" },
    { year: 2022, set: "CS", paper: "2022/cs_2022.pdf", key: "Answer_keys2022/cs_2022.pdf" }
  ];

  const yearSelect = document.getElementById("year");
  const container = document.getElementById("papers");

  [...new Set(papers.map(p => p.year))].forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

  function render() {
    const selected = yearSelect.value;
    container.innerHTML = "";

    papers
      .filter(p => selected === "all" || String(p.year) === selected)
      .forEach(p => {
        const card = document.createElement("div");
        card.className = "paper";

        card.innerHTML = `
          <h3>GATE ${p.year} — ${p.set}</h3>
          <div class="actions">
            <a href="${base + p.paper}" target="_blank" rel="noopener noreferrer">
              📄 View Question Paper
            </a>
            <a href="${base + p.key}" target="_blank" rel="noopener noreferrer">
              🔑 View Answer Key
            </a>
          </div>
        `;

        container.appendChild(card);
      });
  }

  yearSelect.addEventListener("change", render);
  render();
});
