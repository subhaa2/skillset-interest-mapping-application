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

function FormDialog({ title, type, data, isOpen, onClose, onSubmit }) {
  const [input, setInput] = useState({
    id: "",
    company: "",
    role: "",
    title: "",
    teacher: "",
    specialisation: "",
    startDate: "",
    endDate: "",
    slots: 0,
    type: "",
    description: "",
    citizenship: "",
  });
  useEffect(() => {
    const formattedStartDate = data.startDate
      ? new Date(data.startDate).toISOString().split("T")[0]
      : "";
    const formattedEndDate = data.endDate
      ? new Date(data.endDate).toISOString().split("T")[0]
      : "";

    setInput({
      id: data.id || "",
      company: data.company || "",
      role: data.role || "",
      title: data.title || "",
      teacher: data.teacher || "",
      specialisation: data.specialisation || "",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      slots: data.slots || 0,
      type: data.type || "",
      description: data.description || "",
    });
    setInput((prevState) => ({
      ...prevState,
      citizenship: data.citizentype || "All",
    }));
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
      <Dialog open={isOpen}>
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {input.id ? (
                <>Edit Job Listing - {input.id}</>
              ) : (
                <>Add Job Listing</>
              )}
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            {type === "ITP" && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    size="small"
                    value={input.company}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    size="small"
                    value={input.role}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Teacher-In-Charge"
                    name="teacher"
                    size="small"
                    value={input.teacher}
                    onChange={handleInputChange}
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
                    select
                    fullWidth
                    label="Citizenship"
                    name="citizenship"
                    size="small"
                    value={input.citizenship}
                    onChange={handleInputChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="Singaporean/PR">Singaporean/PR</option>
                    <option value="All">All</option>
                  </TextField>
                </Grid>
              </>
            )}
            {type === "PRISM" && (
              <>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Type"
                    name="type"
                    size="small"
                    value={input.type}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    size="small"
                    value={input.title}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4}>
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
                    label="Company"
                    name="company"
                    size="small"
                    value={input.company}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Teacher"
                    name="teacher"
                    size="small"
                    value={input.teacher}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="StartDate"
                name="startDate"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={input.startDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="EndDate"
                name="endDate"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={input.endDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Slots"
                name="slots"
                type="number"
                size="small"
                value={input.slots}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                variant="outlined"
                size="small"
                value={input.description}
                onChange={handleInputChange}
              />
            </Grid>
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
                {title}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default FormDialog;
