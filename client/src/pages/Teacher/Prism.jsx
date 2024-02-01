import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ViewIcon from "@mui/icons-material/RemoveRedEye";
import IconEdit from "@mui/icons-material/Edit";
import IconDelete from "@mui/icons-material/Delete";
import IconCompany from "@mui/icons-material/WorkOutlineOutlined";
import IconTitle from "@mui/icons-material/SettingsOutlined";
import IconTeacher from "@mui/icons-material/SupervisorAccountOutlined";
import IconType from "@mui/icons-material/AssignmentOutlined";
import IconDescription from "@mui/icons-material/InfoOutlined";
import IconPeriod from "@mui/icons-material/DateRange";
import IconSpecialisation from "@mui/icons-material/ExploreOutlined";
import IconSlots from "@mui/icons-material/OpenInNewOutlined";
import styles from "../../styles/Teacher/Cards1.module.css";
import Card from "../../components/Teacher/Card1";
import DeleteDialog from "../../components/UI/DeleteDialog";
import ToolBar from "../../components/Teacher/Toolbar";
import {
  deletePRISM,
  fetchPRISM,
  postPRISM,
  updatePRISM,
} from "../../api/PRISM";
import { CircularProgress } from "@mui/material";
import FormDialog from "../../components/Teacher/FormDialog";
import {
  formatDateToDDMMYY,
  formatDateToShortNumeric,
} from "../../utils/formatTime";
import { ToastContainer, toast } from "react-toastify";
import Error from "../../components/error/Error";
import useAdminAuthCheck from "../../utils/useAdminAuthCheck";

const PRISM = () => {
  useAdminAuthCheck(true);
  //HOOKS
  const [isFetching, setIsFetching] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState();

  const [isCardView, setIsCardView] = useState(true);
  const [search, setSearch] = useState("");

  const [isAddDialog, setIsAddDialog] = useState(false);
  const [isEditDialog, setIsEditDialog] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState("");

  const [dataGridHeight, setDataGridHeight] = useState(
    calculateDynamicHeight(),
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setError();
      try {
        const fetchedData = await fetchPRISM();
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

  const mappedData = projects.map((item) => ({
    ...item,
    id: item.opportunityID, //Required by datagrid
    period: `${formatDateToShortNumeric(
      item.startDate,
    )} - ${formatDateToShortNumeric(item.endDate)}`, //Datagrid use
  }));

  const filteredData = mappedData.filter(
    (item) =>
      search === "" ||
      item.opportunityID.toLowerCase().includes(search) ||
      item.company.toLowerCase().includes(search) ||
      item.title.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
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
      field: "type",
      headerName: "Type",
      width: 100,
      disableColumnFilter: true,
      disableColumnMenu: true,
    },
    {
      field: "title",
      headerName: "Title",
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
      const fetchedData = await fetchPRISM();
      let { recordset } = fetchedData;
      setProjects(recordset);
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
    console.log(data);
    try {
      let fetchedData = await postPRISM(data);
      toast.success(`Successfully added project`);
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
      let fetchedData = await updatePRISM(data);
      toast.success(`Successfully edited project`);
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
      let fetchedData = await deletePRISM(id);
      toast.success(`Successfully deleted project`);
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
    <div className="container">
      <div className="itp">
        <ToolBar
          count={filteredData.length}
          title="PRISM Projects Listings"
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
                          key={item.opportunityID} //Prevent suboptimal code that causes all Card1 component to rerender caused by
                          //missing unique identifier
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
                                <IconType
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Type",
                              value: item.type,
                            },
                            {
                              icon: (
                                <IconTitle
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Title",
                              value: item.title,
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
                                <IconCompany
                                  sx={{ fontSize: 32, color: "#9699C0" }}
                                />
                              ),
                              label: "Company",
                              value: item.company,
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
        type="PRISM"
        data={isAddDialog}
        isOpen={isAddDialog}
        onClose={() => setIsAddDialog(false)}
        onFetch={handleFetchJobs}
        onSubmit={handleAdd}
      />
      <FormDialog
        title="Edit"
        type="PRISM"
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
    </div>
  );
};

export default PRISM;
