-- Dropping existing tables
DROP TABLE IF EXISTS ITP;
DROP TABLE IF EXISTS PRISM;
DROP TABLE IF EXISTS TagKey;
DROP TABLE IF EXISTS Assigned;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Opportunities;
DROP TABLE IF EXISTS Teachers;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Tags;

-- Creating the Users table
CREATE TABLE Users (
  UserID int IDENTITY(1, 1),
  Password nvarchar(256), -- hashed
  Email nvarchar(256) UNIQUE,
  DateRegistered datetime,
  FullName nvarchar(256),
  Deleted int, -- 0(not deleted), 1(deleted)
  PRIMARY KEY (UserID)
);

-- Creating the Teachers table
CREATE TABLE Teachers (
  UserID int,
  Specialization nvarchar(256),
  PRIMARY KEY (UserID)
);

-- Creating the Students table
CREATE TABLE Students (
  StudentID char(7) NOT NULL UNIQUE,
  UserID int,
  ResumeLink nvarchar(256),
  Specialisation nvarchar(3),
  Citizenship nvarchar(64), -- Types include Singaporean, PR, Foreigner
  GPA float,
  ProjRank nvarchar(max),
  PRIMARY KEY (UserID),
  FOREIGN KEY (UserID) REFERENCES dbo.Users(UserID)
);

-- Creating the Opportunities table
CREATE TABLE Opportunities (
  OpportunityID int IDENTITY(1, 1),
  StartDate datetime,
  EndDate datetime,
  Deleted int, -- 0(not deleted), 1(deleted)
  Slots int,
  Description nvarchar(MAX),
  Specialisation varchar(3),
  TeacherID int,
  Company nvarchar(256),
  CitizenType nvarchar(256), -- Types include Singaporean/PR, All
  PRIMARY KEY (OpportunityID),
  FOREIGN KEY (TeacherID) REFERENCES dbo.Teachers(UserID)
);

-- Creating the ITP table
CREATE TABLE ITP (
  OpportunityID int NOT NULL,
  JobRole nvarchar(128),
  PRIMARY KEY (OpportunityID),
  FOREIGN KEY (OpportunityID) REFERENCES dbo.Opportunities(OpportunityID)
);

-- Creating the PRISM table
CREATE TABLE PRISM (
  OpportunityID int NOT NULL,
  TypeOfPrism nvarchar(256), -- RPA/Web Dev/...
  Title nvarchar(128),
  PRIMARY KEY (OpportunityID),
  FOREIGN KEY (OpportunityID) REFERENCES dbo.Opportunities(OpportunityID)
);

-- Creating the Tags table
CREATE TABLE Tags (
  TagID int IDENTITY(1, 1),
  TagName nvarchar(256),
  PRIMARY KEY (TagID)
);

-- Creating the TagKey table
CREATE TABLE TagKey (
  TagID int NOT NULL,
  StudentID char(7),
  OpportunityID int,
  FOREIGN KEY (TagID) REFERENCES dbo.Tags(TagID),
  FOREIGN KEY (StudentID) REFERENCES dbo.Students(StudentID),
  FOREIGN KEY (OpportunityID) REFERENCES dbo.Opportunities(OpportunityID)
);

CREATE TABLE Assigned (
	OpportunityID int,
	StudentID char(7),
	Comments nvarchar(256) NULL,
	PRIMARY KEY (StudentID),
	CONSTRAINT FK_OpportunityID FOREIGN KEY (OpportunityID) REFERENCES Opportunities(OpportunityID),
	CONSTRAINT FK_StudentID FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
);

-- Inserting sample data into Users table
INSERT INTO Users (Password, Email, DateRegistered, FullName, Deleted)
VALUES
('hashed_password_1', 'teacher1@example.com', '2024-01-01', 'Teacher One', 0),
('hashed_password_2', 'student1@example.com', '2024-01-02', 'Student One', 0),
('hashed_password_3', 'teacher2@example.com', '2024-01-03', 'Teacher Two', 0),
('hashed_password_4', 'student2@example.com', '2024-01-04', 'Student Two', 0),
('hashed_password_5', 'student3@example.com', '2024-01-04', 'Student Three', 0);

-- Inserting sample data into Teachers table
INSERT INTO Teachers (UserID, Specialization)
VALUES
(1, 'Computer Science'),
(3, 'Mathematics');

-- Inserting sample data into Students table
INSERT INTO Students (StudentID, UserID, ResumeLink, Specialisation, Citizenship, GPA, ProjRank)
VALUES
('S100001', 2, 'link_to_resume_1', 'CS', 'Singaporean', 3.5, '1,2,3'),
('S100002', 4, 'link_to_resume_2', 'ENG', 'PR', 3.8, '3,2,1'),
('S100003', 5, 'link_to_resume_2', 'ENG', 'Others', 3.8, '3,2,1');

-- Inserting sample data into Opportunities table
INSERT INTO Opportunities (StartDate, EndDate, Deleted, Slots, Description, Specialisation, TeacherID, Company, CitizenType)
VALUES
('2024-06-01', '2024-12-31', 0, 1, 'Software Development Internship', 'CS', 1, 'Tech Corp', 'All'),
('2024-07-01', '2024-11-30', 0, 1, 'Data Analysis Project', 'DA', 1, 'Data Inc', 'Singaporean/PR'),
('2024-05-15', '2024-10-15', 0, 4, 'Network Security Internship', 'IT', 3, 'SecureNet', 'All');

-- Inserting sample data into ITP table
INSERT INTO ITP (OpportunityID, JobRole)
VALUES
(1, 'Junior Software Developer'),
(2, 'Data Analyst Intern');

-- Inserting sample data into PRISM table
INSERT INTO PRISM (OpportunityID, TypeOfPrism, Title)
VALUES
(3, 'Web Development', 'Web Security Project');

-- Inserting sample data into Tags table
INSERT INTO Tags (TagName)
VALUES
('Software Development'),
('Data Analysis'),
('Network Security'),
('Web Development');

-- Inserting sample data into TagKey table
INSERT INTO TagKey (TagID, StudentID, OpportunityID)
VALUES
(1, 'S100001', 1),
(2, 'S100002', 2),
(3, 'S100001', 3);

INSERT INTO TagKey (TagID, StudentID)
VALUES
(2, 'S100003'),
(1, 'S100003');

-- Inserting sample data into Assigned table
INSERT INTO Assigned (OpportunityID, StudentID, Comments)
VALUES
-- (2, 'S100001', 'Assigned for summer internship'),
-- (1, 'S100002', 'Assigned for data project')