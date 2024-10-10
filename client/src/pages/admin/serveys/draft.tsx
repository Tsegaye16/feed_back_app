import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Button, message, Table, Typography, Space, Flex } from "antd";
import { getUserById } from "../../../redux/action/user";
import {
  getCompanyById,
  addServey,
  deleteServey,
  // saveSurveyAsDraft,
} from "../../../redux/action/company";
import { getAllServey } from "../../../redux/action/company";
import {
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// import {  } from "@mui/icons-material";

import { TableRowSelection } from "antd/es/table/interface";

const { Title } = Typography;

interface MyJwtPayload extends JwtPayload {
  id: string;
}

interface onClickType {
  onDetailClick: (surveyId: any) => void; // Update type to string
  onAddCompany: any;
  onAddSurvey: any;
}

const Draft: React.FC<onClickType> = ({
  onDetailClick,
  onAddCompany,
  onAddSurvey,
}) => {
  const dispatch = useDispatch();

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

  // Delete Confirmation detail
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const handleAddSurveyClick = (option: any, event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    if (option === "add") {
      onAddSurvey({
        companyId: company?.id,
        editingId: null,
        secretePhrase: generateSecretPhrase(),
      });
    } else if (option === "edit") {
      const editingId = Array.from(selectedRowKeys)[0];

      const editingSurvey = surveys.find(
        (servey: any) => servey.id === editingId
      );

      onAddSurvey({
        companyId: company?.id,
        editingId: editingId,
        surveyName: editingSurvey?.name,
        secretePhrase: editingSurvey?.secretePhrase || generateSecretPhrase(),
      });
    }
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
          onClick={(event) => {
            event.stopPropagation();
            handleAddSurveyClick("add");
          }}
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
          <Button
            // onClick={() => setOpenCompanyModal(true)}
            onClick={(event) => {
              event.stopPropagation();

              onAddCompany(managerId);
            }}
          >
            Let's Start
          </Button>
        </Paper>
      ) : (
        <Flex gap="middle" vertical>
          <Flex align="center" gap="middle" justify="space-between">
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}

            {selectedRowKeys.length === 1 ? (
              <Button
                type="primary"
                disabled={!hasSelected}
                onClick={(event) => {
                  event.stopPropagation();
                  handleAddSurveyClick("edit");
                }}
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
            scroll={{ x: "max-content" }}
          />
        </Flex>
      )}

      {confirmDialog}
    </Box>
  );
};

export default Draft;
