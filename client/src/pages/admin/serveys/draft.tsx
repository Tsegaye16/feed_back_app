import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Button, message, Table, Typography, Space, Flex, Modal } from "antd";
import { getUserById } from "../../../redux/action/user";
import {
  getCompanyById,
  deleteServey,
  publishSurvey,
} from "../../../redux/action/company";
import { getAllServey } from "../../../redux/action/company";
import { Box, Paper } from "@mui/material";

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

  const surveyList = Array.isArray(surveys)
    ? surveys.filter((survey: any) => survey.isPublished === false)
    : [];

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
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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

    const response = await dispatch(deleteServey(selectedIds) as any);
    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      message.success(response.payload.message);

      setSelectedRowKeys(new Set() as any);
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 1000);
      setOpen(false);
    }
    dispatch(getAllServey(company.id) as any);

    setSelectedSurveys(new Set());
  };
  const [confirmLoading, setConfirmLoading] = useState(false);
  const confirmDialog = (
    <Modal
      title="Be care full"
      open={open}
      onOk={() => handleDeleteSurveys(selectedRowKeys)}
      confirmLoading={confirmLoading}
      onCancel={handleClose}
    >
      <p>You are deleting a survey</p>
    </Modal>
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
          <Button type="link" onClick={() => openPyblishDialog(record.id)}>
            Publish
          </Button>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishingId, setPublishingId] = useState("");
  const hasSelected = selectedRowKeys.length > 0;
  const handlePublish = async (surveyId: any) => {
    const response = await dispatch(publishSurvey(surveyId) as any);

    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      setSelectedRowKeys(new Set() as any);
      message.success(`${response.payload.message}`);
      dispatch(getAllServey(company.id) as any);
      setPublishOpen(false);
    }
  };

  const openPyblishDialog = (publishingId: string) => {
    setPublishOpen(true);
    setPublishingId(publishingId);
  };

  const publishConfirmDialog = (
    <Modal
      title="Be care full"
      open={publishOpen}
      onOk={() => handlePublish(publishingId)}
      confirmLoading={confirmLoading}
      onCancel={handleClose}
    >
      <p>You are publishing a survey</p>
    </Modal>
  );
  return (
    <Box
      component="section"
      sx={{ p: 3, width: "100%", backgroundColor: "white" }}
    >
      {/* Page Heading */}
      <Flex
        align="center"
        gap="middle"
        justify="space-between"
        style={{
          borderBottom: "1px #FAF9F6 solid",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <Title level={5} style={{ marginBottom: "20px" }}>
          Drafted Surveys
        </Title>
      </Flex>

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

      {!company ? (
        <Paper sx={{ p: 3, mb: 3, textAlign: "start" }}>
          <Title level={5}>
            You have to register your company before proceeding to other tasks.
          </Title>
          <Button
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
          <Flex align="center" gap="middle">
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}

            {selectedRowKeys.length === 1 ? (
              <Button
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
              <Button danger onClick={handleClickOpen}>
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
      {publishConfirmDialog}
      {confirmDialog}
    </Box>
  );
};

export default Draft;
