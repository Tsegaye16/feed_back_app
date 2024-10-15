import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Statistic, Timeline, Divider, Typography } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { getStatData } from "../../../redux/action/stat";
import { getRecentFeedback } from "../../../redux/action/feedback";
import moment from "moment";
const { Title, Text } = Typography;
// Sample data
const feedbackData = {
  averageRate: 4.2,
  totalSurveys: { published: 12, drafted: 4 },
  feedback: { positive: 5, neutral: 3, negative: 1 },
  weeklyFeedback: {
    Monday: 5,
    Wednesday: 12,
    Tuesday: 8,

    Thursday: 10,
    Friday: 15,
    Saturday: 7,
    Sunday: 3,
  },
};

// Color configuration for PieChart
const COLORS = ["#FF4D4F", "#52C41A", "#FAAD14"];

// Pie chart data (feedback distribution)

// Bar chart data (weekly feedback)
// const barData = Object.entries(feedbackData.weeklyFeedback).map(
//   ([day, value]) => ({
//     day,
//     feedback: value,
//   })
// );

interface propType {
  companyId: any;
}
const DetailDashboard: React.FC<propType> = ({ companyId }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (companyId) {
      dispatch(getStatData(companyId) as any);
      dispatch(getRecentFeedback(companyId) as any);
    }
  }, [companyId, dispatch]);

  const statData = useSelector((state: any) => state.stat?.statData?.data);
  const todayData = useSelector(
    (state: any) => state.recentFeedback?.recentFeedbackData?.data
  );

  const barData = statData?.dailyAnswersThisWeek;
  const pieData = [
    { name: "Negative", value: statData?.averageSentiment?.NEGATIVE },
    { name: "Positive", value: statData?.averageSentiment?.POSITIVE },
    { name: "Neutral", value: statData?.averageSentiment?.NEUTRAL },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <Timeline style={{ padding: "10px 0" }}>
        <Title>Todays feed back</Title>
        {todayData && todayData.length > 0 ? (
          todayData.map((feedback: any, index: number) => (
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
                    {moment(feedback.timestamp).format("h:mm:ss a")}
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
                          __html: questionWithAnswer.answer,
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
      {/* First Section: Overview */}
      <Row gutter={[16, 16]}>
        {/* Average Rate */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Statistic
              title="Average Rate"
              value={statData?.averageRate}
              precision={1}
            />
          </Card>
        </Col>
        {/* Total Surveys */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Statistic
              title="Total Surveys"
              value={
                (statData?.publishedSurveys ?? 0) +
                (statData?.draftedSurvey ?? 0)
              }
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Statistic
                title="Published"
                value={statData?.publishedSurveys ?? 0}
              />
              <Statistic title="Drafted" value={statData?.draftedSurvey ?? 0} />
            </div>
          </Card>
        </Col>
        {/* Total Feedback */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Statistic title="Total Feedback" value={statData?.totalAnswers} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Statistic
                title="Positive"
                value={`${statData?.averageSentiment?.POSITIVE ?? 0}%`}
              />
              <Statistic
                title="Neutral"
                value={`${statData?.averageSentiment?.NEUTRAL ?? 0}%`}
              />
              <Statistic
                title="Negative"
                value={`${statData?.averageSentiment?.NEGATIVE ?? 0}%`}
              />
            </div>
          </Card>
        </Col>
        {/* Weekly Feedback */}
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Statistic
              title="Weekly Feedback"
              value={statData?.thisWeekAnswers}
            />
          </Card>
        </Col>
      </Row>

      {/* Second Section: Feedback Distribution (Pie Chart) */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col xs={24} md={12}>
          <Card title="Feedback Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Weekly Feedback (Bar Chart)">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  interval={0} // Show all labels
                  tick={{ fontSize: 12 }} // Adjust font size
                  angle={-45} // Rotate the labels to fit
                  textAnchor="end" // Align the text at the end
                ></XAxis>

                <YAxis>
                  <Label
                    value="Number of Feedback"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetailDashboard;
