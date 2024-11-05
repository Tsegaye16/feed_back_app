import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "antd"; // Import Table and Button from Ant Design
import { getFeedback } from "../../../redux/action/answer";
import styled from "@emotion/styled";

interface FeedbackType {
  surveyId: string;
  surveyName: string;
  answerCount: number | string;
}

interface PropType {
  companyId: string;
  handleFeedbackDetailClick: any;
}

const FeedBack: React.FC<PropType> = ({
  companyId,
  handleFeedbackDetailClick,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedback(companyId) as any);
  }, [companyId, dispatch]);

  // Fetch feedback data from Redux store

  const feedback = useSelector((state: any) => state.answer?.answers?.feedback);
  // Define table columns
  const columns = [
    {
      title: "Survey Name",
      dataIndex: "surveyName",
      key: "surveyName",
    },
    {
      title: "Number of Feedback",
      dataIndex: "answerCount",
      key: "answerCount",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: FeedbackType) => (
        <Button
          type="link"
          onClick={(event) => {
            event.stopPropagation();
            handleFeedbackDetailClick(record);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Feedback</h2>
      {/* Ant Design Table component */}
      <Table<FeedbackType>
        columns={columns}
        dataSource={feedback}
        rowKey="surveyId" // Ensures unique key for each row
      />
    </div>
  );
};

export default FeedBack;
