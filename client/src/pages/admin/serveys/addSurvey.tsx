import React, { useState } from "react";
import { Card, Row, Col, Input, Typography, Button, message } from "antd";
//import { addServey } from "../../../redux/action/company";
import { useDispatch } from "react-redux";
import { addServey } from "../../../redux/action/company";

const { Title, Text } = Typography;

interface propType {
  info: any;
  onSave: any;
}

const AddSurvey: React.FC<propType> = ({ info, onSave }) => {
  const [surveyName, setSurveyName] = useState(info.surveyName || "");
  const [secretPhrase, setSecretPhrase] = useState(info.secretePhrase || "");

  console.log("Info: ", info);

  const dispatch = useDispatch();
  const handlePublish = async () => {
    if (surveyName) {
      const response = await dispatch(
        addServey({
          surveyName,
          secretPhrase,
          isPublished: true,
          companyId: info.companyId,
          id: info.editingId,
        }) as any
      );
      if (response?.payload?.message) {
        message.success(`${response?.payload?.message}`);
        onSave();
      } else if (response?.error) {
        message.error(`${response.error}`);
      }
    } else {
      message.error("Survey name is required");
    }
  };

  const handleSaveAsDraft = async () => {
    if (surveyName) {
      const response = await dispatch(
        addServey({
          surveyName,
          secretPhrase,
          isPublished: false,
          companyId: info.companyId,
          id: info.editingId,
        }) as any
      );
      if (response?.payload?.message) {
        message.success(`${response?.payload?.message}`);
        onSave();
      } else if (response?.error) {
        message.error(`${response.error}`);
      }
    } else {
      message.error("Survey name is required");
    }
  };

  const handleCancelSurveyModal = () => {
    onSave();
  };

  return (
    <Card
      style={{
        maxWidth: 600,
        margin: "50px auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        padding: "24px",
      }}
    >
      <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>
        {!info.editingId ? "Add New Survey" : "Updating Survey"}
      </Title>

      <Row gutter={[16, 16]}>
        {/* Survey Name Input */}
        <Col span={24}>
          <Input
            placeholder="Enter Survey Name"
            size="large"
            style={{ borderRadius: "8px" }}
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
          />
        </Col>

        {/* Secret Phrase Input */}
        <Col span={24}>
          <Input
            placeholder="Enter Secret Phrase"
            size="large"
            style={{ borderRadius: "8px" }}
            value={secretPhrase}
            onChange={(e) => setSecretPhrase(e.target.value)}
            addonAfter={
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Unique phrase, you can modify it
              </Text>
            }
          />
        </Col>

        {/* Action Buttons */}
        <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              marginRight: "8px",
              borderRadius: "8px",
              backgroundColor: "#1890ff",
              float: "inline-start",
            }}
            onClick={handlePublish}
          >
            Publish
          </Button>
          <Button
            size="large"
            style={{
              marginRight: "8px",
              borderRadius: "8px",
              float: "-moz-initial",
            }}
            onClick={handleSaveAsDraft}
          >
            Save as Draft
          </Button>
          <Button
            size="large"
            style={{ borderRadius: "8px", float: "inline-end" }}
            onClick={handleCancelSurveyModal}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default AddSurvey;
