import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { getUserById } from "../../../redux/action/user";
import {
  addCompanyInfo,
  getCompanyById,
  addServey,
  // saveSurveyAsDraft,
} from "../../../redux/action/company";
import { getAllServey } from "../../../redux/action/company";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Modal,
  TextField,
  Grid,
  Paper,
  Input,
  TablePagination,
  Toolbar,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface MyJwtPayload extends JwtPayload {
  id: string;
}

interface onClickType {
  onDetailClick: any;
}

const Draft: React.FC<onClickType> = ({ onDetailClick }) => {
  const dispatch = useDispatch();
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [openSurveyModal, setOpenSurveyModal] = useState(false);
  const [surveyName, setSurveyName] = useState("");
  const [selectedSurveys, setSelectedSurveys] = useState<Set<number>>(
    new Set()
  );

  const currenTtoken: any = localStorage.getItem("user");

  let userId = "";
  if (currenTtoken) {
    const decoded = jwtDecode<MyJwtPayload>(currenTtoken);
    userId = decoded.id;
  }

  useEffect(() => {
    if (currenTtoken) {
      dispatch(getUserById(userId) as any);
    }
  }, [userId, currenTtoken, dispatch]);

  const user = useSelector((state: any) => state.user?.user?.newUser);
  const managerId = user?.id;
  const company = useSelector(
    (state: any) => state.company?.companyData?.result
  );

  const surveys = useSelector((state: any) => state.survey?.servey?.servey);
  console.log("Serveys: ", surveys);
  ///////////////
  const surveyList = Array.isArray(surveys)
    ? surveys.filter((survey: any) => survey.isPublished === false)
    : [];
  ///////////////

  useEffect(() => {
    if (user) {
      dispatch(getCompanyById(user?.id) as any);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (company?.id) {
      dispatch(getAllServey(company.id) as any);
    }
  }, [company, dispatch]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page change
  };

  // Handle modal visibility for adding new survey
  const handleAddSurveyClick = () => {
    setOpenSurveyModal(true);
  };

  // Handling the company form
  const [companyData, setCompanyData] = useState<any>({
    name: "",
    logo: null,
    backgroundColor: "#b3acac",
    textColor: "#000000",
  });

  const handleFileChange = (e: any) => {
    const logo = e.target.files[0];
    setCompanyData((prevData: any) => ({
      ...prevData,
      logo: logo,
    }));
  };
  //result
  const handleSaveCompany = async (event: any) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", companyData.name);
    if (companyData.logo) {
      formData.append("logo", companyData.logo);
    }
    formData.append("backgroundColor", companyData.backgroundColor);
    formData.append("textColor", companyData.textColor);
    formData.append("managerId", managerId);

    const response = await dispatch(addCompanyInfo(formData) as any);
    if (response) {
      toast.success(`${response?.payload?.message}`);
      setOpenCompanyModal(false);
    } else if (response?.error) {
      toast.error(`${response.error}`);
    }
  };

  const handleCancelCompanyModal = () => {
    setOpenCompanyModal(false);
  };

  const handleCancelSurveyModal = () => {
    setOpenSurveyModal(false);
    setSurveyName("");
  };

  // Handling save as draft
  const handleSaveAsDraft = async () => {
    if (surveyName) {
      const response = await dispatch(
        addServey({
          surveyName,
          isPublished: false,
          companyId: company?.id,
        }) as any
      );
      if (response) {
        toast.success("Survey saved as draft!");
        setOpenSurveyModal(false);
        setSurveyName("");
      }
      dispatch(getAllServey(company.id) as any);
    }
  };

  // Handling publish survey
  const handlePublish = async () => {
    if (surveyName) {
      const response = await dispatch(
        addServey({
          surveyName,
          isPublished: true,
          companyId: company?.id,
        }) as any
      );
      if (response) {
        toast.success("Survey published successfully!");
        setOpenSurveyModal(false);
        setSurveyName("");
      }
      dispatch(getAllServey(company.id) as any);
    }
  };

  // Handle survey selection
  const handleSelectSurvey = (surveyId: number) => {
    const newSelection = new Set(selectedSurveys);
    if (newSelection.has(surveyId)) {
      newSelection.delete(surveyId);
    } else {
      newSelection.add(surveyId);
    }
    setSelectedSurveys(newSelection);
  };

  // Check if survey is selected
  const isSurveySelected = (surveyId: number) => selectedSurveys.has(surveyId);

  // Handle delete surveys
  const handleDeleteSurveys = () => {
    // Implement delete logic for selected surveys
    console.log("Deleting surveys:", Array.from(selectedSurveys));
    // Reset selection after deletion
    setSelectedSurveys(new Set());
  };

  const CustomToolbar: React.FC = () => {
    const selectedCount = selectedSurveys.size;

    return (
      <>
        {selectedCount > 0 && (
          <Toolbar sx={{ backgroundColor: "#e6f7ff" }}>
            <Typography
              variant="h6"
              display="flex"
              justifyContent="space-between"
              sx={{
                flex: "1 1 100%",
                color: "inherit",
                fontWeight: "bold",
              }}
            >
              {selectedCount} selected
              <Button color="error" onClick={handleDeleteSurveys}>
                Delete <DeleteIcon sx={{ ml: 1 }} />
              </Button>
              {selectedCount === 1 && (
                <Button onClick={() => console.log("Edit selected survey")}>
                  Edit <EditIcon sx={{ ml: 1 }} />
                </Button>
              )}
            </Typography>
          </Toolbar>
        )}
      </>
    );
  };

  return (
    <Box component="section" sx={{ p: 3, width: "100%" }}>
      {/* Page Heading */}
      <Typography variant="h4" gutterBottom>
        Draft Surveys
      </Typography>

      {/* Add New Survey Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddSurveyClick}
          disabled={!company}
        >
          Add New Survey
        </Button>
      </Box>

      {/* Company Check */}
      {!company ? (
        <Paper sx={{ p: 3, mb: 3, textAlign: "start" }}>
          <Typography variant="h6" gutterBottom>
            You have to register your company before proceeding to other tasks.
          </Typography>
          <Button variant="contained" onClick={() => setOpenCompanyModal(true)}>
            Let's Start
          </Button>
        </Paper>
      ) : (
        <>
          {/* Surveys Table */}
          {/* Custom Toolbar */}
          <CustomToolbar />

          {/* Surveys Table */}
          {surveyList.length ? (
            <>
              <Table
                component={Paper}
                sx={{
                  mb: 3,
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedSurveys.size === surveyList.length}
                        onChange={() => {
                          if (selectedSurveys.size === surveyList.length) {
                            setSelectedSurveys(new Set());
                          } else {
                            setSelectedSurveys(
                              new Set(surveyList.map((survey) => survey.id))
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#555",
                        fontSize: "16px",
                        padding: "12px",
                        textAlign: "center",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Survey ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#555",
                        fontSize: "16px",
                        padding: "12px",
                        textAlign: "center",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Survey Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#555",
                        fontSize: "16px",
                        padding: "12px",
                        textAlign: "center",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Date Created
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#555",
                        fontSize: "16px",
                        padding: "12px",
                        textAlign: "center",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surveyList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((survey: any) => (
                      <TableRow
                        key={survey.id}
                        onClick={() => handleSelectSurvey(survey.id)}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f1f1f1",
                          },
                          backgroundColor: isSurveySelected(survey.id)
                            ? "#e6f7ff"
                            : "inherit",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSurveySelected(survey.id)}
                            onChange={() => handleSelectSurvey(survey.id)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "center",
                            borderBottom: "1px solid #ddd",
                            color: "#333",
                          }}
                        >
                          {survey.id}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "center",
                            borderBottom: "1px solid #ddd",
                            color: "#333",
                          }}
                        >
                          {survey.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "center",
                            borderBottom: "1px solid #ddd",
                            color: "#333",
                          }}
                        >
                          {new Date(survey.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "center",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDetailClick(survey.id);
                            }}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={surveyList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Typography variant="h6" gutterBottom>
              There are no registered surveys yet.
            </Typography>
          )}
        </>
      )}

      {/* Modal for Company Registration */}
      <Modal open={openCompanyModal} onClose={handleCancelCompanyModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            maxHeight: "90vh",
            overflowY: "auto",
            p: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Register Company
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="name"
                variant="outlined"
                value={companyData.name}
                onChange={(event) =>
                  setCompanyData({ ...companyData, name: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Upload Logo
              </Typography>
              <Input type="file" fullWidth onChange={handleFileChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Background Color"
                type="color"
                name="backGroundColor"
                value={companyData.backGroundColor}
                onChange={(event) =>
                  setCompanyData({
                    ...companyData,
                    backGroundColor: event.target.value,
                  })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Text Color"
                type="color"
                name="textColor"
                value={companyData.textColor}
                onChange={(event) =>
                  setCompanyData({
                    ...companyData,
                    textColor: event.target.value,
                  })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCompany}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancelCompanyModal}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>

      {/* Modal for Adding New Survey */}
      <Modal open={openSurveyModal} onClose={handleCancelSurveyModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            p: 4,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Survey
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Survey Name"
                variant="outlined"
                value={surveyName}
                onChange={(e) => setSurveyName(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePublish}
              >
                Publish
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSaveAsDraft}
              >
                Save as Draft
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelSurveyModal}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Draft;
