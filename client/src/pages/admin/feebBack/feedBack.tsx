import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd"; // Import Table from Ant Design
import { getFeedback } from "../../../redux/action/answer";
import styled from "@emotion/styled";

interface PropType {
  compmanyId: string; // Update to specific type if possible
}

// Styled component for vertical text
const VerticalText = styled.div`
  writing-mode: vertical-rl; // Rotate text vertically
  transform: rotate(180deg); // Flip text to read from top to bottom
  white-space: nowrap; // Prevent wrapping
`;

const FeedBack: React.FC<PropType> = ({ compmanyId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedback(compmanyId) as any);
  }, [compmanyId, dispatch]);

  // Fetch feedback data from Redux store
  const feedback = useSelector((state: any) => state.answer?.answerDaata);

  // Safety check to ensure feedback and its properties are not undefined
  if (!feedback || !feedback.feedback) {
    return <div>No feedback available</div>;
  }

  // Calculate rowSpan for the survey (based on total questions and answers per survey)
  const tableData = feedback.feedback.flatMap((item: any) =>
    item.questions.flatMap((question: any, questionIndex: number) =>
      question.answers.map((answer: any, answerIndex: number) => ({
        survey: item.survey.name,
        question: question.text,
        type: question.type,
        answer: Array.isArray(answer.text)
          ? answer.text.join(", ") // Convert list of answers to a comma-separated string
          : answer.text.replace(/['"\[\]]/g, ""),
        isPositive: ["Agree", "Yes", "True"].includes(answer.text)
          ? "Yes"
          : "No",
        isNegative: ["Disagree", "No", "False"].includes(answer.text)
          ? "Yes"
          : "No",
        isNeutral: answer.text === "Neutral" ? "Yes" : "No",
        // Row spans
        surveyRowSpan:
          questionIndex === 0 && answerIndex === 0
            ? item.questions.reduce(
                (acc: number, q: any) => acc + q.answers.length,
                0
              )
            : 0, // Total answers across all questions in the survey
        questionRowSpan: answerIndex === 0 ? question.answers.length : 0, // Row span for questions
      }))
    )
  );

  // Define columns for the table
  const columns = [
    {
      title: "Survey",
      dataIndex: "survey",
      key: "survey",
      render: (text: string, row: any) => ({
        children: <VerticalText>{text}</VerticalText>, // Vertical text
        props: { rowSpan: row.surveyRowSpan }, // Apply rowSpan for Survey column
      }),
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (text: string, row: any) => ({
        children: <div dangerouslySetInnerHTML={{ __html: text }} />, // Render HTML content
        props: { rowSpan: row.questionRowSpan }, // Apply rowSpan for Question column
      }),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text: string, row: any) => ({
        children: text,
        props: { rowSpan: row.questionRowSpan }, // Apply rowSpan for Type column
      }),
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      render: (htmlContent: string) => (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ),
    },
    {
      title: "Is Positive",
      dataIndex: "isPositive",
      key: "isPositive",
    },
    {
      title: "Is Negative",
      dataIndex: "isNegative",
      key: "isNegative",
    },
    {
      title: "Is Neutral",
      dataIndex: "isNeutral",
      key: "isNeutral",
    },
  ];

  return (
    <div>
      <h2>Feedback</h2>
      <Table
        dataSource={tableData}
        columns={columns}
        rowKey={(record: any) =>
          `${record.survey}-${record.question}-${record.answer}`
        } // Unique key for each row
        pagination={false} // Disable pagination if not needed
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default FeedBack;
