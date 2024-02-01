import React, { useEffect, useState } from "react";
import styles from "../../styles/Teacher/EditDrawer.module.css";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

/* const EditDrawer = (props) => {
    const [formToggle, setFormToggle] = useState(false);

    const [userInput, setUserInput] = useState({
        StudentID: "",
    });

    useEffect(() => {
        setFormToggle(false);
        setUserInput({
            StudentID: props.data.StudentID || "",
        });
    }, [props.data]);

    const handleInputChange = (field, value) => {
        setUserInput((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      };
    const handleCancel = () => {
        setFormToggle(!formToggle);
    };
    const handleFetchInfo = async () => {
        setIsFetching(true);
        try {
            const fetchedData = await fetchITPSummary();
            let { recordset } = fetchedData;
            setJobs(recordset);
        } catch (error) {
            setError({ message: error.message || "Failed to fetch job listings" });
        } finally {
            setIsFetching(false);
        }
    };
    const handleEdit = async (data) => {
        try {
            let fetchedData = await update(data);
          
        } catch (error) {
           
        } finally {
            handleFetchInfo();
        }
    };
    return (
        !formToggle && (
            <div className="overlay">
                <div className={styles.editDrawer}>
                    <form>
                        <h2>
                            Edit Project <strong>{props.data.OpportunityID }</strong>
                        </h2>
                        <div className={styles["input-wrapper"]}>
                            <label>Company: <strong>{props.data.Company}</strong></label>
                        </div>
                        <div className={styles["input-wrapper"]}>
                            <label>Job Name: <strong>{props.data.JobRole}</strong></label>
                        </div>
                        <div className={styles["input-wrapper"]}>
                            <label>Teacher In Charge: <strong>{props.data.FullName}</strong> </label>
                        </div>
                        <div className={styles["input-wrapper"]}>
                            <label>Student Name: <strong>{props.data.StudName}</strong> </label>
                        </div>
                        <div className={styles["input-wrapper"]}>
                            <label>Admin Number: </label>
                            <TextField
                                className={styles.inputBox}
                                sx={{
                                    height: 40,
                                    marginBottom: 2.5,
                                    input: { height: 40 },
                                    ".MuiInputBase-input": { padding: "0 14px", height: "40px" },
                                    ".MuiOutlinedInput-root": { height: "40px" },
                                }}
                                value={userInput.StudentID}
                                onChange={(e) => handleInputChange("StudentID", e.target.value)}
                            />
                        </div>
                        <div className={styles["buttons-wrapper"]}>
                            <button className={styles.cancelButton} onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className={styles.updateButton} onClick={handleEdit}>
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}; */
function EditDrawer({ title, type, data, isOpen, onClose, onSubmit }) {
  const [userInput, setUserInput] = useState({
    id: "",
    StudentID: "",
    Company: "",
    JobRole: "",
    FullName: "",
    StudName: "",
    Title: "",
  });
  const [isDisabled, setDisabled] = useState(false);
  useEffect(() => {
    setUserInput({
      id: data.id || "",
      StudentID: data.StudentID || "",
      Company: data.Company || "",
      JobRole: data.JobRole || "",
      FullName: data.FullName || "",
      StudName: data.StudName || "",
      Title: data.Title || "",
    });
  }, [data]);

  const handleInputChange = (field, value) => {
    setUserInput((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleSubmit = async () => {
    setDisabled(true);
    await onSubmit(userInput);
    onClose();
    setDisabled(false);
  };
  return (
    <>
      <Dialog open={isOpen}>
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {userInput.id ? (
                <>Edit Job Listing - {userInput.id}</>
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
                  <label>
                    Company: <strong>{userInput.Company}</strong>
                  </label>
                </Grid>
                <Grid item xs={6}>
                  <label>
                    Job Name: <strong>{userInput.JobRole}</strong>
                  </label>
                </Grid>
                <Grid item xs={6}>
                  <label>
                    Teacher In Charge: <strong>{userInput.FullName}</strong>{" "}
                  </label>
                </Grid>
                <Grid item xs={6}>
                  <label>
                    Student Name: <strong>{userInput.StudName}</strong>{" "}
                  </label>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Admin Number"
                    name="Admin Number"
                    size="small"
                    value={userInput.StudentID}
                    onChange={(e) =>
                      handleInputChange("StudentID", e.target.value)
                    }
                  />
                </Grid>
              </>
            )}
            {type === "PRISM" && (
              <>
                <Grid item xs={4}>
                  <label>
                    Project Name: <strong>{userInput.Title}</strong>
                  </label>
                </Grid>
                <Grid item xs={4}>
                  <label>
                    Teacher In Charge: <strong>{userInput.FullName}</strong>{" "}
                  </label>
                </Grid>
                <Grid item xs={4}>
                  <label>
                    Student Name: <strong>{userInput.StudName}</strong>{" "}
                  </label>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Admin Number"
                    name="StudentID"
                    size="small"
                    value={userInput.StudentID}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
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
                disabled={isDisabled}
              >
                {title}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default EditDrawer;
