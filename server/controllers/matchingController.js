const { spawn } = require('child_process');
const path = require('path');

function callPythonScript(students, internships) {
  return new Promise((resolve, reject) => {
    console.log(students)
    console.log(internships)
    const studentDataStr = JSON.stringify(students).replaceAll(`"`, `\\"`);
    const internshipDataStr = JSON.stringify(internships).replaceAll(`"`, `\\"`);

    const scriptPath = path.join(__dirname, 'matchingAlgorithm/match_students.py');
    const scriptCommand = `python ${scriptPath} "${studentDataStr}" "${internshipDataStr}"`;
    console.log(scriptCommand)
    const pythonProcess = spawn(scriptCommand, { shell: true });


    let outputData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data.toString()}`);
      reject(new Error(data.toString()));
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(outputData);
          resolve(result);
        } catch (error) {
          reject(new Error('Failed to parse output from Python script'));
        }
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
}

async function getMatching(students, internships) {
  try {
    const result = await callPythonScript(students, internships);

    return Object.entries(result).map(([studentId, opportunityId]) => ({
      studentId,
      opportunityId
    }));
  } catch (error) {
    console.error('Error in handleMatchingAndUpdate:', error);
    throw error;
  }
}


module.exports = {
  getMatching,
};
