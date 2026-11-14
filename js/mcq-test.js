
const startBtn = document.getElementById("startMcqBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const retryBtn = document.getElementById("retryMcqBtn");

const startBox = document.getElementById("mcqStartBox");
const questionBox = document.getElementById("mcqQuestionBox");
const resultBox = document.getElementById("mcqResultBox");

const subjectTitle = document.getElementById("mcqSubject");
const questionCounter = document.getElementById("questionCounter");
const timerDisplay = document.getElementById("timer");
const questionTitle = document.getElementById("mcqQuestion");
const optionsBox = document.getElementById("mcqOptions");
const message = document.getElementById("mcqMessage");

const TOTAL_QUESTIONS = 20;
const TEST_DURATION = 20 * 60;

let allQuestions = [];
let testQuestions = [];
let answers = [];
let currentIndex = 0;
let timeLeft = TEST_DURATION;
let timerInterval = null;
let testActive = false;

// Shuffle questions randomly
function shuffleArray(items) {
    const array = [...items];

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

// Display countdown timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `Time Left: ${String(minutes).padStart(2, "0")}:` +
        String(seconds).padStart(2, "0");
}

// Display current MCQ
function showQuestion() {
    const question = testQuestions[currentIndex];

    questionCounter.textContent =
        `Question ${currentIndex + 1} of ${testQuestions.length}`;

    questionTitle.textContent =
        `Q${currentIndex + 1}. ${question.question}`;

    optionsBox.innerHTML = "";

    question.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "mcq-option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "mcqAnswer";
        radio.value = index;

        radio.checked = answers[currentIndex] === index;

        radio.addEventListener("change", function () {
            answers[currentIndex] = index;
        });

        const optionText = document.createElement("span");
        optionText.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        label.appendChild(radio);
        label.appendChild(optionText);
        optionsBox.appendChild(label);
    });

    previousBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === testQuestions.length - 1;
}

// Load subject MCQs from JSON
async function loadQuestions() {
    const selection = JSON.parse(
        localStorage.getItem("examPrepSelection")
    );

    if (!selection || !selection.subjectCode) {
        throw new Error(
            "Please select a subject from Dashboard first."
        );
    }

    const response = await fetch("data/mcq-questions.json");

    if (!response.ok) {
        throw new Error("Unable to load MCQ question bank.");
    }

    const data = await response.json();

    const subject = data.subjects.find(
        item => item.subjectCode === selection.subjectCode
    );

    if (!subject) {
        throw new Error(
            "MCQ questions are not available for this subject yet."
        );
    }

    subjectTitle.textContent = subject.subjectName;

    const validQuestions = subject.questions.filter(q =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        Number.isInteger(q.answer) &&
        q.answer >= 0 &&
        q.answer < 4
    );

    if (validQuestions.length < TOTAL_QUESTIONS) {
        throw new Error(
            `Only ${validQuestions.length} valid MCQs available. ` +
            `${TOTAL_QUESTIONS} required.`
        );
    }

    allQuestions = validQuestions;
}

// Start MCQ test
async function startTest() {
    startBtn.disabled = true;
    message.textContent = "Loading MCQ questions...";

    try {
        await loadQuestions();

        testQuestions = shuffleArray(allQuestions)
            .slice(0, TOTAL_QUESTIONS);

        answers = Array(TOTAL_QUESTIONS).fill(null);
        currentIndex = 0;
        timeLeft = TEST_DURATION;
        testActive = true;

        startBox.hidden = true;
        resultBox.hidden = true;
        questionBox.hidden = false;

        message.textContent = "";

        showQuestion();
        updateTimer();

        clearInterval(timerInterval);

        const endTime = Date.now() + TEST_DURATION * 1000;

        timerInterval = setInterval(() => {
            timeLeft = Math.max(
                0,
                Math.ceil((endTime - Date.now()) / 1000)
            );

            updateTimer();

            if (timeLeft === 0) {
                submitTest(true);
            }
        }, 250);

    } catch (error) {
        message.textContent = error.message;
        startBtn.disabled = false;
    }
}

// Calculate result and submit
function submitTest(autoSubmitted = false) {
    if (!testActive) return;

    if (!autoSubmitted) {
        const confirmed = confirm(
            "Are you sure you want to submit the test?"
        );

        if (!confirmed) return;
    }

    testActive = false;
    clearInterval(timerInterval);
    timerInterval = null;

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    testQuestions.forEach((question, index) => {
        if (answers[index] === null) {
            unattempted++;
        } else if (answers[index] === question.answer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    const percentage =
        ((correct / TOTAL_QUESTIONS) * 100).toFixed(2);

    document.getElementById("mcqScore").textContent =
        `${correct} / ${TOTAL_QUESTIONS}`;

    document.getElementById("mcqPercentage").textContent =
        `Percentage: ${percentage}%`;

    document.getElementById("mcqCorrect").textContent =
        `Correct Answers: ${correct}`;

    document.getElementById("mcqIncorrect").textContent =
        `Incorrect Answers: ${incorrect}`;

    document.getElementById("mcqUnattempted").textContent =
        `Unattempted: ${unattempted}`;

    questionBox.hidden = true;
    resultBox.hidden = false;

    questionCounter.textContent = "Test Completed";

    message.textContent = autoSubmitted
        ? "Time is up! Your test was submitted automatically."
        : "Your test has been submitted successfully.";

    // Store test result for performance analysis
    const selection = JSON.parse(
        localStorage.getItem("examPrepSelection") || "{}"
    );

    const history = JSON.parse(
        localStorage.getItem("examPrepMcqHistory") || "[]"
    );

    history.push({
        subjectCode: selection.subjectCode,
        subject: selection.subject,
        date: new Date().toISOString(),
        total: TOTAL_QUESTIONS,
        correct,
        incorrect,
        unattempted,
        percentage: Number(percentage)
    });

    localStorage.setItem(
        "examPrepMcqHistory",
        JSON.stringify(history)
    );
}

// Previous question
previousBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
});

// Next question
nextBtn.addEventListener("click", () => {
    if (currentIndex < testQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    }
});

// Start button
startBtn.addEventListener("click", startTest);

// Submit button
submitBtn.addEventListener("click", () => {
    submitTest(false);
});

// Retry button
retryBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    testActive = false;

    resultBox.hidden = true;
    questionBox.hidden = true;
    startBox.hidden = false;

    startBtn.disabled = false;
    timeLeft = TEST_DURATION;

    questionCounter.textContent =
        `Question 1 of ${TOTAL_QUESTIONS}`;

    updateTimer();
    message.textContent = "";
});

updateTimer();
