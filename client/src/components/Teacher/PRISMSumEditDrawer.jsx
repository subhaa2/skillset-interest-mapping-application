import React, { useEffect, useState } from "react";
import styles from "../../styles/Teacher/EditDrawer.module.css";
import TextField from "@mui/material/TextField";

const EditDrawer = (props) => {
  const [formToggle, setFormToggle] = useState(false);

  const [userInput, setUserInput] = useState({
    company: "MAS",
    jobName: "Tester",
    tic: "Lim Khai Cher",
    student: "",
  });

  useEffect(() => {
    setFormToggle(false);
    setUserInput({
      projectName: props.data.opportunity,
      tic: props.data.teacher,
      student: props.data.student,
    });
  }, [props.data]);

  const handleInputChange = (identifier, value) => {
    const fieldToMap = {
      student: "student",
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
              Edit Project <strong>{props.data.id}</strong>
            </h2>
            <div className={styles["input-wrapper"]}>
              <label>
                Project Name: <strong>{props.data.Title}</strong>
              </label>
            </div>
            <div className={styles["input-wrapper"]}>
              <label>
                Teacher In Charge: <strong>{props.data.FullName}</strong>{" "}
              </label>
            </div>
            <div className={styles["input-wrapper"]}>
              <label>
                Student Name: <strong>{props.data.StudName}</strong>{" "}
              </label>
            </div>
            <div className={styles["input-wrapper"]}>
              <label>Admin No: </label>
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
                onChange={(e) => handleInputChange("student", e.target.value)}
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
