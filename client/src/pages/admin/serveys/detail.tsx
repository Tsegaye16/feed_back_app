import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Typography,
  Space,
  Flex,
  message,
  Modal,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "antd/dist/reset.css";
import { TableRowSelection } from "antd/es/table/interface";
import { deleteQuestionById } from "../../../redux/action/company";
import {
  getQuestionBySurveyId,
  getPreviewParams,
} from "../../../redux/action/company";
import shadows from "@mui/material/styles/shadows";

const { Title, Text } = Typography;

interface DetailProps {
  id: any;
  onClickAddQuestion: any;
  onClickEditQuestion: any;
}

const Detail: React.FC<DetailProps> = ({
  id,
  onClickAddQuestion,
  onClickEditQuestion,
}) => {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState<React.Key | React.Key[]>([]);

  useEffect(() => {
    dispatch(getQuestionBySurveyId(id) as any);
  }, [dispatch, id]);

  const questions = useSelector(
    (state: any) => state.question?.questionDaata?.question
  );
  // console.log("questions: ", questions);

  const handlePreview = async (event: any) => {
    event.preventDefault();

    const response = await dispatch(getPreviewParams(id) as any);
    const companyName = response?.payload?.companyName;
    const surveyId = response?.payload?.serveyId;

    if (companyName && surveyId) {
      const previewUrl = `${window.location.origin}/${companyName}/surveys/preview/${surveyId}`;
      window.open(previewUrl, "_blank");
    } else {
      toast.error("Preview data is missing.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Question Text",
      dataIndex: "text",
      render: (htmlContent: any) => (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ),
      key: "text",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
              onClickEditQuestion(record);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => showModal(record.id)}>
            Delete
          </Button>
          <Button type="link">Show more</Button>
        </Space>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  // Delete button functionality
  const handleDelete = async () => {
    // Convert to array if it's a single ID
    const idsToDelete = Array.isArray(deletingId) ? deletingId : [deletingId];
    if (idsToDelete.length === 0) return;
    const response = await dispatch(deleteQuestionById(idsToDelete) as any);
    console.log("response: ", response);
    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      setSelectedRowKeys(new Set() as any);
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 1000);
      await dispatch(getQuestionBySurveyId(id) as any);
      message.success(`${response?.payload?.message}`);
    }
  };
  // Modal for confirm to delete the question
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (idOrIds: React.Key | React.Key[]) => {
    setDeletingId(idOrIds);
    setOpen(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const confirmModal = (
    <Modal
      title="Title"
      open={open}
      onOk={handleDelete}
      // onClick={() => handleDelete(record.id)}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <p>You are deleting a question</p>
    </Modal>
  );

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <Title level={5} style={{ marginBottom: "20px" }}>
        Survey Detail
      </Title>

      {/* Summary Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ textAlign: "center" }}>
            <Title level={5}>Total Questions</Title>
            <Text>{questions ? questions.length : 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ textAlign: "center" }}>
            <Title level={5}>Total Feedback</Title>
            <Text>{100}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ textAlign: "center" }}>
            <Title level={5}>Weekly Feedback</Title>
            <Text>{65}</Text>
          </Card>
        </Col>
      </Row>

      <Row
        justify="space-between"
        gutter={[16, 16]}
        style={{ marginTop: "20px" }}
      >
        <Col>
          <Button type="primary" onClick={handlePreview}>
            Preview Survey
          </Button>
        </Col>
        <Col>
          <Button
            type="default"
            onClick={(e) => {
              e.stopPropagation();
              onClickAddQuestion(id);
            }}
          >
            Add New Question
          </Button>
        </Col>
      </Row>
      <Title level={5} style={{ margin: "20px 20px" }}>
        Table of questions on this survey
      </Title>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle" justify="space-between">
          <Title level={5} type="secondary">
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Title>

          {/* {selectedRowKeys.length === 1 ? (
            <Button type="primary">Edit</Button>
          ) : null} */}
          {selectedRowKeys.length >= 1 ? (
            <Button
              type="primary"
              //disabled={!hasSelected}
              danger
              onClick={() => showModal(selectedRowKeys)}
            >
              Delete
            </Button>
          ) : null}
        </Flex>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={questions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        {confirmModal}
      </Flex>
    </div>
  );
};

export default Detail;
