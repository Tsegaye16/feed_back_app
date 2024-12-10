import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Typography } from "antd"; // Import Table and Button from Ant Design
import { getFeedback } from "../../../redux/action/answer";
import "./style.css";
const { Title } = Typography;

const themeStyles: any = {
  dark: {
    container: {
      backgroundColor: "#333",
      color: "#fff",
    },
    color: "#fff",
  },
  light: {
    container: {
      backgroundColor: "#fff",
      color: "#333",
    },
    color: "black",
  },
};

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getFeedback(companyId) as any).finally(() => {
      setLoading(false); // Set loading to false once data is fetched
    });
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

  const theme = useSelector((state: any) => state.theme);
  const styles = themeStyles[theme];

  return (
    <div style={styles.container}>
      <Title
        level={5}
        style={{
          marginBottom: "20px",
          marginLeft: "30px",
          color: styles.color,
        }}
      >
        Feedback
      </Title>
      {/* Ant Design Table component */}
      <Table<FeedbackType>
        columns={columns}
        dataSource={feedback}
        rowKey="surveyId" // Ensures unique key for each row
        loading={loading} // Set loading state to true when data is being fetched
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default FeedBack;
