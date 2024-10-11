import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Statistic } from "antd";
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
const pieData = [
  { name: "Negative", value: 1 },
  { name: "Positive", value: 5 },
  { name: "Neutral", value: 3 },
];

// Bar chart data (weekly feedback)
const barData = Object.entries(feedbackData.weeklyFeedback).map(
  ([day, value]) => ({
    day,
    feedback: value,
  })
);

interface propType {
  companyId: any;
}
const DetailDashboard: React.FC<propType> = ({ companyId }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (companyId) {
      dispatch(getStatData(companyId) as any);
    }
  }, [companyId, dispatch]);

  const statData = useSelector((state: any) => state.stat?.statData?.data);
  console.log("statData: ", statData?.dailyAnswersThisWeek);
  const barData = statData?.dailyAnswersThisWeek;
  return (
    <div style={{ padding: "20px" }}>
      {/* First Section: Overview */}
      <Row gutter={[16, 16]}>
        {/* Average Rate */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Rate"
              value={feedbackData.averageRate}
              precision={1}
            />
          </Card>
        </Col>
        {/* Total Surveys */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Surveys"
              value={statData?.publishedSurveys + statData?.draftedSurvey}
            />
          </Card>
        </Col>
        {/* Total Feedback */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Feedback" value={statData?.totalAnswers} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Statistic title="Positive" value={5} />
              <Statistic title="Neutral" value={3} />
              <Statistic title="Negative" value={1} />
            </div>
          </Card>
        </Col>
        {/* Weekly Feedback */}
        <Col xs={24} sm={12} md={6}>
          <Card>
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
