import React, { useEffect, useState } from "react";
import { Card, Row, Col, Input, Typography, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { addServey } from "../../../redux/action/company";
import { checkSecretePhrase } from "../../../redux/action/secretePhrase";
import { QRCodeCanvas } from "qrcode.react"; // For generating QR Code
import jsPDF from "jspdf"; // For generating PDF
import html2canvas from "html2canvas"; // For converting QR Code to image

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
      if (response?.error) {
        setSecretPhraseResponse(response.error);
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

  const generateStyledPdf = async () => {
    const doc = new jsPDF("portrait", "pt", "A4");

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Company Name: " + companyName, 40, 60);

    // Draw a separator line
    doc.setLineWidth(0.5);
    doc.line(40, 70, 550, 70);

    // Add survey name with some styles
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 153);
    doc.text("Get  https://customer-feedback-collector.netlify.app/", 40, 100);

    // Add secret phrase
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Secret Phrase: " + secretPhrase, 40, 130);

    // QR Code - rendered in the HTML and captured as an image
    const qrCodeCanvas = document.getElementById(
      "qr-code"
    ) as HTMLCanvasElement;
    const qrCodeDataURL = qrCodeCanvas.toDataURL("image/png");

    // Add QR code to the PDF
    doc.addImage(qrCodeDataURL, "PNG", 40, 160, 128, 128);

    // Add a label under the QR code
    doc.setFontSize(12);
    doc.text("Scan this QR code to access the survey.", 40, 300);

    // Add footer with page number
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      "Page 1",
      doc.internal.pageSize.width - 50,
      doc.internal.pageSize.height - 30
    );

    // Save or display the PDF
    doc.save("survey_details.pdf");
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

        {/* QR Code and URL Generator */}
        {surveyName && responseStatus === "success" ? (
          <Col span={24} style={{ textAlign: "center", marginTop: "16px" }}>
            <QRCodeCanvas
              id="qr-code"
              value={`https://customer-feedback-collector.netlify.app/${companyName}/surveys/${info.editingId}`}
              size={128}
            />
            <Button
              // type="primary"
              size="large"
              style={{ marginTop: "16px", borderRadius: "8px" }}
              onClick={generateStyledPdf}
            >
              Generate QR Code & PDF
            </Button>
          </Col>
        ) : null}

        {/* Action Buttons */}
        <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              marginRight: "8px",
              borderRadius: "8px",
            }}
            onClick={handlePublish}
          >
            Publish
          </Button>
          <Button
            size="large"
            style={{ marginRight: "8px", borderRadius: "8px" }}
            onClick={handleSaveAsDraft}
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
