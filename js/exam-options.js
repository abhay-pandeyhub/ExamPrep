
const savedSelection = localStorage.getItem("examPrepSelection");

const academicDetails = document.getElementById("academicDetails");

if (savedSelection) {
    try {
        const selection = JSON.parse(savedSelection);

        academicDetails.textContent =
            `Year ${selection.year} | ` +
            `Semester ${selection.semester} | ` +
            `${selection.subject} | ` +
            `${selection.unit === "all" ? "All Units" : "Unit " + selection.unit}`;
    } catch (error) {
        academicDetails.textContent =
            "Invalid selection. Please return to the dashboard.";
    }
} else {
    academicDetails.textContent =
        "No selection found. Please select your academic details first.";
}


function openModule(module) {
    if (!savedSelection) {
        alert("Please select your academic details first.");
        window.location.href = "dashboard.html";
        return;
    }

    if (module === "written") {
        window.location.href = "written-test.html";
        return;
    }
   
if (module === "mcq") {
    window.location.href = "mcq-test.html";
    return;
}

if (module === "performance") {
    window.location.href = "performance.html";
    return;
}

if (module === "pyq") {
    window.location.href = "pyq-library.html";
    return;
}


    const moduleNames = {
        pyq: "PYQ Library",
        mcq: "MCQ Mock Test",
        performance: "My Performance"
    };

    alert(moduleNames[module] + " is coming soon!");
}
