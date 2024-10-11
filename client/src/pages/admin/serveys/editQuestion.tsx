import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Form,
  Button,
  Typography,
  Row,
  Col,
  Space,
  message,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import { Editor } from "primereact/editor";

import { updateQuestion } from "../../../redux/action/company"; // Assuming you're using this action for both add/edit

const { Option } = Select;

interface DetailProps {
  onSave: any;
  record?: any; // record prop to receive data for editing
}

const EditQuestion: React.FC<DetailProps> = ({ record, onSave }) => {
  // Initialize state based on whether record exists (edit mode) or not (add mode)
  const [questionText, setQuestionText] = useState(record?.text || "");
  const [questionType, setQuestionType] = useState(record?.type || "");
  const [additionalOption, setAdditionalOption] = useState(
    record?.additionalOption || ""
  );
  const [choices, setChoices] = useState(record?.options || [""]);

  const dispatch = useDispatch();

  // If record changes, update the state (helpful for when the component re-renders with new data)
  useEffect(() => {
    if (record) {
      setQuestionText(record.text || "");
      setQuestionType(record.type || "");
      setAdditionalOption(record.additionalOption || "");
      setChoices(record.options || [""]);
    }
  }, [record]);

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (index: number) => {
    const updatedChoices = choices.filter((_: any, i: any) => i !== index);
    setChoices(updatedChoices);
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = choices.map((choice: any, i: any) =>
      i === index ? value : choice
    );
    setChoices(updatedChoices);
  };

  const handleClose = () => {
    setQuestionText("");
    setQuestionType("");
    setAdditionalOption("");
    setChoices([""]);
    onSave(); // Close modal or clear form
  };

  const handleSubmit = async () => {
    const id = record?.id;
    const questionData = {
      id: record?.id || undefined, // Include ID if in edit mode
      text: questionText,
      type: questionType,
      additionalOption:
        questionType === "True/False" ? additionalOption : undefined,
      serveyId: record?.serveyId || undefined, // Assuming surveyId comes from the record
      singleSelect:
        questionType === "Choice"
          ? additionalOption === "SingleSelect"
          : undefined,
      options: questionType === "Choice" ? choices : undefined,
    };

    const response = await dispatch(updateQuestion(id, questionData) as any);

    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      onSave();
    } else if (response?.error) {
      message.error(`${response.error}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "90%", margin: "0 auto" }}>
      <Typography.Title level={5}>
        {record ? "Edit Question" : "Add New Question"}
      </Typography.Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Question Text" required>
          <Editor
            value={questionText}
            onTextChange={(e: any) => setQuestionText(e.htmlValue)}
            style={{ height: "320px", backgroundColor: "white" }}
          />
        </Form.Item>

        <Form.Item label="Question Type" required>
          <Select
            value={questionType}
            onChange={(value) => setQuestionType(value)}
            placeholder="Select question type"
          >
            <Option value="True/False">True/False</Option>
            <Option value="Rate">Rate</Option>
            <Option value="Choice">Choice</Option>
            <Option value="Open">Open (Essay)</Option>
          </Select>
        </Form.Item>

        {questionType === "True/False" && (
          <Form.Item label="True/False Option" required>
            <Select
              value={additionalOption}
              onChange={(value: any) => setAdditionalOption(value)}
              placeholder="Select true/false option"
            >
              <Option value="True/False">True/False</Option>
              <Option value="Agree/Disagree">Agree/Disagree</Option>
              <Option value="Yes/No">Yes/No</Option>
            </Select>
          </Form.Item>
        )}

        {questionType === "Choice" && (
          <>
            <Form.Item label="Choice Option" required>
              <Select
                value={additionalOption}
                onChange={(value: any) => setAdditionalOption(value)}
                placeholder="Select choice option"
              >
                <Option value="SingleSelect">Single Select</Option>
                <Option value="MultipleSelect">Multiple Select</Option>
              </Select>
            </Form.Item>

            <Typography.Title level={5}>Choices</Typography.Title>

            {choices.map((choice: any, index: any) => (
              <Row
                key={index}
                gutter={16}
                align="middle"
                style={{ marginBottom: 8 }}
              >
                <Col span={20}>
                  <Input
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                  />
                </Col>
                <Col span={4}>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveChoice(index)}
                    disabled={choices.length === 1}
                  />
                </Col>
              </Row>
            ))}

            <Button
              type="dashed"
              onClick={handleAddChoice}
              icon={<PlusOutlined />}
              style={{ width: "100%" }}
            >
              Add Choice
            </Button>
          </>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button htmlType="button" onClick={handleClose}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditQuestion;
