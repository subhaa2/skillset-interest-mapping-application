import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import styles from "../../styles/UI/DeletePopup.module.css";
import WarningIcon from "@mui/icons-material/WarningAmberRounded";
import { Dialog, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteDialog = ({ id, isOpen, onClose, onSubmit }) => {
  // const handleDelete = async () => {
  //   try {
  //     let fetchedData = await deleteITPJobs(id);
  //     let { status } = fetchedData;

  //     if (status === 200) {
  // toast.success(`Successfully deleted job ${id}`);
  // onFetch();
  //     } else {
  // let { error } = fetchedData;
  // console.log(error);
  // toast.error(`${status}: ${error}`);
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred");
  //     console.error(error);
  //   } finally {
  //     onClose();
  //   }
  // };
  const handleDelete = () => {
    onSubmit(id);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <Modal>
          <div className={styles["deletePopup-content"]}>
            <div className={styles.header}>
              <div className={styles["warningIcon-wrapper"]}>
                <WarningIcon className={styles.warningIcon} />
              </div>
            </div>
            <p className={styles.p}>Are you sure you want to delete Job ID?</p>
            <h2 className={styles.h2}>{id || "Error"}</h2>
            <button className={styles.deleteButton} onClick={handleDelete}>
              Delete Job
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
      <ToastContainer />
    </>
  );
};

export default DeleteDialog;
