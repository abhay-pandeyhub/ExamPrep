
/* =========================================
   EXAMPREP - PYQ LIBRARY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const subjectNameEl =
        document.getElementById("pyqSubjectName");

    const subjectCodeEl =
        document.getElementById("pyqSubjectCode");

    const yearFilter =
        document.getElementById("pyqYearFilter");

    const paperList =
        document.getElementById("pyqPaperList");

    const emptyState =
        document.getElementById("pyqEmptyState");

    // Read subject selected on Dashboard
    let selection = null;

    try {
        selection = JSON.parse(
            localStorage.getItem("examPrepSelection")
        );
    } catch (error) {
        console.error("Invalid academic selection:", error);
    }

    if (!selection || !selection.subjectCode) {
        subjectNameEl.textContent = "No Subject Selected";
        subjectCodeEl.textContent = "";

        paperList.textContent =
            "Please select a subject from Dashboard first.";

        return;
    }

    subjectNameEl.textContent =
        selection.subject || "Selected Subject";

    subjectCodeEl.textContent =
        `Subject Code: ${selection.subjectCode}`;

    /*
       Original PYQ PDFs will be added here later.

       Example format:

       {
           subjectCode: "CST-011",
           year: 2024,
           title: "DBMS Previous Year Paper",
           file: "pyq-pdfs/dbms-2024.pdf"
       }

       Do not add entries until the real PDF
       files are available in the project.
    */

    const papers = [];

    // Find papers for the selected subject
    const subjectPapers = papers.filter(
        paper => paper.subjectCode === selection.subjectCode
    );

    // Populate examination year dropdown
    const years = [
        ...new Set(subjectPapers.map(paper => paper.year))
    ].sort((a, b) => b - a);

    years.forEach(year => {
        const option = document.createElement("option");
        option.value = String(year);
        option.textContent = String(year);
        yearFilter.appendChild(option);
    });

    // Display paper cards
    function displayPapers() {

        const selectedYear = yearFilter.value;

        const filteredPapers = subjectPapers.filter(paper =>
            selectedYear === "all" ||
            String(paper.year) === selectedYear
        );

        paperList.innerHTML = "";

        if (filteredPapers.length === 0) {
            emptyState.hidden = false;
            paperList.hidden = true;
            return;
        }

        emptyState.hidden = true;
        paperList.hidden = false;

        filteredPapers.forEach(paper => {

            const card = document.createElement("article");
            card.className = "pyq-paper-card";

            const icon = document.createElement("div");
            icon.className = "pyq-paper-icon";
            icon.textContent = "📄";

            const title = document.createElement("h3");
            title.textContent = paper.title;

            const year = document.createElement("p");
            year.textContent = `Examination Year: ${paper.year}`;

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
            downloadBtn.download = "";
            downloadBtn.className = "pyq-download-btn";

            actions.appendChild(viewBtn);
            actions.appendChild(downloadBtn);

            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(year);
            card.appendChild(actions);

            paperList.appendChild(card);
        });
    }

    yearFilter.addEventListener("change", displayPapers);

    displayPapers();

});
