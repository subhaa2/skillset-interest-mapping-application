import React, { useState, useEffect } from "react";
import { DataGrid, gridClasses, GridActionsCellItem } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import styles from "../../styles/Teacher/ITP-Prism.module.css";
import { fetchPRISMSummary } from "../../api/PRISM";
import EditDrawer from "../../components/Teacher/SummaryEditDrawer";
import axios from "axios";
import useAdminAuthCheck from "../../utils/useAdminAuthCheck";

const PrismSummary = (props) => {
  useAdminAuthCheck(true);
  const ODD_OPACITY = 0.2;
  const [searchText, setSearchText] = useState("");
  const [editData, setEditData] = useState({});
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditDialog, setIsEditDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState();

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
          ODD_OPACITY + theme.palette.action.selectedOpacity,
        ),

        "&:hover, &.Mui-hovered": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity,
          ),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
          },
        },
      },
    },
  }));
  const columns = [
    { field: "OpportunityID", headerName: "Opportunity ID", width: 120 },
    { field: "Title", headerName: "Project Name", width: 400 },
    { field: "FullName", headerName: "Teacher-In-Charge", width: 300 },
    { field: "StudentID", headerName: "AdminNo", width: 140 },
    { field: "StudName", headerName: "Student Name", width: 200 },
  ];

  const displayEditForm = (data) => {
    setEditData(data);
    setEditDrawerOpen(true);
  };

  const closeEditDrawer = () => {
    setEditDrawerOpen(false);
  };
  const handleEditDialog = (data) => {
    setIsEditDialog(true);
    setEditData(data);
  };
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      setIsFetching(true);
      setError();
      try {
        const fetchedData = await fetchPRISMSummary();
        let { recordset } = fetchedData;
        setProjects(recordset);
      } catch (error) {
        setError(error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);
  const handleEdit = async (data) => {
    try {
    } catch (error) {
      console.log(data);
    } finally {
      handleFetchInfo();
    }
  };
  const handleFetchInfo = async () => {
    setIsFetching(true);
    try {
      const fetchedData = await fetchPRISMSummary();
      let { recordset } = fetchedData;
      setProjects(recordset);
    } catch (error) {
      setError({ message: error.message || "Failed to fetch job listings" });
    } finally {
      setIsFetching(false);
    }
  };

  const mappedData = projects.map((item) => ({
    ...item,
    id: item.OpportunityID, //Required by datagrid
  }));
  const rows = mappedData.filter(
    (item) =>
      item.OpportunityID.toLowerCase() ||
      item.title.toLowerCase() ||
      item.teacher.toLowerCase() ||
      item.teacher.toLowerCase(),
  );
  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" && // Check if the value is a string
        value.toLowerCase().includes(searchText.toLowerCase()),
    ),
  );
  const actionColumns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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

  return (
    <div>
      <div className={styles["maindiv"]}>
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
    </div>
  );
};
export default PrismSummary;
