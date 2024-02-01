import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentForm({ data, onClose, onSubmit }) {
  const [input, setInput] = useState({
    StudentId: "",
    FullName: "",
    Resume: "",
    specialisation: "",
    gpa: "",
  });
  useEffect(() => {  
    console.log("Data received by StudentForm:", data);
    setInput({
      StudentId: data.StudentID || "",
      FullName: data.FullName || "",
      Resume: data.ResumeLink || "",
      specialisation: data.Specialisation || "",
      gpa: data.GPA || "",
    });
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    await onSubmit(input);
    onClose();
  };

  return (
    <>
      <Dialog open={true}>
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {input.StudentId ? (
                <>Edit Students - {input.StudentId}</>
              ) : (
                <>Add Job Listing</>
              )}
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="StudentId"
                  name="StudentId"
                  size="small"
                  value={input.StudentId}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="FullName"
                  name="FullName"
                  size="small"
                  value={input.FullName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Resume"
                  name="Resume"
                  size="small"
                  value={input.Resume}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Specialisation"
                  name="specialisation"
                  size="small"
                  value={input.specialisation}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="GPA"
                  name="gpa"
                  size="small"
                  value={input.gpa}
                  onChange={handleInputChange}
                />
              </Grid>
            </>
            <Grid item xs={6}></Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              <Button fullWidth variant="outlined" onClick={onClose}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {" "}
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default StudentForm;
