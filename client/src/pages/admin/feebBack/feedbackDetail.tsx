import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Timeline,
  Typography,
  Divider,
  Tooltip,
  Button,
  Row,
  Col,
} from "antd";
import moment from "moment";
import { getFeedbackDetail } from "../../../redux/action/feedback";
import { CLEAR_DATA } from "../../../constants/types/actionType";

const { Title, Text } = Typography;

interface propType {
  feedbackDetail: any;
  onSave: any;
}

const FeedbackDetail: React.FC<propType> = ({ feedbackDetail, onSave }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedbackDetail(feedbackDetail.surveyId) as any);

    return () => {
      dispatch({ type: CLEAR_DATA });
    };
  }, [dispatch, feedbackDetail.surveyId]);

  const data = useSelector((state: any) => state.feedback?.feedbackData?.data);
  console.log("data: ", data);
  return (
    <div style={{ padding: "20px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <Title level={4} style={{ marginBottom: 0 }}>
            Customer Feedback Details
          </Title>
        </Col>
        <Col>
          <Tooltip title="Back" placement="top">
            <Button
              type="link"
              onClick={() => onSave()}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                color: "#595959",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                className="fill-current text-gray-800 ml-6 w-5"
                style={{ width: "20px", fill: "#595959" }}
              >
                <path d="M22 3.59375L20.40625 4.8125L1.40625 19.1875L0.34375 20L1.40625 20.8125L20.40625 35.1875L22 36.40625L22 26.09375C34.339844 26.347656 40.796875 30.738281 44.1875 35.125C47.679688 39.644531 48 44.0625 48 44.0625L50 44.03125C50 44.03125 50 43.9375 50 43.9375C50 43.9375 50 43.90625 50 43.90625C50.007813 43.710938 50.226563 36.460938 46.78125 29.0625C43.375 21.742188 36.136719 14.414063 22 14.0625 Z M 20 7.625L20 16L21 16C35.167969 16 41.710938 22.9375 44.96875 29.9375C45.914063 31.96875 46.519531 33.917969 46.96875 35.78125C46.582031 35.144531 46.28125 34.519531 45.78125 33.875C41.929688 28.894531 34.550781 24 21 24L20 24L20 32.375L3.65625 20Z"></path>
              </svg>
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <Timeline style={{ padding: "10px 0" }}>
        {data && data.length > 0 ? (
          data.map((feedback: any, index: number) => (
            <Timeline.Item
              key={index}
              dot={
                <span style={{ fontSize: "14px", color: "#1890ff" }}>⬤</span>
              }
              style={{ paddingBottom: "20px" }}
            >
              <Card
                title={
                  <Text style={{ color: "#1890ff" }}>
                    Feedback Received:{" "}
                    {moment(feedback.timestamp).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </Text>
                }
                bordered={false}
                bodyStyle={{ padding: "20px" }}
                style={{
                  marginBottom: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Divider>Feedback Details</Divider>
                {feedback.questionsWithAnswers.map(
                  (questionWithAnswer: any, qIndex: number) => (
                    <div key={qIndex} style={{ marginBottom: "25px" }}>
                      <Text
                        strong
                        style={{
                          fontSize: "16px",
                          color: "#595959",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Question {qIndex + 1}:
                      </Text>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: questionWithAnswer.question,
                        }}
                        style={{
                          paddingLeft: "10px",
                          marginBottom: "10px",
                          fontStyle: "italic",
                          color: "#3d3d3d",
                        }}
                      />
                      <Text
                        strong
                        style={{
                          fontSize: "15px",
                          color: "#595959",
                          marginTop: "10px",
                        }}
                      >
                        Feed Back:
                      </Text>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: questionWithAnswer.answer.replace(
                            /["\[\]]/g,
                            ""
                          ),
                        }}
                        style={{
                          paddingLeft: "10px",
                          marginTop: "5px",
                          color: "#1DA57A", // Make answer more prominent with green color
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  )
                )}
              </Card>
            </Timeline.Item>
          ))
        ) : (
          <Text>No feedback available.</Text>
        )}
      </Timeline>
    </div>
  );
};

export default FeedbackDetail;
