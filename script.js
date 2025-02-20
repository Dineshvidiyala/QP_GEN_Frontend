// const backendUrl = "http://localhost:5000";
const backendUrl = "https://qp-gen.onrender.com";


/**
 * 📌 Function to Upload File and Convert to JSON
 */
async function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let uploadStatus = document.getElementById("uploadStatus");

    if (!fileInput.files.length) {
        alert("Please select a file!");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    uploadStatus.innerText = "Uploading... ⏳";

    try {
        let response = await fetch(`${backendUrl}/upload`, {
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (response.ok) {
            uploadStatus.innerText = `✅ ${result.message} (${result.totalQuestions} questions)`;
            console.log("✅ Upload Successful:", result);
        } else {
            uploadStatus.innerText = `❌ Upload failed! ${result.error}`;
            console.error("❌ Backend Error:", result.error);
        }
    } catch (error) {
        uploadStatus.innerText = "❌ Network Error! Could not upload file.";
        console.error("❌ Network Error:", error);
    }
}

/**
 * 📌 Function to Generate Mid 1 / Mid 2 Question Paper
 */
async function generateQuestions(mid) {
    let outputTable = document.getElementById("outputTable");

    if (!outputTable) {
        console.error("❌ Error: Table with ID 'output' not found!");
        return;
    }

    outputTable.innerHTML = "<tr><td colspan='4'>⏳ Generating questions...</td></tr>";

    try {
        let response = await fetch(`${backendUrl}/generate?mid=${mid}`);
        let data = await response.json();

        if (!response.ok || data.length === 0) {
            outputTable.innerHTML = "<tr><td colspan='4'>❌ No questions found!</td></tr>";
            console.error("❌ API Error:", data);
            return;
        }

        console.log("✅ Questions Fetched:", data);

        // Clear old data and add table headers
        outputTable.innerHTML = `
            <tr>
                <th>S.No</th>
                <th>Question</th>
                <th>Unit</th>
                <th>B.T Level</th>
            </tr>
        `;

        // Populate table with questions
        data.forEach((q, index) => {
            let row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${q.Question || "❌ Missing"}</td>
                    <td>${q.Unit || "❌ Missing"}</td>
                    <td>${q["B.T Level"] || "❌ Missing"}</td>
                </tr>
            `;
            outputTable.innerHTML += row;
        });

    } catch (error) {
        outputTable.innerHTML = "<tr><td colspan='4'>❌ Network Error! Could not fetch questions.</td></tr>";
        console.error("❌ Network Error:", error);
    }
}
