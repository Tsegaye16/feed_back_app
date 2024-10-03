import React from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getPreviewParams } from "../../../redux/action/company";
import "antd/dist/reset.css";

const { Title, Text } = Typography;

interface DetailProps {
  id: any;
  onClickAddQuestion: any;
}

const Detail: React.FC<DetailProps> = ({ id, onClickAddQuestion }) => {
  const dispatch = useDispatch();

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
            <Text>{15}</Text>
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

      {/* Action Buttons */}
      <Row justify="space-between" gutter={[16, 16]}>
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
    </div>
  );
};

export default Detail;
