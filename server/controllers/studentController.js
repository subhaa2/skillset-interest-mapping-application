const student = require("../services/student");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// async function updateStudent(req, res) {
//   try {
//     const result = await student.updateStudent();
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// }

function callPythonScript(functionName, text, pdfPath) {
  return new Promise((resolve, reject) => {
    // path to python script
    const scriptPath = path.join(__dirname, "tagExtractionPythonSpawn/main.py");

    // argument list for python func calls
    const args = [scriptPath, "--function", functionName];
    if (text) args.push("--text", text);
    if (pdfPath) args.push("--pdf", pdfPath);

    // spawn python process, run python code
    const pythonProcess = spawn("python", args);

    let outputData = "";

    // listens to when python outputs data
    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    // listens for errors
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python script error: ${data.toString()}`);
      reject(new Error(data.toString()));
    });

    // close event for script
    pythonProcess.on("close", (code) => {
      console.log(`Python script finished with code ${code}`);
      if (code === 0) {
        try {
          console.log(outputData);
          // parseData returns a string JSON
          outputData = outputData.replace(/'/g, '"');
          const result = JSON.parse(outputData);

          if (!result) {
            reject(new Error("Failed to parse tags from string"));
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
}

async function updateStudentData(studentID, projectRankings, tags) {
  try {
    await student.updateStudentProjectRankings(studentID, projectRankings);
    const tagIDs = await student.ensureTagsExist(tags);
    await student.updateStudentTagAssociations(studentID, tagIDs);
    console.log("Student data updated successfully.");
  } catch (error) {
    console.error("Error updating student data:", error);
  }
}

async function handleSubmitForm(req, res) {
  try {
    const resume = req.file;
    console.log(resume);
    // change file name to original name, replace upload if alr exists
    const { codingLanguages, projectInterests, frameworks, interests } =
      JSON.parse(req.body.data);

    let languagesAndFrameworks = [];
    for (const [key, value] of Object.entries(codingLanguages)) {
      if (key !== "others" && value) {
        languagesAndFrameworks.push(key);
      } else if (key === "others" && value.trim() !== "") {
        languagesAndFrameworks.push(value);
      }
    }
    for (const [key, value] of Object.entries(frameworks)) {
      if (key !== "others" && value) {
        languagesAndFrameworks.push(key);
      } else if (key === "others" && value.trim() !== "") {
        languagesAndFrameworks.push(value);
      }
    }
    languagesAndFrameworks = languagesAndFrameworks.join(", ");

    let interestsString = interests;
    // sort by rank
    let sortedAndFormattedProjectInterests = projectInterests
      .filter((item) => item.rank)
      .sort((a, b) => a.rank - b.rank)
      .map((item) => `${item.name} - ${item.rank}`);

    // combine interests with project interests
    let combinedInterests = [
      interestsString,
      ...sortedAndFormattedProjectInterests,
    ].join(", ");

    const languagesAndFrameworksTags = await callPythonScript(
      "processTagsForLangsAndFrameworks",
      languagesAndFrameworks,
      "",
    );
    const companyInterestsTags = await callPythonScript(
      "processTagsForCompanies",
      combinedInterests,
      "",
    );

    tags = languagesAndFrameworksTags.concat(companyInterestsTags);

    let studentID = "212877z";
    console.log("final: " + sortedAndFormattedProjectInterests);
    console.log(tags);
    updateStudentData(studentID, sortedAndFormattedProjectInterests, tags);
  } catch (err) {
    console.log("Error in handleSubmitForm:", err);
    res.status(500).send(err.message);
  }
}

module.exports = {
  // updateStudent,
  handleSubmitForm,
};
