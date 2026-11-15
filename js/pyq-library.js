
/* ExamPrep UTU CSE PYQ Library — bundled, deduplicated PDFs. */
document.addEventListener("DOMContentLoaded", () => {
  const subjectNameEl = document.getElementById("pyqSubjectName");
  const subjectCodeEl = document.getElementById("pyqSubjectCode");
  const yearFilter = document.getElementById("pyqYearFilter");
  const paperList = document.getElementById("pyqPaperList");
  const emptyState = document.getElementById("pyqEmptyState");

  if (!subjectNameEl || !subjectCodeEl || !yearFilter || !paperList) return;

  const PAPERS = [
    { subjectCode:"BCST602", subject:"Compiler Design", year:2024, session:"2023-24", semester:6, examType:"Regular", file:"pyq-pdfs/bcst602-2024-regular-df3ea8e.pdf" },
    { subjectCode:"BCST503", subject:"Design and Analysis of Algorithms", year:2023, session:"2023-24", semester:5, examType:"Regular", file:"pyq-pdfs/bcst503-2023-regular-d586cf0.pdf" },
    { subjectCode:"BCST602", subject:"Compiler Design", year:2023, session:"2022-23", semester:6, examType:"Regular", file:"pyq-pdfs/bcst602-2023-regular-971e5d1.pdf" },
    { subjectCode:"BCST503", subject:"Design and Analysis of Algorithms", year:2022, session:"2022-23", semester:5, examType:"Regular", file:"pyq-pdfs/bcst503-2022-regular-ebd44a7.pdf" },
    { subjectCode:"CST012", subject:"Compiler Design", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/cst012-2024-regular-6207620.pdf" },
    { subjectCode:"BCST503", subject:"Design and Analysis of Algorithms", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/bcst503-2024-regular-eaae915.pdf" },
    { subjectCode:"CST010", subject:"Design and Analysis of Algorithms", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/cst010-2024-regular-752806e.pdf" },
    { subjectCode:"CST015", subject:"Software Engineering", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/cst015-2024-regular-7bb875e.pdf" },
    { subjectCode:"BCST503", subject:"Design and Analysis of Algorithms", year:2025, session:"2025-26", semester:5, examType:"Regular", file:"pyq-pdfs/bcst503-2025-regular-ef21805.pdf" },
    { subjectCode:"CST010", subject:"Design and Analysis of Algorithms", year:2025, session:"2025-26", semester:5, examType:"Regular", file:"pyq-pdfs/cst010-2025-regular-0263428.pdf" },
    { subjectCode:"CST012", subject:"Compiler Design", year:2025, session:"2025-26", semester:5, examType:"Regular", file:"pyq-pdfs/cst012-2025-regular-8c21539.pdf" },
    { subjectCode:"CST015", subject:"Software Engineering", year:2025, session:"2025-26", semester:5, examType:"Regular", file:"pyq-pdfs/cst015-2025-regular-dc71278.pdf" },
    { subjectCode:"CST022", subject:"Artificial Intelligence", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/cst022-2025-regular-d6dd20d.pdf" },
    { subjectCode:"CST021", subject:"Computer Networks", year:2025, session:"2024-25", semester:4, examType:"Regular", file:"pyq-pdfs/cst021-2025-regular-65858a4.pdf" },
    { subjectCode:"AHT009", subject:"Constitution of India", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/aht009-2024-regular-747e2ae.pdf" },
    { subjectCode:"BCST502", subject:"Computer Networks", year:2023, session:"2023-24", semester:5, examType:"Regular", file:"pyq-pdfs/bcst502-2023-regular-ea9d615.pdf" },
    { subjectCode:"BCST603", subject:"Data Analytics", year:2024, session:"2023-24", semester:6, examType:"Regular", file:"pyq-pdfs/bcst603-2024-regular-cc1a464.pdf" },
    { subjectCode:"CST011", subject:"Database Management System", year:2024, session:"2024-25", semester:3, examType:"Regular", file:"pyq-pdfs/cst011-2024-regular-a2d4ee0.pdf" },
    { subjectCode:"CST010", subject:"Design and Analysis of Algorithms", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/cst010-2024-regular-6a1449e.pdf" },
    { subjectCode:"CST019", subject:"Distributed Systems", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/cst019-2024-regular-07915fa.pdf" },
    { subjectCode:"AHT010", subject:"Essence of Indian Traditional Knowledge", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/aht010-2025-regular-f6e0d1b.pdf" },
    { subjectCode:"BCST604A", subject:"Graph Theory", year:2024, session:"2023-24", semester:6, examType:"Regular", file:"pyq-pdfs/bcst604a-2024-regular-72edaec.pdf" },
    { subjectCode:"CST013", subject:"Graph Theory", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/cst013-2024-regular-949eee7.pdf" },
    { subjectCode:"BOET504D", subject:"Innovation & Entrepreneurship", year:2023, session:"2023-24", semester:5, examType:"Regular", file:"pyq-pdfs/boet504d-2023-regular-c01b96b.pdf" },
    { subjectCode:"CST024", subject:"Internet of Things", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/cst024-2025-regular-70b87d2.pdf" },
    { subjectCode:"BCST504D", subject:"Java Programming", year:2023, session:"2023-24", semester:5, examType:"Regular", file:"pyq-pdfs/bcst504d-2023-regular-9c8ff94.pdf" },
    { subjectCode:"BOCS605B", subject:"Machine Learning", year:2024, session:"2023-24", semester:6, examType:"Regular", file:"pyq-pdfs/bocs605b-2024-regular-3b3303a.pdf" },
    { subjectCode:"AHT012", subject:"Managing E-Commerce & Digital Communication", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/aht012-2025-regular-e962ee3.pdf" },
    { subjectCode:"BCST601", subject:"Microprocessors and Applications", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/bcst601-2025-regular-e45fa60.pdf" },
    { subjectCode:"BCST601", subject:"Microprocessors and Applications", year:2024, session:"2023-24", semester:6, examType:"Regular", file:"pyq-pdfs/bcst601-2024-regular-b7a6ce2.pdf" },
    { subjectCode:"BCST501", subject:"Operating System", year:2023, session:"2023-24", semester:5, examType:"Regular", file:"pyq-pdfs/bcst501-2023-regular-e413482.pdf" },
    { subjectCode:"AHT011", subject:"Total Quality Management", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/aht011-2025-regular-885de19.pdf" },
    { subjectCode:"TCS602", subject:"Compiler Design", year:2023, session:"2022-23", semester:6, examType:"Regular", file:"pyq-pdfs/tcs602-2023-regular-8ea4237.pdf" },
    { subjectCode:"BCST602", subject:"Compiler Design", year:2024, session:"2023-24", semester:6, examType:"Special Back", file:"pyq-pdfs/bcst602-2024-special-back-16c528f.pdf" },
    { subjectCode:"BCST602", subject:"Compiler Design", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/bcst602-2025-regular-b1d2c95.pdf" },
    { subjectCode:"BCST604A", subject:"Graph Theory", year:2024, session:"2023-24", semester:6, examType:"Special Back", file:"pyq-pdfs/bcst604a-2024-special-back-8fdd33e.pdf" },
    { subjectCode:"BCST604A", subject:"Graph Theory", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/bcst604a-2025-regular-04d9788.pdf" },
    { subjectCode:"BCST501", subject:"Operating System", year:2022, session:"2022-23", semester:5, examType:"Regular", file:"pyq-pdfs/bcst501-2022-regular-71a0c28.pdf" },
    { subjectCode:"BCST501", subject:"Operating System", year:2024, session:"2024-25", semester:5, examType:"Regular", file:"pyq-pdfs/bcst501-2024-regular-71981d8.pdf" },
    { subjectCode:"CST023", subject:"Operating Systems", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/cst023-2025-regular-45e6c35.pdf" },
    { subjectCode:"CST027", subject:"Web Technology", year:2025, session:"2024-25", semester:6, examType:"Regular", file:"pyq-pdfs/cst027-2025-regular-c39f074.pdf" }
  ];

  // Normalize subject codes and names.
  const normalize = value =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const canon = value => {
    const name = normalize(value);

    if (
      name === "daa" ||
      name === "designanalysisofalgorithms"
    ) {
      return "designandanalysisofalgorithms";
    }

    if (name === "operatingsystems") {
      return "operatingsystem";
    }

    if (
      name === "dbms" ||
      name === "databasemanagementsystems"
    ) {
      return "databasemanagementsystem";
    }

    if (name === "computernetwork") {
      return "computernetworks";
    }

    return name;
  };

  // Read the subject selected from Dashboard.
  let selected = null;

  try {
    selected = JSON.parse(
      localStorage.getItem("examPrepSelection")
    );
  } catch (error) {
    console.error("Invalid academic selection:", error);
  }

  if (
    !selected ||
    (!selected.subjectCode && !selected.subject)
  ) {
    subjectNameEl.textContent = "No Subject Selected";
    subjectCodeEl.textContent = "";

    paperList.textContent =
      "Please select a subject from Dashboard first.";

    if (emptyState) {
      emptyState.hidden = true;
    }

    return;
  }

  subjectNameEl.textContent =
    selected.subject || "Selected Subject";

  subjectCodeEl.textContent = selected.subjectCode
    ? `Subject Code: ${selected.subjectCode}`
    : "";

  const selectedCode = normalize(selected.subjectCode);
  const selectedName = canon(selected.subject);

  // Match exact codes OR equivalent subject names.
  // Cards show the actual code and semester of each PDF.
  const matched = PAPERS.filter(paper =>
    (
      selectedCode &&
      normalize(paper.subjectCode) === selectedCode
    ) ||
    (
      selectedName &&
      canon(paper.subject) === selectedName
    )
  ).sort(
    (a, b) =>
      b.year - a.year ||
      a.semester - b.semester
  );

  // Create year filter.
  yearFilter.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Years";
  yearFilter.appendChild(allOption);

  const years = [
    ...new Set(matched.map(paper => paper.year))
  ].sort((a, b) => b - a);

  years.forEach(year => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearFilter.appendChild(option);
  });

  function render() {
    const chosen = yearFilter.value;

    const visible = matched.filter(paper =>
      chosen === "all" ||
      String(paper.year) === chosen
    );

    paperList.replaceChildren();

    if (emptyState) {
      emptyState.hidden = visible.length > 0;
    }

    paperList.hidden = visible.length === 0;

    if (visible.length === 0) {
      if (emptyState) {
        emptyState.textContent =
          "No PYQ PDF available for this subject/year yet.";
      }
      return;
    }

    visible.forEach(paper => {
      const card = document.createElement("article");
      card.className = "pyq-paper-card";

      const icon = document.createElement("div");
      icon.className = "pyq-paper-icon";
      icon.textContent = "📄";

      const title = document.createElement("h3");
      title.textContent =
        `${paper.subject} — ${paper.year}`;

      const details = document.createElement("p");
      details.textContent =
        `Exam Session: ${paper.session} | ` +
        `Sem ${paper.semester} | ` +
        `${paper.subjectCode} | ` +
        `${paper.examType}`;

      const actions = document.createElement("div");
      actions.className = "pyq-paper-actions";

      const viewBtn = document.createElement("a");
      viewBtn.textContent = "View PDF";
      viewBtn.href = paper.file;
      viewBtn.target = "_blank";
      viewBtn.rel = "noopener noreferrer";
      viewBtn.className = "pyq-view-btn";

      const downloadBtn = document.createElement("a");
      downloadBtn.textContent = "Download PDF";
      downloadBtn.href = paper.file;
      downloadBtn.download =
        paper.file.split("/").pop();
      downloadBtn.className = "pyq-download-btn";

      actions.append(viewBtn, downloadBtn);
      card.append(icon, title, details, actions);

      paperList.appendChild(card);
    });
  }

  yearFilter.addEventListener("change", render);
  render();
});
