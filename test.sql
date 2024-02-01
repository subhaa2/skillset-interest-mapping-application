
    let studentQuery = `
    INSERT INTO Students (StudentID, GPA, Specialisation)
    VALUES ('${student.adminNo}', ${student.gpa}, '${student.specialization}')`;
    let userQuery = `
    INSERT INTO Users (FullName, Email, DateRegistered, Deleted, Password)
    VALUES ('${student.studentName}', '${student.adminNo}@mymail.nyp.edu.sg', GETDATE(), 0, '${pw}')`;



BEGIN TRANSACTION [T1]
    BEGIN TRY
        INSERT INTO Users (Password, Email, DateRegistered, FullName, Deleted)
        VALUES ('${pw}', '${student.adminNo}@mymail.nyp.edu.sg', GETDATE(), '${student.studentName}', 0);

        INSERT INTO Students (StudentID, UserID, Specialisation, GPA)
        VALUES ('${student.adminNo}', Scope_identity(), '${student.specialization}', '${student.gpa}');
        COMMIT TRANSACTION [T1]
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION [T1]
    END CATCH