import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Typography, Space, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getQuestionBySurveyId,
  getPreviewParams,
} from "../../../redux/action/company";
import "antd/dist/reset.css";
import { TableRowSelection } from "antd/es/table/interface";

const { Title, Text } = Typography;

interface DetailProps {
  id: any;
  onClickAddQuestion: any;
}

const Detail: React.FC<DetailProps> = ({ id, onClickAddQuestion }) => {
  const dispatch = useDispatch();
  console.log("Id: ", id);

  useEffect(() => {
    dispatch(getQuestionBySurveyId(id) as any);
  }, [dispatch, id]);

  const questions = useSelector(
    (state: any) => state.question?.questionDaata?.question
  );
  console.log("questions: ", questions);

  const handlePreview = async (event: any) => {
    event.preventDefault();

    const response = await dispatch(getPreviewParams(id) as any);
    const companyName = response?.payload?.companyName;
    const surveyId = response?.payload?.serveyId;

    if (companyName && surveyId) {
      const previewUrl = `${window.location.origin}/${companyName}/surveys/${surveyId}`;
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
            //onClick={() => onEditQuestion(record.id)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            //onClick={() => onDeleteQuestion(record.id)}
          >
            Delete
          </Button>
          <Button
            type="link"
            //onClick={() => onShowQuestion(record.id)}
          >
            Show
          </Button>
        </Space>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

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

      {/* Questions Table */}

      {/* Action Buttons */}
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
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}

          {selectedRowKeys.length === 1 ? (
            <Button
              type="primary"
              //  onClick={start}
              disabled={!hasSelected}
              // loading={loading}
            >
              Edit
            </Button>
          ) : null}
          <Button
            type="primary"
            onClick={start}
            disabled={!hasSelected}
            // loading={loading}
            danger
          >
            Delete
          </Button>
        </Flex>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={questions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Flex>
    </div>
  );
};

export default Detail;
