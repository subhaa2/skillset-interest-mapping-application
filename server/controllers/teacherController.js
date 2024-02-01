const teacherServices = require("../services/teacher");
const xlsx = require("xlsx");
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { Console } = require("console");
async function getAllITP(req, res) {
  try {
    const result = await teacherServices.getAllITP();
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function getAllPRISM(req, res) {
  try {
    const result = await teacherServices.getAllPRISM();
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function AllITPSummary(req, res) {
  try {
    const result = await teacherServices.AllITPSummary();
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function AllPRISMSummary(req, res) {
  try {
    const result = await teacherServices.AllPRISMSummary();
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function getAllStudents(req, res) {
  try {
    const result = await teacherServices.getAllStudents();
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function getStudent(req, res) {
  try {
    const id = req.params.id;
    const result = await teacherServices.getStudent(id);
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function bulkInsertStudents(req, res) {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const processedData = jsonData.map((row) => ({
      adminNo: row["AdminNo"],
      studentName: row["Student Name"],
      gpa: row["GPA"],
      specialization: row["Specialization"],
      password: row["Password"].toString(),
      citizenship: row["Citizenship"].toString(),
    }));
    
    console.log("PROCESSED")
    console.log(processedData)
    await teacherServices.bulkInsertStudentData(processedData);

    res
      .status(200)
      .json({ message: "Data processed and inserted successfully" });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function updateStudent(req, res) {
  try {
    const { StudentID, FullName, spec, gpa } = req.body;
    console.log(StudentID, FullName, spec, gpa);
    const result = await teacherServices.UpdateStudent(
      StudentID,
      FullName,
      spec,
      gpa,
    );

    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function getITPTable(req, res) {
  try {
    const result = await teacherServices.getITPTable();
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function getPRISMTable(req, res) {
  try {
    const result = await teacherServices.getPRISMTable();
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function updatePRISM(req, res) {
  try {
    const id = req.params.id;

    const {
      slots,
      type,
      title,
      teacher,
      specialisation,
      company,
      startDate,
      endDate,
      description,
    } = req.body;

    if (
      !id ||
      !slots ||
      !type ||
      !title ||
      !teacher ||
      !specialisation ||
      !company ||
      !startDate ||
      !endDate ||
      !description
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await teacherServices.UpdatePRISM(
      id,
      type,
      title,
      description,
      company,
      slots,
      teacher,
      specialisation,
      startDate,
      endDate,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateITP(req, res) {
  try {
    const id = req.params.id;

    const {
      company,
      role,
      description,
      slots,
      teacher,
      specialisation,
      startDate,
      endDate,
      citizenship
    } = req.body;

    if (
      !id ||
      !company ||
      !role ||
      !description ||
      !slots ||
      !teacher ||
      !specialisation ||
      !startDate ||
      !endDate ||
      !citizenship
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await teacherServices.UpdateITP(
      id,
      company,
      role,
      description,
      slots,
      teacher,
      specialisation,
      startDate,
      endDate,
      citizenship
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addPRISM(req, res) {
  try {
    const {
      slots,
      type,
      title,
      teacher,
      specialisation,
      company,
      startDate,
      endDate,
      description,
    } = req.body;

    if (
      !slots ||
      !type ||
      !title ||
      !teacher ||
      !specialisation ||
      !company ||
      !startDate ||
      !endDate ||
      !description
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await teacherServices.AddPRISM(
      slots,
      type,
      title,
      teacher,
      specialisation,
      company,
      startDate,
      endDate,
      description,
    );
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function addITP(req, res) {
  try {
    const {
      company,
      role,
      description,
      slots,
      teacher,
      specialisation,
      startDate,
      endDate,
    } = req.body;

    if (
      !company ||
      !role ||
      !description ||
      !slots ||
      !teacher ||
      !specialisation ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await teacherServices.AddITP(
      company,
      role,
      description,
      slots,
      teacher,
      specialisation,
      startDate,
      endDate,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function callPythonJobParser(pdfPath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "parseJobPDF/main.py");

    const args = [scriptPath, pdfPath];

    const pythonProcess = spawn("python", args);

    let outputData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python script error: ${data.toString()}`);
      reject(new Error(data.toString()));
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script finished with code ${code}`);
      if (code === 0) {
        try {
          console.log(outputData);
          const result = JSON.parse(outputData);

          if (!result) {
            reject(new Error("Failed to parse data from PDF"));
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

async function addITPPDF(req, res) {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      const zipFilePath = req.file.path;

      await fs.createReadStream(zipFilePath)
          .pipe(unzipper.Extract({ path: 'extracted' }))
          .promise();

      const extractedDir = 'extracted';
      const items = fs.readdirSync(extractedDir, { withFileTypes: true });

      let companies = [];

      for (const item of items) {
          const subDirPath = path.join(extractedDir, item.name);
          const subDirFiles = fs.readdirSync(subDirPath);

          for (const subFile of subDirFiles) {
              if (subFile.endsWith('.pdf')) {
                  const filePath = path.join(subDirPath, subFile);
                  try {
                      const result = await callPythonJobParser(filePath);

                      const companyData = {
                          companyName: result.company_info.CompanyName,
                          jobs: result.job_info.map(job => ({
                              jobName: job.JobName,
                              jobDetails: job.JobDetails,
                              intendedLearningOutcomes: job.IntendedLearningOutcomes,
                              preferredSkillSet: job.PreferredSkillSet,
                              slots: job.Slots
                          }))
                      };
                      companies.push(companyData);

                      fs.unlinkSync(filePath);
                  } catch (error) {
                      console.error(`Error processing ${subFile}:`, error);
                  }
              }
          }
      }

      for (const company of companies) {
        await insertCompanyAndJobs(company);
      }

      fs.unlinkSync(zipFilePath);

      res.status(200).json({ message: "ITP documents processed successfully", companies });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}

async function insertCompanyAndJobs(company) {
  try {
    console.log(company)

    for (const job of company.jobs) {
        await teacherServices.insertITP({
            JobRole: job.jobName || '',
            Slots: job.slots,
            Company: company.companyName,
            CitizenType: 'All',
            Description: job.jobDetails
        });
    }
  } catch (error) {
      console.error('Error inserting company and job data:', error);
      throw error;
  }
}

async function getSlots(req, res) {
  try {
    const id = req.params.id;

    const result = await teacherServices.getSlots(id);
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function EditAssign(req, res) {
  try {
    const opportunityID = req.params.id;
    const { newID, oldID } = req.body;
    const result = await teacherServices.EditAssign(
      newID,
      oldID,
      opportunityID,
    );
    res.status(200).json(result);
  } catch (err) {
    console.log("Error", err);
    res.status(500).send(err.message);
  }
}

async function deleteITP(req, res) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Missing required field" });
    }

    const result = await teacherServices.deleteITP(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletePRISM(req, res) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Missing required field" });
    }

    const result = await teacherServices.deletePRISM(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function beginMatching(req, res) {
  try {
    const result = await teacherServices.beginMatching();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllITP,
  getAllPRISM,
  AllITPSummary,
  AllPRISMSummary,
  getAllStudents,
  getStudent,
  bulkInsertStudents,
  updateStudent,
  getITPTable,
  getPRISMTable,
  updatePRISM,
  updateITP,
  addITP,
  addITPPDF,
  addPRISM,
  getSlots,
  EditAssign,
  deleteITP,
  deletePRISM,
  beginMatching,
};