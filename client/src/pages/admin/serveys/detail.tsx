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
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

import "antd/dist/reset.css";
import { TableRowSelection } from "antd/es/table/interface";
import {
  deleteQuestionById,
  sortQuestion,
} from "../../../redux/action/company";
import {
  getQuestionBySurveyId,
  getPreviewParams,
} from "../../../redux/action/company";
//import shadows from "@mui/material/styles/shadows";
import Box from "@mui/material/Box";

const { Title, Text } = Typography;

const DragHandle = SortableHandle(() => (
  <span style={{ cursor: "move" }}>⠿</span>
));

const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

interface DetailProps {
  id: any;
  onClickAddQuestion: any;
  onClickEditQuestion: any;
  onSave: any;
}

const Detail: React.FC<DetailProps> = ({
  id,
  onClickAddQuestion,
  onClickEditQuestion,
  onSave,
}) => {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState<React.Key | React.Key[]>([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    dispatch(getQuestionBySurveyId(id) as any);
  }, [dispatch, id]);

  const questionsFromState = useSelector(
    (state: any) => state.question?.questionDaata?.question
  );

  useEffect(() => {
    setQuestions(questionsFromState);
  }, [questionsFromState]);

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: "5%",
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
          <Tooltip title="drag">
            <DragHandle />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const newQuestions = arrayMoveImmutable(questions, oldIndex, newIndex);
    setQuestions(newQuestions);
    //onSave(newQuestions); // Persist the new order to the backend if needed
    const updatedQuestions = newQuestions.map((question: any, index: any) => ({
      ...question,
      index: index + 1,
    }));

    const idAndIndexArray = updatedQuestions.map((question: any) => ({
      id: question.id,
      index: question.index,
    }));
    await dispatch(sortQuestion(idAndIndexArray) as any);
    await dispatch(getQuestionBySurveyId(id) as any);
  };

  const DraggableBodyRow = ({ className, style, ...restProps }: any) => {
    const index = questions?.findIndex(
      (x: any) => x.id === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const DraggableTableBody = (props: any) => (
    <SortableBody useDragHandle onSortEnd={onSortEnd} {...props} />
  );

  const handlePreview = async (event: any) => {
    event.preventDefault();

    const response = await dispatch(getPreviewParams(id) as any);
    const companyName = response?.payload?.companyName;
    const surveyId = response?.payload?.serveyId;

    if (companyName && surveyId) {
      const previewUrl = `${window.location.origin}/${companyName}/surveys/preview/${surveyId}`;
      window.open(previewUrl, "_blank");
    } else {
      message.error("Preview data is missing.");
    }
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
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
    setOpen(false);
  };
  const confirmModal = (
    <Modal
      title="Be care full"
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
    <div style={{ padding: "20px", backgroundColor: "white" }}>
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
          Survey Detail
        </Title>
        <Tooltip title="Back">
          <Button type="link" onClick={() => onSave()}>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              className="fill-current text-gray-800 ml-6 w-5"
              style={{ width: "20px", marginLeft: "1rem", fill: "#4a4a4a" }} // Add custom styles for the SVG
            >
              <path d="M22 3.59375L20.40625 4.8125L1.40625 19.1875L0.34375 20L1.40625 20.8125L20.40625 35.1875L22 36.40625L22 26.09375C34.339844 26.347656 40.796875 30.738281 44.1875 35.125C47.679688 39.644531 48 44.0625 48 44.0625L50 44.03125C50 44.03125 50 43.9375 50 43.9375C50 43.9375 50 43.90625 50 43.90625C50.007813 43.710938 50.226563 36.460938 46.78125 29.0625C43.375 21.742188 36.136719 14.414063 22 14.0625 Z M 20 7.625L20 16L21 16C35.167969 16 41.710938 22.9375 44.96875 29.9375C45.914063 31.96875 46.519531 33.917969 46.96875 35.78125C46.582031 35.144531 46.28125 34.519531 45.78125 33.875C41.929688 28.894531 34.550781 24 21 24L20 24L20 32.375L3.65625 20Z"></path>
            </svg>
          </Button>
        </Tooltip>
      </Flex>

      {/* Summary Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ textAlign: "center" }}>
            <Title level={5}>Total Questions</Title>
            <Text>{questions ? questions.length : 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{ textAlign: "center", backgroundColor: "#FDFDFD" }}
          >
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
      <Title level={5} style={{ margin: "20px 20px" }}>
        Table of questions on this survey
      </Title>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            onClickAddQuestion(id);
          }}
        >
          Add New Question
        </Button>
      </Box>

      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
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
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={questions}
          components={{
            body: {
              wrapper: DraggableTableBody,
              row: DraggableBodyRow,
            },
          }}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Button type="default" onClick={handlePreview}>
            Preview Survey
          </Button>
        </Box>
        {confirmModal}
      </Flex>
    </div>
  );
};

export default Detail;
