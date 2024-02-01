import React, { useEffect, useState } from "react";
import styles from "../../styles/Teacher/EditDrawer.module.css";
import TextField from "@mui/material/TextField";

const EditDrawer = (props) => {
  const [formToggle, setFormToggle] = useState(false);
  // const [userInput, setUserInput] = useState({
  //   company: props.data.company ? props.data.company : '' ,
  //   role: props.data.role ? props.data.role : '',
  //   teacher: props.data.teacher ? props.data.teacher : '',
  //   description: props.data.description ? props.data.description : '',
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
      company: props.data.company,
      role: props.data.role,
      teacher: props.data.teacher,
      description: props.data.description,
    });
  }, [props.data]);

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
  };
  return (
    !formToggle && (
      <div className="overlay">
        <div className={styles.editDrawer}>
          <form>
            <h2>
              Edit Job <strong>{props.data.id}</strong>
            </h2>
            <div className={styles["input-wrapper"]}>
              <label>Company: </label>
              <TextField
                className={styles.inputBox}
                variant="outlined"
                sx={{
                  height: 40,
                  marginBottom: 2.5,
                  input: { height: 40 },
                  ".MuiInputBase-input": { padding: "0 14px", height: "40px" },
                  ".MuiOutlinedInput-root": { height: "40px" },
                }}
                value={userInput.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>
            <div className={styles["input-wrapper"]}>
              <label>Job Role: </label>
              <TextField
                className={styles.inputBox}
                sx={{
                  height: 40,
                  marginBottom: 2.5,
                  input: { height: 40 },
                  ".MuiInputBase-input": { padding: "0 14px", height: "40px" },
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
                  ".MuiInputBase-input": { padding: "0 14px", height: "40px" },
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
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditDrawer;
