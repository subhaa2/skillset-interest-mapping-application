import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ViewIcon from "@mui/icons-material/RemoveRedEye";
import IconEdit from "@mui/icons-material/Edit";
import IconDelete from "@mui/icons-material/Delete";
import IconCompany from "@mui/icons-material/WorkOutlineOutlined";
import IconRole from "@mui/icons-material/SettingsOutlined";
import IconTeacher from "@mui/icons-material/SupervisorAccountOutlined";
import IconDescription from "@mui/icons-material/InfoOutlined";
import IconPeriod from "@mui/icons-material/DateRange";
import IconSpecialisation from "@mui/icons-material/ExploreOutlined";
import IconSlots from "@mui/icons-material/OpenInNewOutlined";
import styles from "../../styles/Teacher/Cards1.module.css";
import Card from "../../components/Teacher/Card1";
import DeleteDialog from "../../components/UI/DeleteDialog";
import ToolBar from "../../components/Teacher/Toolbar";
import { deleteITP, fetchITP, postITP, updateITP } from "../../api/ITP";
import { CircularProgress } from "@mui/material";
import FormDialog from "../../components/Teacher/FormDialog";
import {
  formatDateToDDMMYY,
  formatDateToShortNumeric,
} from "../../utils/formatTime";
import { ToastContainer, toast } from "react-toastify";
import Error from "../../components/error/Error";
import useAdminAuthCheck from "../../utils/useAdminAuthCheck";
import UploadITPPopUp from "../../components/Teacher/UploadITPPopUp";
import IconCitizenship from '@mui/icons-material/Public';

const ITP = () => {
  useAdminAuthCheck(true);
  //HOOKS
  const [isFetching, setIsFetching] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState();

  const [isCardView, setIsCardView] = useState(true);
  const [search, setSearch] = useState("");

  const [isAddDialog, setIsAddDialog] = useState(false);
  const [isEditDialog, setIsEditDialog] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState(""); //id only
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [dataGridHeight, setDataGridHeight] = useState(
    calculateDynamicHeight(),
  );

    const handleOpenUpload = () => {
      setIsUploadOpen(true);
    };
  
    const handleCloseUpload = () => {
      setIsUploadOpen(false);
    };
  
    const handleUploadSubmit = (file) => {
      const formData = new FormData();
      formData.append('file', file);
    
      fetch('http://localhost:5000/api/teacher/addITPPDF', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then(data => {
        console.log("Response data:", data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
      setIsUploadOpen(false);
    };
    
    
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setError();
      try {
        const fetchedData = await fetchITP();
        let { recordset } = fetchedData;
        console.log(recordset)
        setJobs(recordset);
      } catch (error) {
        setError(error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const mappedData = jobs.map((item) => ({
    ...item,
    id: item.opportunityID,
    period: `${formatDateToShortNumeric(
      item.startDate,
    )} - ${formatDateToShortNumeric(item.endDate)}`,
  }));

  const filteredData = mappedData.filter(
    (item) =>
      search === "" ||
      item.opportunityID.toString().toLowerCase().includes(search) ||
      item.company.toLowerCase().includes(search) ||
      item.role.toLowerCase().includes(search) ||
      item.teacher.toLowerCase().includes(search) ||
      item.specialisation.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      formatDateToShortNumeric(item.startDate).includes(search) ||
      formatDateToShortNumeric(item.endDate).includes(search) ||
      formatDateToDDMMYY(item.startDate).includes(search) ||
      formatDateToDDMMYY(item.endDate).includes(search) ||
      item.slots.toString().toLowerCase().includes(search),
  );

  const actionColumns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => [
        <GridActionsCellItem
          key="edit"
          className="DatagridIcons DatagridIcon_Edit"
          icon={<IconEdit sx={{ color: "var(--blue)" }} />}
          label="Edit"
          onClick={() => handleEditDialog(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          className="DatagridIcons DatagridIcon_Delete"
          icon={<IconDelete sx={{ color: "var(--red)" }} />}
          label="Delete"
          onClick={() => handleDeleteDialog(params.row.opportunityID)}
        />,
      ],
    },
  ];

  const columns = [
    {
      field: "opportunityID",
      headerName: "ID",
      width: 100,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "slots",
      headerName: "Slots",
      width: 100,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "specialisation",
      headerName: "Specialisation",
      width: 150,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "company",
      headerName: "Company",
      width: 200,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "teacher",
      headerName: "Teacher-In-Charge",
      width: 200,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "period",
      headerName: "Period",
      width: 200,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 500,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
  ];

  const handleIsCardView = (display) => {
    setIsCardView(display === "card");
    // setIsCardView((curView) => !curView); //best practice! Ensure immutability of data. Recommended by React Team
    // ^ not a toggle button so not suitable
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleFetchJobs = async () => {
    setIsFetching(true);
    try {
      const fetchedData = await fetchITP();
      let { recordset } = fetchedData;
      setJobs(recordset);
    } catch (error) {
      setError({ message: error.message || "Failed to fetch job listings" });
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddDialog = () => {
    setIsAddDialog(true);
  };

  const handleAdd = async (data) => {
    try {
      let fetchedData = await postITP(data);
      toast.success(`Successfully added job`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleFetchJobs();
    }
  };

  const handleEditDialog = (data) => {
    setIsEditDialog(true);
    setEditData(data);
  };

  const handleEdit = async (data) => {
    try {
      await updateITP(data);
      toast.success(`Successfully edited job`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleFetchJobs();
    }
  };

  const handleDeleteDialog = (id) => {
    setIsDeleteDialog(true);
    setDeleteData(id);
  };

  const handleDelete = async (id) => {
    try {
      let fetchedData = await deleteITP(id);
      toast.success(`Successfully deleted job`);
      // Any other state updates needed
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleFetchJobs();
    }
  };

  function calculateDynamicHeight() {
    const viewportHeight = window.innerHeight;
    const dynamicHeight = Math.max(500, viewportHeight - 245);
    return dynamicHeight;
  }

  useEffect(() => {
    const handleResize = () => {
      setDataGridHeight(calculateDynamicHeight());
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div className="itp">
        <ToolBar
          count={filteredData.length}
          title="Internship Job Listings"
          placeholder="Search..."
          isCardView={isCardView}
          onDisplayType={handleIsCardView}
          onSearch={handleSearch}
          onAdd={handleAddDialog}
        />
        <div className="padding">
          {isFetching ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {error ? (
                <Error
                  title="Failed to fetch ITP Job Listings"
                  message={error.message}
                />
              ) : (
                <>
                  {isCardView ? (
                    <div className={styles.cards}>
                      {filteredData.map((item) => (
                        <Card
                          key={item.opportunityID}
                          onEdit={handleEditDialog}
                          onDelete={handleDeleteDialog}
                          data={item}
                          headerData={{
                            icon: (
                              <IconSlots
                                sx={{ fontSize: 32, color: "#9699C0" }}
                              />
                            ),
                            value: item.slots,
                          }}
                          bodyData={[
                            {
                              icon: (
                                <IconCompany
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Company",
                              value: item.company,
                            },
                            {
                              icon: (
                                <IconRole
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Role",
                              value: item.role,
                            },
                            {
                              icon: (
                                <IconTeacher
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Teacher",
                              value: item.teacher,
                            },
                            {
                              icon: (
                                <IconSpecialisation
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Specialisation",
                              value: item.specialisation,
                            },
                            {
                              icon: (
                                <IconCitizenship
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Citizenship",
                              value: item.citizentype,
                            },
                            {
                              icon: (
                                <IconPeriod
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Period",
                              value: `${formatDateToDDMMYY(
                                item.startDate,
                              )}-${formatDateToDDMMYY(item.endDate)}`,
                            },
                          ]}
                          description={item.description}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <br />
                      <div
                        style={{
                          height: dataGridHeight,
                          width: "100%",
                          // padding: "0 20px",
                        }}
                      >
                        <DataGrid
                          rows={filteredData}
                          columns={actionColumns.concat(columns)}
                          pageSize={5}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <FormDialog
        title="Add"
        type="ITP"
        data={isAddDialog}
        isOpen={isAddDialog}
        onClose={() => setIsAddDialog(false)}
        onFetch={handleFetchJobs}
        onSubmit={handleAdd}
      />
      <FormDialog
        title="Edit"
        type="ITP"
        data={editData}
        isOpen={isEditDialog}
        onClose={() => setIsEditDialog(false)}
        onFetch={handleFetchJobs}
        onSubmit={handleEdit}
      />
      <DeleteDialog
        id={deleteData}
        isOpen={isDeleteDialog}
        onClose={() => setIsDeleteDialog(false)}
        onSubmit={handleDelete}
      />
      <ToastContainer />
      <button onClick={handleOpenUpload}>Upload ITP Documents</button>

      <UploadITPPopUp
        open={isUploadOpen}
        onClose={handleCloseUpload}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
};

export default ITP;
