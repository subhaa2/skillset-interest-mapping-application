import React, { useState, useEffect } from "react";
import { DataGrid, gridClasses, GridActionsCellItem } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import styles from "../../styles/Teacher/ITP-Prism.module.css";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { fetchITPSummary, updateITPSummary } from "../../api/ITP";
import EditDrawer from "../../components/Teacher/SummaryEditDrawer";
import Edit from "@mui/icons-material/Edit";
import useAdminAuthCheck from "../../utils/useAdminAuthCheck";
import Button from "@mui/material/Button";

const ITPSummary = () => {
  useAdminAuthCheck(true);
  const ODD_OPACITY = 0.2;
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isEditDialog, setIsEditDialog] = useState(false);
  const [jobListings, setJobListings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: theme.palette.grey[300],
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
      "&.Mui-selected": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity
        ),
        "&:hover, &.Mui-hovered": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity
          ),
          "@media (hover: none)": {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity
            ),
          },
        },
      },
    },
  }));
  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      setIsFetching(true);
      setError("");
      try {
        const fetchedData = await fetchITPSummary();
        console.log("fetchdata");
        console.log(fetchedData);
        let { recordset } = fetchedData;
        setJobs(recordset);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const mappedData = jobs.map((item) => ({
    ...item,
    id: item.StudentID,
  }));
  const columns = [
    { field: "StudentID", headerName: "AdminNo", flex: 1 },
    { field: "StudName", headerName: "Student Name", flex: 1 },
    { field: "OpportunityID", headerName: "Opportunity ID", flex: 1 },
    { field: "Company", headerName: "Company", flex: 1 },
    { field: "JobRole", headerName: "Job Name", flex: 1 },
    { field: "FullName", headerName: "Teacher-In-Charge", flex: 1 }
  ];
  const actionColumns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => [
        <GridActionsCellItem
          className="DatagridIcons DatagridIcon_Edit"
          icon={<EditIcon />}
          onClick={() => handleEditDialog(params.row)}
          label="Edit"
        ></GridActionsCellItem>,
      ],
    },
  ];

  const rows = mappedData;

  const displayEditForm = (data) => {
    setEditData(data);
    setEditDrawerOpen(true);
  };

  const closeEditDrawer = () => {
    setEditDrawerOpen(false);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };
  const handleEdit = async (data) => {
    try {
      let fetchedData = await updateITPSummary(
        editData.StudentID,
        data.StudentID,
        data.id
      );
    } catch (error) {
      console.log(data);
      console.error(error);
      setError(error.message);
    } finally {
      handleFetchInfo();
    }
  };
  const handleEditDialog = (data) => {
    setIsEditDialog(true);
    setEditData(data);
  };
  const handleFetchInfo = async () => {
    setIsFetching(true);
    try {
      const fetchedData = await fetchITPSummary();
      console.log("fetchdata");
      console.log(fetchedData);
      let { recordset } = fetchedData;
      setJobs(recordset);
    } catch (error) {
      setError(error.message || "Failed to fetch job listings");
    } finally {
      setIsFetching(false);
    }
  };
  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );
  console.log("filteredrows")
  console.log(filteredRows)
  const handleBeginMatching = async () => {
    const firstConfirm = window.confirm(
      "Are you sure you want to begin the matching process?"
    );
    if (!firstConfirm) return;
    const secondConfirm = window.confirm(
      "This process may take a long time. Do you want to proceed?"
    );
    if (!secondConfirm) return;
    try {
      const response = await fetch("http://localhost:5000/api/teacher/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Matching process initiated successfully");
      } else {
        console.error("Failed to start matching process");
      }
    } catch (error) {
      console.error("Error during fetching:", error);
    }
  };

  return (
    <div className="container">
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className={styles["maindiv"]}>
        <div className={styles["searchAdd"]}>
          <div className={styles["search-div"]}>
            <TextField
              className={styles["search"]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div></div>
        </div>
        <StripedDataGrid
          className={styles["table"]}
          disableRowSelectionOnClick
          rows={filteredRows}
          columns={columns.concat(actionColumns)}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 15]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
        {isEditDrawerOpen && (
          <EditDrawer data={editData} onClose={closeEditDrawer} />
        )}
      </div>
      <EditDrawer
        title="Edit"
        type="ITP"
        data={editData}
        isOpen={isEditDialog}
        onClose={() => setIsEditDialog(false)}
        onFetch={handleFetchInfo}
        onSubmit={handleEdit}
      />

      <div className="container">
        <Button
          variant="contained"
          color="primary"
          onClick={handleBeginMatching}
          style={{ marginTop: "20px" }}
        >
          Begin Matching Process
        </Button>
      </div>
    </div>
  );
};
export default ITPSummary;
