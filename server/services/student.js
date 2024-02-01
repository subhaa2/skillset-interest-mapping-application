const dbConfig = require("../config/dbConfig");

async function updateStudentProjectRankings(studentID, projectRankings) {
  try {
    const connection = await dbConfig.connectDB();

    const sql = `UPDATE dbo.Students SET ProjRank = '${projectRankings}' WHERE StudentID = '${studentID}'`;
    await connection.query(sql);

    console.log(
      "Project rankings updated successfully for student:",
      studentID,
    );
    connection.close();
  } catch (error) {
    console.error("Error in updateStudentProjectRankings:", error);
    throw error;
  }
}

async function storeResumePath(studentID, resumePath) {
  try {
    const connection = await dbConfig.connectDB();

    const sql = `UPDATE dbo.Students SET ResumeLink = '${resumePath}' WHERE StudentID = '${studentID}'`;
    await connection.query(sql);

    console.log("Resume path updated successfully for student:", studentID);
    connection.close();
  } catch (error) {
    console.error("Error in storeResumePath:", error);
    throw error;
  }
}

async function ensureTagsExist(tags) {
  const connection = await dbConfig.connectDB();
  let tagIDs = [];
  for (const tag of tags) {
    let result = await connection.query(
      'EXEC EnsureTagExists @TagName = "' + tag + '"',
    );
    tagIDs.push(result.recordset[0].TagID);
  }
  connection.close();
  return tagIDs;
}

async function getExistingStudentTagAssociations(studentID) {
  const connection = await dbConfig.connectDB();
  const result = await connection.query(
    "EXEC GetStudentTags @StudentID = " + studentID,
  );
  connection.close();
  return result;
}

async function updateStudentTagAssociations(studentID, tagIDs) {
  const connection = await dbConfig.connectDB();
  await connection.query(
    'EXEC DeleteOldStudentTags @StudentID = "' + studentID + '"',
  );
  for (const tagID of tagIDs) {
    await connection.query(
      'EXEC UpdateStudentTags @StudentID = "' +
        studentID +
        '", @TagID = ' +
        tagID,
    );
  }
  connection.close();
}

module.exports = {
  updateStudentProjectRankings,
  storeResumePath,
  ensureTagsExist,
  getExistingStudentTagAssociations,
  updateStudentTagAssociations,
};
