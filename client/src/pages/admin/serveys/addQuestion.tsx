import React, { useState } from "react";
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

import { addQuestion } from "../../../redux/action/company";

const { TextArea } = Input;
const { Option } = Select;
interface DetailProps {
  id: any;
  onSave: any;
}

const AddQuestion: React.FC<DetailProps> = ({ id, onSave }) => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [additionalOption, setAdditionalOption] = useState("");
  const [choices, setChoices] = useState([""]);

  const dispatch = useDispatch();

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  // Handle removing choice input field
  const handleRemoveChoice = (index: number) => {
    const updatedChoices = choices.filter((_: any, i: any) => i !== index);
    setChoices(updatedChoices);
  };

  // Handle change in choice text
  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = choices.map((choice: any, i: any) =>
      i === index ? value : choice
    );
    setChoices(updatedChoices);
  };

  const handleClose = () => {
    //setOpen(false);
    setQuestionText("");
    setQuestionType("");
    setAdditionalOption("");
    setChoices([""]); // Reset choices on close
    onSave();
  };

  const handleSubmit = async () => {
    const response = await dispatch(
      addQuestion({
        text: questionText,
        type: questionType,
        additionalOption:
          questionType === "True/False" ? additionalOption : undefined,
        serveyId: id,
        singleSelect:
          questionType === "Choice"
            ? additionalOption === "SingleSelect"
            : undefined,
        options: questionType === "Choice" ? choices : undefined,
      }) as any
    );

    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      onSave();
    } else if (response?.error) {
      message.error(`${response.error}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "90%", margin: "0 auto" }}>
      <Typography.Title level={5}>Adding New Question</Typography.Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Question Text" required>
          {/* <TextArea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here"
            rows={3}
          /> */}
          <Editor
            value={questionText}
            onTextChange={(e: any) => setQuestionText(e.htmlValue)}
            style={{ height: "320px", backgroundColor: "white" }}
          />
        </Form.Item>

        <Form.Item label="Question Type" required style={{ width: "50%" }}>
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
          <Form.Item
            label="True/False Option"
            required
            style={{ width: "50%" }}
          >
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
            <Form.Item label="Choice Option" required style={{ width: "50%" }}>
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

            {choices.map((choice, index) => (
              <Row
                key={index}
                gutter={16}
                align="middle"
                style={{ marginBottom: 8, width: "50%" }}
              >
                <Col span={20} style={{ width: "50%" }}>
                  <Input
                    // style={{ width: "50%" }}
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
              style={{ width: "50%" }}
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

export default AddQuestion;
