
const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const printBtn = document.getElementById("printBtn");

const paperMessage = document.getElementById("paperMessage");
const questionPaper = document.getElementById("questionPaper");
const paperSubject = document.getElementById("paperSubject");
const paperSemester = document.getElementById("paperSemester");
const paperSubjectCode = document.getElementById("paperSubjectCode");
const paperSections = document.getElementById("paperSections");

let questionBank = null;

// Randomly shuffle questions
function shuffleQuestions(questions) {
    const shuffled = [...questions];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}

// Create an element with optional class
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

// Create a question line with marks on the right
function createQuestionLine(label, text, marks) {
    const row = createElement("div", "mock-question-line");

    const content = createElement("div", "mock-question-content");

    const boldLabel = createElement("strong", "", label + " ");
    const questionText = document.createTextNode(text);

    content.appendChild(boldLabel);
    content.appendChild(questionText);

    const marksElement = createElement(
        "span",
        "mock-question-marks",
        `(${marks} marks)`
    );

    row.appendChild(content);
    row.appendChild(marksElement);

    return row;
}

// Create one complete question group (Q1 to Q5)
function createQuestionGroup(number, fiveMarks, tenMarks) {
    const group = createElement("section", "mock-question-group");

    const numberBox = createElement(
        "div",
        "mock-question-number",
        `Q ${number}.`
    );

    const body = createElement("div", "mock-question-body");

    const heading = createElement("div", "mock-question-heading");

    heading.appendChild(
        createElement(
            "span",
            "",
            "Answer any two parts of the following."
        )
    );

    heading.appendChild(
        createElement(
            "strong",
            "mock-total-marks",
            "(10×2=20)"
        )
    );

    body.appendChild(heading);

    // Part a (i) - 5 marks
    body.appendChild(
        createQuestionLine(
            "a) (i)",
            fiveMarks[0].text,
            5
        )
    );

    // Part a (ii) - 5 marks
    body.appendChild(
        createQuestionLine(
            "(ii)",
            fiveMarks[1].text,
            5
        )
    );

    // Part b - 10 marks
    body.appendChild(
        createQuestionLine(
            "b)",
            tenMarks[0].text,
            10
        )
    );

    // Part c - 10 marks
    body.appendChild(
        createQuestionLine(
            "c)",
            tenMarks[1].text,
            10
        )
    );

    group.appendChild(numberBox);
    group.appendChild(body);

    return group;
}

// Generate the complete written mock test
async function generatePaper() {
    paperMessage.textContent = "Generating question paper...";

    generateBtn.disabled = true;
    regenerateBtn.disabled = true;
    printBtn.disabled = true;

    try {
        const savedSelection = JSON.parse(
            localStorage.getItem("examPrepSelection")
        );

        if (!savedSelection || !savedSelection.subjectCode) {
            throw new Error(
                "Please select a subject from Dashboard first."
            );
        }

        // Load question bank
        if (!questionBank) {
            const response = await fetch("data/questions.json");

            if (!response.ok) {
                throw new Error(
                    "Unable to load questions.json"
                );
            }

            questionBank = await response.json();
        }

        // Find selected subject
        const selectedSubject = questionBank.subjects.find(
            subject =>
                subject.subjectCode === savedSelection.subjectCode
        );

        if (!selectedSubject) {
            throw new Error(
                "Question bank is not available for this subject yet."
            );
        }

        // Prepare all five question groups before rendering
        const groups = [];

        for (let unitNumber = 1; unitNumber <= 5; unitNumber++) {
            const unitData = selectedSubject.units.find(
                item => item.unit === unitNumber
            );

            if (!unitData) {
                throw new Error(
                    `Questions missing for Unit ${unitNumber}`
                );
            }

            const fiveMarks = shuffleQuestions(
                unitData.questions.filter(q => q.marks === 5)
            );

            const tenMarks = shuffleQuestions(
                unitData.questions.filter(q => q.marks === 10)
            );

            if (
                fiveMarks.length < 2 ||
                tenMarks.length < 2
            ) {
                throw new Error(
                    `Not enough questions in Unit ${unitNumber}`
                );
            }

            groups.push({
                number: unitNumber,
                fiveMarks: fiveMarks,
                tenMarks: tenMarks
            });
        }

        // Update paper heading
        paperSubjectCode.textContent =
            `Sub Code: ${selectedSubject.subjectCode}`;

        paperSubject.textContent =
            selectedSubject.subjectName.toUpperCase();

        paperSemester.textContent =
            `Semester ${savedSelection.semester}`;

        // Clear old questions
        paperSections.innerHTML = "";

        // Generate Q1 to Q5
        groups.forEach(group => {
            paperSections.appendChild(
                createQuestionGroup(
                    group.number,
                    group.fiveMarks,
                    group.tenMarks
                )
            );
        });

        questionPaper.hidden = false;

        regenerateBtn.disabled = false;
        printBtn.disabled = false;

        paperMessage.textContent =
            "Your 100-mark written mock test is ready!";

    } catch (error) {
        questionPaper.hidden = true;
        paperMessage.textContent = error.message;

    } finally {
        generateBtn.disabled = false;
    }
}

// Button events
generateBtn.addEventListener("click", generatePaper);

regenerateBtn.addEventListener("click", generatePaper);

printBtn.addEventListener("click", function () {
    if (!questionPaper.hidden) {
        window.print();
    }
});
