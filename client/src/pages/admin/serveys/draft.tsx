import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Button, message, Table, Typography, Space, Flex } from "antd";
import { getUserById } from "../../../redux/action/user";
import {
  addCompanyInfo,
  getCompanyById,
  addServey,
  deleteServey,
  // saveSurveyAsDraft,
} from "../../../redux/action/company";
import { getAllServey } from "../../../redux/action/company";
import {
  Box,
  Modal,
  TextField,
  Grid,
  Paper,
  Input,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import {  } from "@mui/icons-material";

import { TableRowSelection } from "antd/es/table/interface";

const { Title, Text } = Typography;

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
  const [secretPhrase, setSecretPhrase] = useState("");
  const [selectedSurveys, setSelectedSurveys] = useState<Set<number>>(
    new Set()
  );
  const [editingId, setEditingId] = useState(null);

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

  // Delete Confirmation detail
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    setSurveyName("");
    setSecretPhrase("");
    setOpenSurveyModal(false);
  };
  const generateSecretPhrase = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleSaveAsDraft = async () => {
    if (surveyName) {
      const response = await dispatch(
        addServey({
          surveyName,
          secretPhrase,
          isPublished: false,
          companyId: company?.id,
          id: editingId,
        }) as any
      );
      if (response?.payload?.message) {
        message.success(`${response?.payload?.message}`);
        setOpenSurveyModal(false);
        setSurveyName("");
        setSecretPhrase("");
        dispatch(getAllServey(company.id) as any);
        selectedSurveys.clear();
      } else if (response?.error) {
        message.error(`${response.error}`);
      }
    } else {
      message.error("Survey name is required");
    }
  };

  const handlePublish = async () => {
    if (surveyName) {
      const response = await dispatch(
        addServey({
          surveyName,
          secretPhrase,
          isPublished: true,
          companyId: company?.id,
          id: editingId,
        }) as any
      );
      if (response?.payload?.message) {
        message.success(`${response?.payload?.message}`);
        setOpenSurveyModal(false);
        setSurveyName("");
        setSecretPhrase("");
        dispatch(getAllServey(company.id) as any);
        selectedSurveys.clear();
      } else if (response?.error) {
        message.error(`${response.error}`);
      }
      console.log("response: ", response);
    } else {
      message.error("Survey name is required");
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
  const handleDeleteSurveys = async (idOrIds: React.Key | React.Key[]) => {
    // Convert Set to array
    const selectedIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

    if (selectedIds.length === 0) return; // Ensure there's something to delete

    // Send array of selected IDs to backend
    const response = await dispatch(deleteServey(selectedIds) as any);
    if (response) {
      message.success("Survey deleted successfully!");
      setSelectedRowKeys(new Set() as any);
      setOpen(false);
    }
    dispatch(getAllServey(company.id) as any);

    // Reset selection after deletion
    setSelectedSurveys(new Set());
  };

  const confirmDialog = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"You are deleting survey"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button onClick={() => handleDeleteSurveys(selectedRowKeys)} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleAddSurveyClick = (option: any) => {
    if (option === "add") {
      setEditingId(null);
      setSecretPhrase(generateSecretPhrase());
      setOpenSurveyModal(true);
    } else if (option === "edit") {
      const editingId = Array.from(selectedRowKeys)[0];
      //console.log("surveys: ", surveys);
      const editingSurvey = surveys.find(
        (servey: any) => servey.id === editingId
      );
      //console.log("editingSurvey:", editingSurvey);
      setSurveyName(editingSurvey?.name);
      setSecretPhrase(editingSurvey?.secretePhrase || generateSecretPhrase());
      setEditingId(editingId as any);
      setOpenSurveyModal(true);
    }

    console.log("surveyName: ", surveyName);
  };

  //////// Ant Design Table
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const columns = [
    {
      title: "Survey ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Survey Name",
      dataIndex: "name",
      key: "name",
      render: (htmlContent: string) => (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ),
    },
    {
      title: "Secret Phrase",
      dataIndex: "secretePhrase",
      key: "secretePhrase",
    },
    {
      title: "Date Created",
      dataIndex: "createdAt", // Use the correct dataIndex to access createdAt
      key: "createdAt",
      render: (createdAt: string) => (
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick(record.id); // Make sure onDetailClick is defined
            }}
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Box component="section" sx={{ p: 3, width: "100%" }}>
      {/* Page Heading */}
      <Title level={5} style={{ marginBottom: "20px" }}>
        Drafted Survey
      </Title>

      {/* Add New Survey Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleAddSurveyClick("add")}
          disabled={!company}
        >
          Add New Survey
        </Button>
      </Box>

      {/* Company Check */}
      {!company ? (
        <Paper sx={{ p: 3, mb: 3, textAlign: "start" }}>
          <Title level={5}>
            You have to register your company before proceeding to other tasks.
          </Title>
          <Button onClick={() => setOpenCompanyModal(true)}>Let's Start</Button>
        </Paper>
      ) : (
        <Flex gap="middle" vertical>
          <Flex align="center" gap="middle" justify="space-between">
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}

            {selectedRowKeys.length === 1 ? (
              <Button
                type="primary"
                disabled={!hasSelected}
                onClick={() => handleAddSurveyClick("edit")}
              >
                Edit
              </Button>
            ) : null}
            {selectedRowKeys.length >= 1 ? (
              <Button
                type="primary"
                //disabled={!hasSelected}
                danger
                onClick={handleClickOpen}
              >
                Delete
              </Button>
            ) : null}
          </Flex>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={surveyList}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Flex>
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
          <Title level={5}>Register Company</Title>
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
              <Title level={5}>Upload Logo</Title>
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
              <Button onClick={handleSaveCompany}>Save</Button>
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
          <Title level={5}>
            {!editingId ? "Add New Survey" : "Updating Survey"}
          </Title>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Survey Name"
                value={surveyName}
                onChange={(e) => setSurveyName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Secret Phrase"
                value={secretPhrase}
                onChange={(e) => setSecretPhrase(e.target.value)}
                helperText="This is a unique secret phrase that we sugest, you can change"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button onClick={handlePublish}>Publish</Button>
              <Button onClick={handleSaveAsDraft}>Save as Draft</Button>
              <Button onClick={handleCancelSurveyModal}>Cancel</Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      {confirmDialog}
    </Box>
  );
};

export default Draft;
