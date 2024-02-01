import React, { useEffect, useState } from "react";
import styles from "../../styles/Teacher/ModifyDrawer.module.css";
import TextField from "@mui/material/TextField";
import Modal from "../UI/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Divider } from "@mui/material";

const ModifyDrawer = ({ data, title }) => {
  const [formToggle, setFormToggle] = useState(false);
  // const [userInput, setUserInput] = useState({
  //   company: data.company ? data.company : '' ,
  //   role: data.role ? data.role : '',
  //   teacher: data.teacher ? data.teacher : '',
  //   description: data.description ? data.description : '',
  // });

  const [userInput, setUserInput] = useState({
    company: "",
    role: "",
    teacher: "",
    description: "",
  });

  useEffect(() => {
    setFormToggle(!formToggle);
    setUserInput({
      company: data.company,
      role: data.role,
      teacher: data.teacher,
      description: data.description,
    });
  }, [data]);

  const handleInputChange = (identifier, value) => {
    const fieldToMap = {
      company: "company",
      role: "role",
      teacher: "teacher",
      description: "description",
    };

    const fieldToUpdate = fieldToMap[identifier] || "";

    setUserInput((prevState) => {
      return {
        ...prevState,
        [fieldToUpdate]: value,
      };
    });
  };

  const handleCancel = () => {
    setFormToggle(!formToggle);
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    setFormToggle(!formToggle);
    toast.success(`Job has been ${title === "Add" ? "added" : "edited"}!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <>
      {!formToggle && (
        <Modal>
          <div className={styles.modifyDrawer}>
            <form>
              <h2>
                {title} Job <strong>{data.id}</strong>
              </h2>
              <Divider />
              <div className={styles["input-wrapper"]}>
                <label>Company: </label>
                <TextField
                  className={styles.inputBox}
                  variant="outlined"
                  sx={{
                    height: 40,
                    marginBottom: 2.5,
                    input: { height: 40 },
                    ".MuiInputBase-input": {
                      padding: "0 14px",
                      height: "40px",
                    },
                    ".MuiOutlinedInput-root": { height: "40px" },
                  }}
                  value={userInput.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>
              <div className={styles["input-wrapper"]}>
                <label>Role: </label>
                <TextField
                  className={styles.inputBox}
                  sx={{
                    height: 40,
                    marginBottom: 2.5,
                    input: { height: 40 },
                    ".MuiInputBase-input": {
                      padding: "0 14px",
                      height: "40px",
                    },
                    ".MuiOutlinedInput-root": { height: "40px" },
                  }}
                  value={userInput.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                />
              </div>
              <div className={styles["input-wrapper"]}>
                <label>Teacher-In-Charge: </label>
                <TextField
                  className={styles.inputBox}
                  sx={{
                    height: 40,
                    marginBottom: 2.5,
                    input: { height: 40 },
                    ".MuiInputBase-input": {
                      padding: "0 14px",
                      height: "40px",
                    },
                    ".MuiOutlinedInput-root": { height: "40px" },
                  }}
                  value={userInput.teacher}
                  onChange={(e) => handleInputChange("teacher", e.target.value)}
                />
              </div>
              <div className={styles["input-wrapper"]}>
                <label>Description: </label>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    ".MuiOutlinedInput-root": {
                      padding: "8px 14px",
                    },
                  }}
                  value={userInput.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
              <div className={styles["buttons-wrapper"]}>
                <button className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
                <button className={styles.updateButton} onClick={handleUpdate}>
                  {title === "Add" ? "Add Job" : "Update Job"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <ToastContainer />
    </>
  );
};

export default ModifyDrawer;
