const dbConfig = require("../config/dbConfig");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const {
  getMatching,
} = require("../controllers/matchingController");

async function getAllStudents() {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC GetAllStudents");
  connection.close();
  return result;
}

async function getStudent(id) {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC GetStudent(" + id + ")");
  connection.close();
  return result;
}

async function UpdateStudent(StudentID, FullName, Specialisation, GPA) {
  const connection = await dbConfig.connectDB();
  try {
    const query = `
    UPDATE S
    SET 
      S.Specialisation = '${Specialisation}',
      S.GPA = '${GPA}'
    FROM users U, students S
    WHERE S.StudentID = '${StudentID}' AND U.userid = S.userid;

    UPDATE U
    SET 
      U.FullName = '${FullName}'
    FROM users U, students S
    WHERE S.StudentID = '${StudentID}' AND U.userid = S.userid;
    `;
    const result = await connection.query(query);
    return result;
  } catch (err) {
    console.error("Error in UpdateStudent", err);
    throw err;
  } finally {
    connection.close();
  }
}

async function Assign(Studid, OppID, comments) {
  const connection = await dbConfig.connectDB();
  const result = await connection.query(
    "EXEC Assign(" + Studid + "," + OppID + "," + comments + ")",
  );
  connection.close();
  return result;
}

async function EditAssign(newID, oldID, opportunityID) {
  try {
    const connection = await dbConfig.connectDB();
    let sql = "";
    if (!newID && oldID) {
      sql = `DELETE FROM Assigned WHERE StudentID = '${oldID}'`;
    } else if (newID && !oldID) {
      sql = `INSERT INTO Assigned (OpportunityID, StudentID) VALUES ('${opportunityID}','${newID}')`;
    } else if (newID && oldID) {
      sql = `UPDATE Assigned SET StudentID = '${newID}' WHERE StudentID = '${oldID}'`;
    }

    let result = null;
    if (sql !== "") {
      result = await connection.query(sql);
    }

    connection.close();
    return result;
  } catch (error) {
    console.error("Error in EditAssign: ", error);
    throw error;
  }
}

async function UnAssign(Studid) {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC UnAssign(" + Studid + ")");
  connection.close();
  return result;
}

async function getAllPRISM() {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC GetAllPRISM");
  connection.close();
  return result;
}

async function AllPRISMSummary() {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC AllPRISMSummary");
  connection.close();
  return result;
}

async function AddPRISM(
  slots,
  type,
  title,
  teacher,
  specialisation,
  company,
  startDate,
  endDate,
  description,
) {
  let connection;

  try {
    const connection = await dbConfig.connectDB(); // Ensure proper connection handling
    const request = new sql.Request(connection);

    // Prevent SQL Injection
    request.input("PRISMType", sql.NVarChar(50), type);
    request.input("PRISMTitle", sql.NVarChar(50), title);
    request.input("PRISMDescription", sql.NVarChar(sql.MAX), description);
    request.input("PRISMCompany", sql.NVarChar(50), company);
    request.input("OpportunitiesSlots", sql.Int, slots);
    request.input("OpportunitiesTeacher", sql.NVarChar(50), teacher);
    request.input("OpportunitiesSpecialisation", sql.Char(3), specialisation);
    request.input("OpportunitiesStartDate", sql.DateTime, new Date(startDate));
    request.input("OpportunitiesEndDate", sql.DateTime, new Date(endDate));

    const result = await request.execute("AddPRISM");
    return result;
  } catch (error) {
    console.error("Error in AddPRISM:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function getAllITP() {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC GetAllITP");
  connection.close();
  return result;
}

async function AllITPSummary() {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC AllITPSummary");
  connection.close();
  return result;
}

async function AddITP(
  company,
  role,
  description,
  slots,
  teacher,
  specialisation,
  startDate,
  endDate,
) {
  let connection;

  try {
    const connection = await dbConfig.connectDB();
    const request = new sql.Request(connection);

    request.input("StartDate", sql.DateTime, new Date(startDate));
    request.input("EndDate", sql.DateTime, new Date(endDate));
    request.input("Slots", sql.Int, slots);
    request.input("Description", sql.NVarChar(sql.MAX), description);
    request.input("Specialisation", sql.VarChar(3), specialisation);
    request.input("Teacher", sql.NVarChar(256), teacher);
    request.input("Company", sql.NVarChar(256), company);
    request.input("JobRole", sql.NVarChar(128), role);

    const result = await request.execute("AddITP");
    return result;
  } catch (error) {
    console.error("Error in AddITP:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function getSlots(id) {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC GetSlots(" + id + ")");
  connection.close();
  return result;
}

async function getITPTable() {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("EXEC GetALLITP");
  connection.close();
  return result;
}

async function getPRISMTable() {
  const connection = await dbConfig.connectDB();
  const result = await connection.query("SELECT * FROM dbo.PRISM");
  connection.close();
  return result;
}
async function UpdatePRISM(
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
) {
  let connection;
  try {
    const connection = await dbConfig.connectDB(); // Ensure proper connection handling
    const request = new sql.Request(connection);

    // Prevent SQL Injection
    request.input("PRISMOpportunityID", sql.Char(5), id);
    request.input("PRISMType", sql.NVarChar(50), type);
    request.input("PRISMTitle", sql.NVarChar(50), title);
    request.input("PRISMDescription", sql.NVarChar(sql.MAX), description);
    request.input("PRISMCompany", sql.NVarChar(50), company);
    request.input("OpportunitiesSlots", sql.Int, slots);
    request.input("OpportunitiesTeacher", sql.NVarChar(50), teacher);
    request.input("OpportunitiesSpecialisation", sql.Char(3), specialisation);
    request.input("OpportunitiesStartDate", sql.DateTime, new Date(startDate));
    request.input("OpportunitiesEndDate", sql.DateTime, new Date(endDate));

    const result = await request.execute("UpdatePRISM");
    return result;
  } catch (error) {
    console.error("Error in UpdatePRISM:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function UpdateITP(
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
) {
  let connection;
  try {
    const connection = await dbConfig.connectDB();
    const request = new sql.Request(connection);

    request.input("OpportunityID", sql.Int, id);
    request.input("StartDate", sql.DateTime, new Date(startDate));
    request.input("EndDate", sql.DateTime, new Date(endDate));
    request.input("Slots", sql.Int, slots);
    request.input("Description", sql.NVarChar(sql.MAX), description);
    request.input("Specialisation", sql.VarChar(3), specialisation);
    request.input("TeacherName", sql.NVarChar(256), teacher);
    request.input("Company", sql.NVarChar(256), company);
    request.input("JobRole", sql.NVarChar(128), role);
    request.input("CitizenType", sql.NVarChar(256), citizenship);

    console.log("AAAAAA")
    console.log(citizenship)
    console.log(request)
    const result = await request.execute("UpdateITP");
    return result;
  } catch (error) {
    console.error("Error in UpdateITP:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function deleteITP(id) {
  let connection;
  try {
    const connection = await dbConfig.connectDB();
    const request = new sql.Request(connection);

    request.input("OpportunityID", sql.Int, id);

    const result = await request.execute("DelITP");
    return result;
  } catch (error) {
    console.error("Error in DelITP:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function deletePRISM(id) {
  let connection;
  try {
    const connection = await dbConfig.connectDB();
    const request = new sql.Request(connection);

    request.input("OpportunityID", sql.Char(5), id.toString());

    const result = await request.execute("DELPrism");
    return result;
  } catch (error) {
    console.error("Error in DelITP:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function bulkInsertStudentData(studentData) {
  const connection = await dbConfig.connectDB();

  try {
    for (const student of studentData) {
      let pw = await bcrypt.hash(student.password, 5);
      let q = `
        BEGIN TRANSACTION [T1]
        BEGIN TRY
            INSERT INTO Users (Password, Email, DateRegistered, FullName, Deleted)
            VALUES ('${pw}', '${student.adminNo}@mymail.nyp.edu.sg', GETDATE(), '${student.studentName}', 0);

            INSERT INTO Students (StudentID, UserID, Specialisation, GPA, Citizenship)
            VALUES ('${student.adminNo}', Scope_identity(), '${student.specialization}', '${student.gpa}', '${student.citizenship}');
            COMMIT TRANSACTION [T1]
        END TRY
        BEGIN CATCH
            ROLLBACK TRANSACTION [T1]
        END CATCH
      `;

      await connection.query(q);
    }

    return { message: "All students inserted successfully" };
  } catch (err) {
    console.error("Error during database operation", err);
    throw err;
  } finally {
    connection.close();
  }
}

async function beginMatching() {
  const connection = await dbConfig.connectDB();

  try {
    const studentQueryResults = await connection.query(`
    SELECT 
      s.StudentID, 
      s.Specialisation, 
      s.Citizenship, 
      s.GPA, 
      STRING_AGG(t.TagName, ', ') AS Tags
    FROM 
      Students s
    JOIN 
      TagKey tk ON s.StudentID = tk.StudentID
    JOIN 
      Tags t ON tk.TagID = t.TagID
    GROUP BY 
      s.StudentID, s.Specialisation, s.Citizenship, s.GPA;
    `);
    const students = studentQueryResults.recordset.map((student) => ({
      admin_number: student.StudentID,
      specialization: student.Specialisation,
      citizenship: student.Citizenship,
      gpa: student.GPA,
      tags: student.Tags.split(", "),
    }));

    const internshipQueryResults = await connection.query(`
    SELECT
      i.OpportunityID, 
      i.JobRole, 
      STRING_AGG(t.TagName, ', ') AS Tags, 
      o.CitizenType, 
      o.Slots AS Vacancies
    FROM 
      ITP i
    JOIN 
      Opportunities o ON i.OpportunityID = o.OpportunityID
    JOIN 
      TagKey tk ON o.OpportunityID = tk.OpportunityID
    JOIN 
      Tags t ON tk.TagID = t.TagID
    WHERE 
      o.Deleted = 0
    GROUP BY 
      i.OpportunityID, i.JobRole, o.CitizenType, o.Slots;
    `);
    
    const internships = internshipQueryResults.recordset.map((internship) => ({
      opportunity_id: internship.OpportunityID,
      job_role: internship.JobRole,
      tags: internship.Tags.split(", "),
      citizen_type: internship.CitizenType,
      vacancies: internship.Vacancies,
    }));

    const matchResults = await getMatching(students, internships);

    console.log("matching results")
    console.log(matchResults)

    const deleteQuery = `DELETE FROM Assigned`;
    await connection.query(deleteQuery);

    for (const match of matchResults) {
      q = `
        INSERT INTO Assigned (OpportunityID, StudentID) 
        VALUES (${match.opportunityId}, '${match.studentId}');
      `;
      await connection.query(q)
    }
    return {
      message: "Matching process completed successfully"
    };
  } catch (err) {
    console.error("Error during the matching process", err);
    throw err;
  } finally {
    connection.close();
  }
}

async function insertITP(data) {
  const connection = await dbConfig.connectDB();

  try {
    let query = `
    BEGIN TRANSACTION [T1]
    BEGIN TRY
        INSERT INTO Opportunities (Deleted, Slots, Description, Company, CitizenType)
        VALUES (0, ${data.Slots}, '${data.Description || ''}', '${data.Company}', '${data.CitizenType}');

        INSERT INTO ITP (OpportunityID, JobRole) VALUES (Scope_identity(), '${data.JobRole}');
        COMMIT TRANSACTION [T1]
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION [T1]
    END CATCH
    `;
    console.log(query)
    const result = await connection.query(query);
    return { message: "Opportunity inserted successfully" };
  } catch (err) {
    console.error("Error during database operation", err);
    throw err;
  } finally {
    connection.close();
  }
}

module.exports = {
  getAllStudents,
  getStudent,
  UpdateStudent,
  Assign,
  EditAssign,
  UnAssign,
  getAllPRISM,
  AllPRISMSummary,
  AddPRISM,
  getSlots,
  getAllITP,
  AllITPSummary,
  AddITP,
  getSlots,
  getITPTable,
  getPRISMTable,
  UpdatePRISM,
  UpdateITP,
  deleteITP,
  deletePRISM,
  bulkInsertStudentData,
  beginMatching,
  insertITP
  // insertIntoOpportunities,
  // insertIntoITP
};
