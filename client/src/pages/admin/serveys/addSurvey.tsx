import React, { useEffect, useState } from "react";
import { Card, Row, Col, Input, Typography, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addServey } from "../../../redux/action/company";
import { checkSecretePhrase } from "../../../redux/action/secretePhrase";
//import { QRCodeCanvas } from "qrcode.react"; // For generating QR Code
//import jsPDF from "jspdf"; // For generating PDF
//import html2canvas from "html2canvas"; // For converting QR Code to image

const { Title, Text } = Typography;

interface propType {
  info: any;
  onSave: any;
  companyName: any;
}

const AddSurvey: React.FC<propType> = ({ info, onSave, companyName }) => {
  const [surveyName, setSurveyName] = useState(info.surveyName || "");
  const [secretPhrase, setSecretPhrase] = useState("");
  const [secretPhraseResponse, setSecretPhraseResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState<
    "success" | "error" | null
  >(null);
  //const [surveyId, setSurveyId] = useState(null);
  const { loading, error } = useSelector((state: any) => state.survey);
  const dispatch = useDispatch();

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

  useEffect(() => {
    const phrase = generateSecretPhrase();
    setSecretPhrase(phrase);
    validateSecretPhrase(phrase);
  }, []);

  const validateSecretPhrase = async (phrase: string) => {
    if (phrase.length === 6) {
      const response = await dispatch(checkSecretePhrase(phrase) as any);
      console.log("responsse: ", response.payload);
      if (response?.error) {
        setSecretPhraseResponse(response.payload);
        setResponseStatus("error");
      } else if (response?.payload?.message) {
        setSecretPhraseResponse(response?.payload?.message);
        setResponseStatus("success");
      }
    }
  };

  const handleSecretPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase(); // Convert input to uppercase
    const filteredInput = input.replace(/[^A-Z]/g, ""); // Allow only uppercase letters A-Z

    setSecretPhrase(filteredInput);

    if (filteredInput.length === 6) {
      validateSecretPhrase(filteredInput); // Validate when length is exactly 6
    } else if (filteredInput.length < 6) {
      setSecretPhraseResponse("Secret phrase must be exactly 6 characters.");
      setResponseStatus("error");
    }
  };

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
        console.log("Editig response: ", response.payload);
        message.success(`${response?.payload?.message}`);
        onSave();
        return response.payload;
      } else if (response?.error) {
        message.error(`${response.error}`);
        return null;
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
      console.log("Response.payload: ", response.payload);
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
        maxWidth: 700,
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
            onChange={handleSecretPhraseChange}
            addonAfter={
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Unique phrase, you can modify it
              </Text>
            }
          />
        </Col>

        {/* Response Message */}
        {secretPhraseResponse && (
          <Col span={24} style={{ marginTop: "8px" }}>
            <Text
              type={responseStatus === "success" ? "success" : "danger"}
              style={{ fontSize: "14px" }}
            >
              {secretPhraseResponse}
            </Text>
          </Col>
        )}

        <Col span={24} style={{ textAlign: "left", marginTop: "16px" }}>
          <Button
            // type="primary"
            size="large"
            style={{
              marginRight: "8px",
              borderRadius: "8px",
            }}
            onClick={handlePublish}
            loading={loading}
          >
            Publish
          </Button>

          <Button
            size="large"
            style={{ marginRight: "8px", borderRadius: "8px" }}
            onClick={handleSaveAsDraft}
            loading={loading}
          >
            Save as Draft
          </Button>
          <Button
            size="large"
            style={{ borderRadius: "8px" }}
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
