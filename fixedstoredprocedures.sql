USE [SIMAppDB]
drop procedure if exists dbo.[AddITP];
drop procedure if exists dbo.[AddPRISM];
drop procedure if exists dbo.[AddStudent];
drop procedure if exists dbo.[AllPRISMSummary];
drop procedure if exists dbo.[Assign];
drop procedure if exists dbo.[DeleteOldStudentTags];
drop procedure if exists dbo.[DelITP];
drop procedure if exists dbo.[DelPrism];
drop procedure if exists dbo.[EditAssign];
drop procedure if exists dbo.[EnsureTagExists];
drop procedure if exists dbo.[GetAllITP];
drop procedure if exists dbo.[GetAllPRISM];
drop procedure if exists dbo.[GetAllSpecialisation];
drop procedure if exists dbo.[GetAllStudents];
drop procedure if exists dbo.[GetAllTeachers];
drop procedure if exists dbo.[GetAllUsers];
drop procedure if exists dbo.[GetSlots];
drop procedure if exists dbo.[GetStudent];
drop procedure if exists dbo.[getStudentTags];
drop procedure if exists dbo.[RemoveOpportunity];
drop procedure if exists dbo.[UnAssign];
drop procedure if exists dbo.[UpdateITP];
drop procedure if exists dbo.[UpdatePRISM];
drop procedure if exists dbo.[UpdateStudent];
drop procedure if exists dbo.[UpdateTags];
drop procedure if exists dbo.[Allitpsummary];
drop procedure if exists dbo.[Updatestudentags];

go
/****** Object:  StoredProcedure [dbo].[AddITP]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON 

go 

SET quoted_identifier ON 

go 

CREATE PROCEDURE [dbo].[Additp] (@StartDate      DATETIME, 
                                 @EndDate        DATETIME, 
                                 @Slots          INT, 
                                 @Description    NVARCHAR(MAX), 
                                 @Specialisation VARCHAR(3), 
                                 @TeacherName    NVARCHAR(256), 
                                 @Company        NVARCHAR(256), 
                                 @CitizenType    NVARCHAR(256), 
                                 @JobRole        NVARCHAR(128)) 
AS 
  BEGIN 
      SET nocount ON 
      SET xact_abort ON; 

      BEGIN try 
          BEGIN TRANSACTION; 

          IF NOT EXISTS (SELECT * 
                         FROM   users, 
                                teachers 
                         WHERE  users.userid = teachers.userid 
                                AND users.fullname LIKE '%' + @TeacherName + '%' 
                        ) 
            BEGIN 
                RAISERROR ('Teacher not found',16,1); 

                RETURN; 
            END 

          INSERT INTO opportunities 
                      (startdate, 
                       enddate, 
                       deleted, 
                       slots, 
                       description, 
                       specialisation, 
                       teacherid, 
                       company, 
                       citizentype) 
          SELECT @StartDate, 
                 @EndDate, 
                 0, 
                 @Slots, 
                 @Specialisation, 
                 @Description, 
                 users.userid, 
                 @Company, 
                 @CitizenType 
          FROM   users, 
                 teachers 
          WHERE  users.userid = teachers.userid 
                 AND users.fullname LIKE '%' + @TeacherName + '%' 

          INSERT INTO itp 
                      (opportunityid, 
                       jobrole) 
          SELECT Scope_identity(), 
                 @JobRole 

          COMMIT TRANSACTION; 
      END try 

      BEGIN catch 
          ROLLBACK TRANSACTION; 

          THROW 
      END catch 
  END 

go 
/****** Object:  StoredProcedure [dbo].[AddPRISM]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[AddStudent]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[AddTeacher]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[AllITPSummary]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Allitpsummary]
AS
  BEGIN
      SET nocount ON

      SELECT o.OpportunityID,
             o.Company,
             i.JobRole,
             u1.FullName,
             s.StudentID,
             u2.fullname AS StudName
	FROM   dbo.Students s
	INNER JOIN dbo.users u2
	ON u2.userID = s.userID
	LEFT JOIN dbo.Assigned a
	ON a.StudentID = s.StudentID
	LEFT JOIN dbo.Opportunities o
	ON o.OpportunityID = a.OpportunityID AND o.deleted = 0
	LEFT JOIN dbo.Users u1
	ON u1.UserID = o.TeacherID
	LEFT JOIN dbo.ITP i
	ON i.OpportunityID = o.OpportunityID
  END

go
/****** Object:  StoredProcedure [dbo].[AllPRISMSummary]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[Assign]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[DeleteOldStudentTags]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Deleteoldstudenttags] @StudentID CHAR(7)
AS
  BEGIN
      SET nocount ON;

      -- Delete associations not in the new list
      DELETE FROM dbo.tagkey
      WHERE  studentid = @StudentID;
  END

go
/****** Object:  StoredProcedure [dbo].[DelITP]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Delitp] (@OpportunityID INT)
AS
  BEGIN
      SET nocount ON;
      SET xact_abort ON;

      BEGIN try
          BEGIN TRANSACTION;


          DELETE FROM itp
          WHERE  opportunityid = @OpportunityID;

          DELETE FROM TagKey
          WHERE opportunityID = @OpportunityID;

          DELETE FROM Assigned
          WHERE opportunityID = @OpportunityID;

          DELETE FROM opportunities
          WHERE  opportunityid = @OpportunityID;



          COMMIT TRANSACTION;
      END try

      BEGIN catch
          ROLLBACK TRANSACTION;

          THROW;
      END catch
  END

go
/****** Object:  StoredProcedure [dbo].[DelPRISM]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[EditAssign]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[EnsureTagExists]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Ensuretagexists] @TagName NVARCHAR(256)
AS
  BEGIN
      SET nocount ON

      DECLARE @TagID INT;

      SELECT @TagID = tagid
      FROM   dbo.tags
      WHERE  tagname = @TagName;

      IF @TagID IS NULL
        BEGIN
            INSERT INTO dbo.tags
                        (tagname)
            VALUES      (@TagName);

            SET @TagID = Scope_identity();
        END

      SELECT @TagID AS TagID;
  END

go
/****** Object:  StoredProcedure [dbo].[GetAllITP]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Getallitp]
AS
  BEGIN
      SET nocount ON

       SELECT DISTINCT O.opportunityid  AS opportunityID,
             O.company        AS company,
             I.jobrole        AS role,
             O.description    AS description,
             O.teacherid      AS teacherInCharge,
             U.fullname       AS teacher,
             O.specialisation AS specialisation,
             O.startdate      AS startDate,
             O.enddate        AS endDate,
             O.slots          AS slots,
             O.citizentype    AS citizentype
      FROM   opportunities O
             INNER JOIN itp I
                     ON O.opportunityid = I.opportunityid
             LEFT JOIN teachers T
                     ON O.teacherid = T.userid
             LEFT JOIN users U
                     ON U.userid = T.userid
             LEFT JOIN assigned A
                    ON O.opportunityid = A.opportunityid
             LEFT JOIN students S
                    ON A.studentid = S.studentid
      WHERE  O.deleted = 0
  END

go 
/****** Object:  StoredProcedure [dbo].[GetAllPRISM]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[GetAllSpecialisation]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Getallspecialisation]
AS
  BEGIN
      SET nocount ON;

      SELECT DISTINCT O.Specialisation
      FROM   dbo.opportunities O
  END

go
/****** Object:  StoredProcedure [dbo].[GetAllStudents]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Getallstudents]
AS
  BEGIN
      SET nocount ON

      SELECT s.StudentID,
             u.FullName,
             s.ResumeLink,
             s.Specialisation,
             s.GPA,
             s.Citizenship
      FROM   dbo.students s,
             dbo.users u
      WHERE  s.userid = u.userid
             AND u.deleted = 0
  END

go
/****** Object:  StoredProcedure [dbo].[GetAllTeachers]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Getallteachers]
AS
  BEGIN
      SET nocount ON;

      SELECT T.userid         AS id,
             U.fullname       AS fullName,
             T.specialization AS specialisation
      FROM   dbo.teachers T,
             dbo.users U
      WHERE  T.userid = U.userid
  END

go
/****** Object:  StoredProcedure [dbo].[GetAllUsers]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[GetSlots]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Getslots](@OpportunityID INT)
AS
  BEGIN
      SET nocount ON

      DECLARE @Filled INT,
              @Total  INT;

      SET @Filled = (SELECT Count(a.opportunityid)
                     FROM   dbo.assigned a
                     WHERE  a.opportunityid = @OpportunityID);
      SET @Total = (SELECT o.slots
                    FROM   dbo.opportunities o
                    WHERE  o.opportunityid = @OpportunityID)

      SELECT @Filled AS FilledSlots,
             @Total  AS TotalSlots
  END

go
/****** Object:  StoredProcedure [dbo].[GetStudent]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Getstudent](@StudID CHAR(7))
AS
  BEGIN
      SET nocount ON

      SELECT s.studentid,
             u.fullname,
             s.resumelink,
             s.specialisation,
             s.gpa,
             s.citizenship,
             s.projrank,
             o.description,
             o.startdate,
             o.enddate,
             o.slots,
             o.company,
             o.citizentype,
             t.specialization AS TeacherSpecialization
      FROM   dbo.students s
             INNER JOIN dbo.users u
                     ON s.userid = u.userid
             LEFT JOIN dbo.assigned a
                    ON s.studentid = a.studentid
             LEFT JOIN dbo.opportunities o
                    ON a.opportunityid = o.opportunityid
             LEFT JOIN dbo.teachers t
                    ON o.teacherid = t.userid
             LEFT JOIN dbo.itp i
                    ON o.opportunityid = i.opportunityid
      WHERE  s.studentid = @StudID
  END

go
/****** Object:  StoredProcedure [dbo].[getStudentTags]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Getstudenttags](@StudID CHAR(7))
AS
  BEGIN
      SET nocount ON

      SELECT t.tagid,
             t.tagname
      FROM   dbo.tags t
             INNER JOIN dbo.tagkey tk
                     ON t.tagid = tk.tagid
      WHERE  tk.studentid = @StudID;
  END

go
/****** Object:  StoredProcedure [dbo].[RemoveOpportunity]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Removeopportunity](@OpportunityID INT)
AS
  BEGIN
      SET nocount ON

      UPDATE dbo.opportunities
      SET    deleted = 1
      WHERE  opportunityid = @OpportunityID;
  END

go
/****** Object:  StoredProcedure [dbo].[UnAssign]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[UpdateITP]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Updateitp] (@OpportunityID  INT,
                                    @StartDate      DATETIME,
                                    @EndDate        DATETIME,
                                    @Slots          INT,
                                    @Description    NVARCHAR(MAX),
                                    @Specialisation VARCHAR(3),
                                    @TeacherName    NVARCHAR(256),
                                    @Company        NVARCHAR(256),
                                    @CitizenType    NVARCHAR(256),
                                    @JobRole        NVARCHAR(128))
AS
  BEGIN
      SET nocount ON;
      SET xact_abort ON;

      BEGIN try
          BEGIN TRANSACTION;

          UPDATE O
          SET    O.startdate = @StartDate,
                 O.enddate = @EndDate,
                 O.deleted = 0,
                 O.slots = @Slots,
                 O.description = @Description,
                 O.specialisation = @Specialisation,
                 O.teacherid = T.userid,
                 O.company = @Company,
                 O.citizentype = @CitizenType
          FROM   opportunities O,
                 teachers T,
                 itp I,
                 users U
          WHERE  U.fullname LIKE '%' + @TeacherName + '%'
                 AND O.opportunityid = I.opportunityid
                 AND U.userid = T.userid
                 AND O.opportunityid = @OpportunityID

          UPDATE I
          SET    I.jobrole = @JobRole
          FROM   itp I
          WHERE  I.opportunityid = @OpportunityID;

          COMMIT TRANSACTION;
      END try

      BEGIN catch
          ROLLBACK TRANSACTION;

          THROW;
      END catch
  END

go
/****** Object:  StoredProcedure [dbo].[UpdatePRISM]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[UpdateStudent]    Script Date: 24/1/2024 5:01:36 pm ******/
/****** Object:  StoredProcedure [dbo].[UpdateStudentTags]    Script Date: 24/1/2024 5:01:36 pm ******/
SET ansi_nulls ON

go

SET quoted_identifier ON

go

CREATE PROCEDURE [dbo].[Updatestudentags] @StudentID CHAR(7),
                                           @TagID     INT
AS
  BEGIN
      SET nocount ON;

      IF NOT EXISTS (SELECT *
                     FROM   dbo.tagkey
                     WHERE  studentid = @StudentID
                            AND tagid = @TagID)
        BEGIN
            INSERT INTO dbo.tagkey
                        (studentid,
                         tagid)
            VALUES      (@StudentID,
                         @TagID);
        END
  END

go
/****** Object:  StoredProcedure [dbo].[UpdateTableCol]    Script Date: 24/1/2024 5:01:36 pm ******/
-- yay