const express = require("express");
const router = express.Router();
const teacherController = require("../../controllers/teacherController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/getAllITP", teacherController.getAllITP);
//gets all for summary table

router.get("/prism/", teacherController.getAllPRISM);
//gets all for summary table

router.get("/AllITPSummary", teacherController.AllITPSummary);
//gets all for summary table

router.get("/AllPRISMSummary", teacherController.AllPRISMSummary);
//gets all for summary table

router.get("/getAllStudents", teacherController.getAllStudents);
//gets all for summary table

router.get("/getITPTable", teacherController.getITPTable);
//does a SELECT * from dbo.ITP

router.get("/getPRISMTable", teacherController.getPRISMTable);
//does a SELECT * from dbo.PRISM

router.get("/getStudent/:id", teacherController.getStudent);
//gets Student by StudentID

router.get("/:id/getslots", teacherController.getSlots);
//uses opportunity id to getSlots

router.put("/prism/:id", teacherController.updatePRISM);
//uses opportunityID to update

router.put("/updateITP/:id", teacherController.updateITP);
//Uses opportunityID to update

router.put("/updateStudent", teacherController.updateStudent);
//Uses StudentID to update

router.post("/addITP", teacherController.addITP);
//Adds ITP

router.post("/addITPPDF", upload.single('file'), teacherController.addITPPDF);
//Adds ITP via PDF

router.post("/prism", teacherController.addPRISM);
//adds PRISM

router.post(
  "/bulkAddStudent",
  upload.single("file"),
  teacherController.bulkInsertStudents,
);
//bulk adds Students

router.put("/:id/EditAssign", teacherController.EditAssign);

router.delete("/itp/:id", teacherController.deleteITP);

router.delete("/prism/:id", teacherController.deletePRISM);

router.post("/match", teacherController.beginMatching);

module.exports = router;
