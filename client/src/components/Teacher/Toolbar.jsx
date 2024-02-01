import React, { useState } from "react";
import styles from "../../styles/Teacher/Toolbar.module.css";

//Icons
import FilterIcon from "@mui/icons-material/FilterListRounded";
import SearchIcon from "@mui/icons-material/SearchRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import DatagridIcon from "@mui/icons-material/ViewListRounded"; //Datagrid
import CardIcon from "@mui/icons-material/ViewModuleRounded"; //Card
import { InputAdornment, TextField } from "@mui/material";

const ToolBar = ({
  count,
  title,
  placeholder,
  isCardView,
  onDisplayType,
  onSearch,
  onAdd,
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <h2>
          {title} <span>({count})</span>
        </h2>
        <TextField
          sx={{
            background: "var(--white)",
            borderRadius: "5px",
            width: "500px",
            input: {
              height: "30px",
              padding: "0 !important",
              "&::placeholder": {
                fontSize: "0.9rem", // Adjust the size as needed
              },
            },
            "& .MuiOutlinedInput-root": {
              paddingLeft: "5px",
            },
            "& .MuiSvgIcon-root": {
              width: "20px",
              height: "20px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder={placeholder}
          onChange={onSearch}
        />
      </div>
      <div className={styles.right}>
        {/* <button className={styles.filterButton} onClick={onFilter}>
          <FilterIcon />
        </button> */}
        <button className={styles.addButton} onClick={onAdd}>
          <AddIcon />
        </button>
        <div className={styles.toggleDisplayContainer}>
          <div className={styles.borderLeft}></div>
          <div className={styles.toggleDisplay}>
            <button
              className={!isCardView ? styles.active : undefined}
              onClick={() => onDisplayType("datagrid")}
            >
              <DatagridIcon className={styles.datagridIcon} />
            </button>
            <button
              className={isCardView ? styles.active : undefined}
              onClick={() => onDisplayType("card")}
            >
              <CardIcon className={styles.cardIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
