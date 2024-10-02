import React, { useState } from "react";
import { Input, Select, Form, Button, Typography, Row, Col, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const Sample: React.FC = () => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [additionalOption, setAdditionalOption] = useState("");
  const [choices, setChoices] = useState([""]);

  const handleAddChoice = () => setChoices([...choices, ""]);
  const handleRemoveChoice = (index: number) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
  };
  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = choices.map((choice, i) =>
      i === index ? value : choice
    );
    setChoices(newChoices);
  };
  const handleSubmit = () => {
    // Handle form submission
    console.log({ questionText, questionType, additionalOption, choices });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "90%", margin: "0 auto" }}>
      <Typography.Title level={5}>Adding New Question</Typography.Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Question Text" required>
          <TextArea
            value={questionText}
            onChange={(e: any) => setQuestionText(e.target.value)}
            placeholder="Enter your question here"
            rows={3}
          />
        </Form.Item>

        <Form.Item label="Question Type" required>
          <Select
            value={questionType}
            onChange={(value: any) => setQuestionType(value)}
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

            {choices.map((choice, index) => (
              <Row
                key={index}
                gutter={16}
                align="middle"
                style={{ marginBottom: 8 }}
              >
                <Col span={20}>
                  <Input
                    value={choice}
                    onChange={(e: any) =>
                      handleChoiceChange(index, e.target.value)
                    }
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
            <Button htmlType="button" onClick={() => console.log("Form reset")}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Sample;
