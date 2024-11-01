import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "primereact/editor";
import {
  Avatar,
  Typography,
  Card,
  Radio,
  Checkbox,
  Rate,
  Button,
  Form,
  message,
  Progress,
  Alert,
} from "antd";

import "antd/dist/reset.css";
import { getPreviewData } from "../../redux/action/company";
import { submitAnswer } from "../../redux/action/answer";

const { Title } = Typography;

//localhost
const Customer = () => {
  const dispatch: any = useDispatch();
  const { companyName, surveyId } = useParams();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] = useState<any>({}); // Store all responses
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getPreviewData(companyName, surveyId));
    };

    fetchData();
  }, [companyName, dispatch, surveyId]);

  const previewData = useSelector((state: any) => state.preview?.previewData);
  const questions = previewData?.questions || [];
  const companyInfo = previewData?.CompanyInfo;

  // Handler to collect responses
  const handleResponseChange = (questionId: any, value: any) => {
    setResponses((prev: any) => ({ ...prev, [questionId]: value }));
  };

  // Handler to go to the next question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handler to go to the previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    const formattedResponses = Object.entries(responses).map(
      ([questionId, answer]) => ({
        id: questionId,
        surveyId: surveyId,
        answer,
      })
    );

    const response = await dispatch(submitAnswer(formattedResponses));
    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      setIsSubmitted(true);
    } else if (response?.error) {
      message.error(`${response.error}`);
    } else {
      message.error("Error submitting feedBack");
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const answeredCount = Object.keys(responses).length;
    return (answeredCount / questions.length) * 100;
  };

  // If no preview data, return an error message
  if (!previewData) {
    return (
      <Alert
        message="Error"
        description="Something went wrong..."
        type="error"
        showIcon
      />
    );
  }

  if (!questions) {
    return (
      <Alert
        message="No Questions"
        description="There are no survey questions."
        type="info"
        showIcon
      />
    );
  }
  if (isSubmitted) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Thank you for your feedback!</Title>
        <p>Your responses have been submitted successfully.</p>
      </div>
    );
  }
  return (
    <div
      style={{
        backgroundColor: companyInfo.backGroundColor,
        minHeight: "100vh",
      }}
    >
      {/* Company Header */}
      {companyInfo && (
        <div
          style={{
            backgroundColor: companyInfo.backGroundColor || "#fff",
            color: companyInfo.textColor || "#000",
            display: "flex",
            alignItems: "center",
            padding: "18px",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: "0 1px 4px rgba(117, 114, 114, 0.6)",
          }}
        >
          <Avatar
            src={`https://feed-back-app.onrender.com/${companyInfo.logo}`}
            alt={companyInfo.name}
            size={65}
            style={{
              marginRight: "16px",
              objectFit: "cover",
            }}
          />
          <Title
            level={3}
            style={{ margin: 0, color: companyInfo.textColor || "#000" }}
          >
            {companyInfo.name}
          </Title>
        </div>
      )}

      {/* Questions Display */}

      <div style={{ marginTop: "100px", padding: "16px" }}>
        <Progress percent={calculateProgress()} />
      </div>
      <div
        style={{
          padding: "24px",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Render the current question */}
          {questions.length > 0 && (
            <QuestionRenderer
              question={questions[currentIndex]}
              currentIndex={currentIndex}
              responses={responses}
              onChange={handleResponseChange}
            />
          )}

          {/* Navigation Buttons */}
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="primary"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                style={{ color: companyInfo.textColor }}
              >
                Previous
              </Button>
              <Button
                type="primary"
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                style={{ color: companyInfo.textColor }}
              >
                Next
              </Button>
            </div>
          </Form.Item>

          {/* Submit Button */}
          {currentIndex === questions.length - 1 && (
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit Feedback
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
};

interface QuestionProps {
  question: any;
  index: number;
  selected?: any; // Add the selected prop to hold the user's answer
  onChange: (questionId: any, value: any) => void; // onChange function signature
}

const QuestionRenderer = ({
  question,
  currentIndex,
  responses,
  onChange,
}: any) => {
  const selectedAnswer = responses[question.id] || null; // Use the stored response for the current question
  switch (question.type) {
    case "True/False":
      return (
        <QuestionTrueFalse
          key={question.id}
          index={currentIndex}
          question={question}
          selected={selectedAnswer} // Pass the selected answer here
          onChange={onChange}
        />
      );
    case "Choice":
      return (
        <QuestionChoice
          key={question.id}
          index={currentIndex}
          question={question}
          selected={selectedAnswer} // Pass the selected answer here
          onChange={onChange}
        />
      );
    case "Rate":
      return (
        <QuestionRate
          key={question.id}
          index={currentIndex}
          question={question}
          selected={selectedAnswer} // Pass the selected answer here
          onChange={onChange}
        />
      );
    case "Open":
      return (
        <QuestionOpen
          key={question.id}
          index={currentIndex}
          question={question}
          selected={selectedAnswer} // Pass the selected answer here
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

const QuestionTrueFalse: React.FC<QuestionProps> = ({
  question,
  selected, // Use selected prop to set the value
  onChange,
  index,
}): any => {
  const handleChange = (e: any) => {
    onChange(question.id, e.target.value); // Directly update the selected answer in the parent
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={
          <Title level={5}>
            {index + 1}
            {". "}
            <span dangerouslySetInnerHTML={{ __html: question.text }} />
          </Title>
        }
        style={{ marginBottom: 0 }}
      >
        <Radio.Group onChange={handleChange} value={selected}>
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
const QuestionChoice: React.FC<QuestionProps> = ({
  question,
  selected, // Use selected prop to set the value
  onChange,
  index,
}): any => {
  const handleChange = (val: any) => {
    onChange(question.id, val); // Directly update the selected answer in the parent
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={
          <Title level={5}>
            <span dangerouslySetInnerHTML={{ __html: question.text }} />
          </Title>
        }
        style={{ marginBottom: 0 }}
      >
        {question.singleSelect ? (
          <Radio.Group
            onChange={(e) => handleChange(e.target.value)}
            value={selected}
          >
            {question.options.map((option: string, index: number) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Checkbox.Group onChange={handleChange} value={selected}>
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
const QuestionRate: React.FC<QuestionProps> = ({
  question,
  selected, // Use selected prop to set the value
  onChange,
  index,
}): any => {
  const handleChange = (val: number) => {
    onChange(question.id, val); // Directly update the selected answer in the parent
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={
          <Title level={5}>
            <span dangerouslySetInnerHTML={{ __html: question.text }} />
          </Title>
        }
        style={{ marginBottom: 0 }}
      >
        <Rate onChange={handleChange} value={selected} />
      </Form.Item>
    </Card>
  );
};

// QuestionOpen Component
const QuestionOpen: React.FC<QuestionProps> = ({
  question,
  selected, // Use selected prop to set the value
  onChange,
  index,
}): any => {
  const handleEditorChange = (e: any) => {
    onChange(question.id, e.htmlValue); // Directly update the selected answer in the parent
  };

  return (
    <Card style={cardStyle}>
      <Form.Item
        label={
          <Title level={5}>
            <span dangerouslySetInnerHTML={{ __html: question.text }} />
          </Title>
        }
        style={{ marginBottom: 0 }}
      >
        <Editor
          value={selected}
          onTextChange={handleEditorChange}
          style={{ height: "320px" }}
        />
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

export default Customer;
