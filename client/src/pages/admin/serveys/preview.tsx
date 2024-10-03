import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Typography,
  Card,
  Radio,
  Checkbox,
  Rate,
  Input,
  Button,
  Form,
  message,
} from "antd";
import { getPreviewData } from "../../../redux/action/company";
import "antd/dist/reset.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Preview: React.FC = () => {
  const dispatch: any = useDispatch();
  const { companyName, surveyId } = useParams();

  useEffect(() => {
    dispatch(getPreviewData(companyName, surveyId));
  }, [companyName, dispatch, surveyId]);

  const previewData = useSelector((state: any) => state.preview?.previewData);
  const questions = previewData?.questions || [];
  const companyInfo = previewData?.CompanyInfo;

  // State to hold all responses
  const [responses, setResponses] = useState<any>({});

  // Handler to collect responses
  const handleResponseChange = (questionId: any, value: any) => {
    setResponses((prev: any) => ({ ...prev, [questionId]: value }));
  };

  // Submit handler
  const handleSubmit = () => {
    // Here you would typically dispatch an action to submit the responses
    console.log("User Responses:", responses);
    message.success("Thank you for your feedback!");
  };

  // Group questions by their type in the required order
  const groupedQuestions = {
    TrueFalse: questions.filter((q: any) => q.type === "True/False"),
    Choice: questions.filter((q: any) => q.type === "Choice"),
    Rate: questions.filter((q: any) => q.type === "Rate"),
    Open: questions.filter((q: any) => q.type === "Open"),
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      {/* Company Header */}
      {companyInfo && (
        <div
          style={{
            backgroundColor: companyInfo.backGroundColor || "#fff",
            color: companyInfo.textColor || "#000",
            display: "flex",
            alignItems: "center",
            padding: "16px",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Avatar
            src={`http://localhost:4000/${companyInfo.logo}`}
            alt={companyInfo.name}
            size={65}
            style={{ marginRight: "16px", objectFit: "cover" }}
          />
          <Title level={3} style={{ margin: 0 }}>
            {companyInfo.name}
          </Title>
        </div>
      )}

      {/* Questions Display */}
      <div
        style={{
          padding: "24px",
          marginTop: "100px",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Render all question types */}
          {(
            Object.keys(groupedQuestions) as (keyof typeof groupedQuestions)[]
          ).map((type) =>
            groupedQuestions[type].map((question: any) => {
              switch (type) {
                case "TrueFalse":
                  return (
                    <QuestionTrueFalse
                      key={question.id}
                      question={question}
                      onChange={handleResponseChange}
                    />
                  );
                case "Choice":
                  return (
                    <QuestionChoice
                      key={question.id}
                      question={question}
                      onChange={handleResponseChange}
                    />
                  );
                case "Rate":
                  return (
                    <QuestionRate
                      key={question.id}
                      question={question}
                      onChange={handleResponseChange}
                    />
                  );
                case "Open":
                  return (
                    <QuestionOpen
                      key={question.id}
                      question={question}
                      onChange={handleResponseChange}
                    />
                  );
                default:
                  return null;
              }
            })
          )}

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ marginTop: "24px" }}
            >
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

// QuestionTrueFalse Component
interface QuestionProps {
  question: any;
  onChange: (questionId: any, value: any) => void;
}

const QuestionTrueFalse: React.FC<QuestionProps> = ({ question, onChange }) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: any) => {
    setValue(e.target.value);
    onChange(question.id, e.target.value);
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={<Title level={5}>{question.text}</Title>}
        required
        style={{ marginBottom: 0 }}
      >
        <Radio.Group onChange={handleChange} value={value}>
          {question.additionalOption.split("/").map((option: string) => (
            <Radio key={option} value={option}>
              {option}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </Card>
  );
};

// QuestionChoice Component
const QuestionChoice: React.FC<QuestionProps> = ({ question, onChange }) => {
  const [value, setValue] = useState<any>(question.singleSelect ? "" : []);

  const handleChange = (val: any) => {
    setValue(val);
    onChange(question.id, val);
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={<Title level={5}>{question.text}</Title>}
        required
        style={{ marginBottom: 0 }}
      >
        {question.singleSelect ? (
          <Radio.Group
            onChange={(e) => handleChange(e.target.value)}
            value={value}
          >
            {question.options.map((option: string, index: number) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Checkbox.Group onChange={handleChange} value={value}>
            {question.options.map((option: string, index: number) => (
              <Checkbox key={index} value={option}>
                {option}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )}
      </Form.Item>
    </Card>
  );
};

// QuestionRate Component
const QuestionRate: React.FC<QuestionProps> = ({ question, onChange }) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (val: number) => {
    setValue(val);
    onChange(question.id, val);
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={<Title level={5}>{question.text}</Title>}
        required
        style={{ marginBottom: 0 }}
      >
        <Rate onChange={handleChange} value={value} />
      </Form.Item>
    </Card>
  );
};

// QuestionOpen Component
const QuestionOpen: React.FC<QuestionProps> = ({ question, onChange }) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange(question.id, e.target.value);
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={<Title level={5}>{question.text}</Title>}
        required
        style={{ marginBottom: 0 }}
      >
        <TextArea rows={4} value={value} onChange={handleChange} />
      </Form.Item>
    </Card>
  );
};

// Common Card Style
const cardStyle = {
  marginBottom: "16px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

export default Preview;