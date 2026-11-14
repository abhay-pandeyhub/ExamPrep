


const yearSelect = document.getElementById("year");
const semesterSelect = document.getElementById("semester");
const subjectSelect = document.getElementById("subject");
const unitSelect = document.getElementById("unit");
const continueBtn = document.getElementById("continueBtn");
const selectionResult = document.getElementById("selectionResult");

// UTU B.Tech CSE theory subjects.
// Some subjects are alternatives/electives.
// Labs and practicals are excluded.
const subjects = {
    
1: [
    { code: "AHT-001", name: "Engineering Physics" },
    { code: "AHT-003", name: "Introduction to Engineering Mathematics" },
    { code: "EET-001", name: "Basic Electrical Engineering" },
    { code: "CST-001", name: "Programming for Problem Solving" }
],

2: [
    { code: "AHT-002", name: "Engineering Chemistry" },
    { code: "AHT-005", name: "Analytical Mathematics" },
    { code: "ECT-001", name: "Basic Electronics Engineering" },
    { code: "MET-001", name: "Basic Mechanical Engineering" }
],


    3: [
        { code: "CST-002", name: "Discrete Structure" },
        { code: "CST-003", name: "Data Structures and Algorithms" },
        { code: "CST-004", name: "Object Oriented Programming" },
        { code: "AHT-006", name: "Advanced Applied Mathematics" },
        { code: "ECT-033", name: "Digital Electronics" },
        { code: "AHT-007", name: "Technical Communication" }
    ],

    4: [
        { code: "CST-007", name: "Computer Organization and Architecture" },
        { code: "CST-008", name: "JAVA Programming" },
        { code: "CST-009", name: "Formal Languages & Automata Theory" },
        { code: "AHT-006", name: "Advanced Applied Mathematics" },
        { code: "ECT-033", name: "Digital Electronics" },
        { code: "AHT-007", name: "Technical Communication" }
    ],

    5: [
        { code: "CST-010", name: "Design and Analysis of Algorithms" },
        { code: "CST-011", name: "Database Management System" },
        { code: "CST-012", name: "Compiler Design" },

        // Departmental Elective 1
        { code: "CST-013", name: "Graph Theory" },
        { code: "CST-014", name: "Computer Graphics" },
        { code: "CST-015", name: "Software Engineering" },
        { code: "CST-016", name: "Queuing Theory & Modelling" },

        // Departmental Elective 2
        { code: "CST-017", name: "Fault Tolerant Computing" },
        { code: "CST-018", name: "Real-Time System" },
        { code: "CST-019", name: "Distributed System" },
        { code: "CST-020", name: "Fuzzy Logic" }
    ],

    6: [
        { code: "CST-021", name: "Computer Networks" },
        { code: "CST-022", name: "Artificial Intelligence" },
        { code: "CST-023", name: "Operating System" },

        // Departmental Elective 3
        { code: "CST-024", name: "Internet of Things" },
        { code: "CST-025", name: "Quantum Computing" },
        { code: "CST-026", name: "Augmented Reality" },
        { code: "CST-027", name: "Web Technology" },
        { code: "CST-028", name: "Reliable Computing" },

        // Open Elective 1
        { code: "AHT-011", name: "Total Quality Management" },
        { code: "AHT-012", name: "Managing E-Commerce and Digital Communication" },
        { code: "AHT-013", name: "Industrial Safety and Hazard Management" }
    ],

    7: [
        // Departmental Elective 4
        { code: "CST-029", name: "Ad-hoc & Sensor Networks" },
        { code: "CST-030", name: "Machine Learning" },
        { code: "CST-031", name: "Mobile Computing" },
        { code: "CST-032", name: "Data Mining" },
        { code: "CST-033", name: "Block Chain" },

        // Departmental Elective 5
        { code: "CST-034", name: "Data Science" },
        { code: "CST-035", name: "Cryptography & Network Security" },
        { code: "CST-036", name: "DevOps" },
        { code: "CST-037", name: "Cloud Computing" },
        { code: "CST-038", name: "Natural Language Processing" }
    ],

    8: [
        // Departmental Elective 6
        { code: "CST-039", name: "Soft Computing" },
        { code: "CST-040", name: "Software Project Management" },
        { code: "CST-041", name: "Cyber and Digital Forensics" },
        { code: "CST-042", name: "Digital Image Processing" },
        { code: "CST-043", name: "Big Data Analytics" }
    ]
};

// Reset a dropdown to its placeholder
function resetDropdown(selectElement, placeholder) {
    selectElement.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;

    selectElement.appendChild(option);
}

// Populate semester dropdown
function updateSemesters() {
    const year = Number(yearSelect.value);

    resetDropdown(semesterSelect, "Select Semester");
    resetDropdown(subjectSelect, "Select Subject");

    unitSelect.value = "all";
    selectionResult.textContent = "";

    if (!year) return;

    const firstSemester = (year * 2) - 1;

    for (let sem = firstSemester; sem <= firstSemester + 1; sem++) {
        const option = document.createElement("option");

        option.value = String(sem);
        option.textContent = "Semester " + sem;

        semesterSelect.appendChild(option);
    }
}

// Populate subject dropdown
function updateSubjects() {
    const semester = semesterSelect.value;

    resetDropdown(subjectSelect, "Select Subject");

    unitSelect.value = "all";
    selectionResult.textContent = "";

    if (!semester || !subjects[semester]) return;

    subjects[semester].forEach(function (subject) {
        const option = document.createElement("option");

        option.value = subject.code;
        option.textContent =
            subject.name + " (" + subject.code + ")";

        subjectSelect.appendChild(option);
    });
}

// Update dropdowns when selections change
yearSelect.addEventListener("change", updateSemesters);
semesterSelect.addEventListener("change", updateSubjects);

// Continue button
continueBtn.addEventListener("click", function () {
    const year = yearSelect.value;
    const semester = semesterSelect.value;
    const subjectCode = subjectSelect.value;
    const unit = unitSelect.value;

    if (!year || !semester || !subjectCode) {
        selectionResult.textContent =
            "Please select year, semester and subject.";
        return;
    }

    const selectedSubject = subjects[semester].find(
        function (subject) {
            return subject.code === subjectCode;
        }
    );

    if (!selectedSubject) {
        selectionResult.textContent =
            "Invalid subject selected.";
        return;
    }

    const selection = {
        year: year,
        semester: semester,
        subject: selectedSubject.name,
        subjectCode: selectedSubject.code,
        unit: unit
    };

    localStorage.setItem(
        "examPrepSelection",
        JSON.stringify(selection)
    );

    window.location.href = "exam-options.html";
});

// Initialize the dropdown when the page loads
updateSemesters();
