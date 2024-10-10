import React from "react";
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
} from "recharts";

// Sample data
const feedbackData = {
  averageRate: 4.2,
  totalSurveys: { published: 12, drafted: 4 },
  feedback: { positive: 25, neutral: 10, negative: 5 },
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
  { name: "Negative", value: feedbackData.feedback.negative },
  { name: "Positive", value: feedbackData.feedback.positive },
  { name: "Neutral", value: feedbackData.feedback.neutral },
];

// Bar chart data (weekly feedback)
const barData = Object.entries(feedbackData.weeklyFeedback).map(
  ([day, value]) => ({
    day,
    feedback: value,
  })
);

const DetailDashboard = () => {
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
              value={
                feedbackData.totalSurveys.published +
                feedbackData.totalSurveys.drafted
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
                value={feedbackData.totalSurveys.published}
              />
              <Statistic
                title="Drafted"
                value={feedbackData.totalSurveys.drafted}
              />
            </div>
          </Card>
        </Col>
        {/* Total Feedback */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Feedback"
              value={
                feedbackData.feedback.positive +
                feedbackData.feedback.neutral +
                feedbackData.feedback.negative
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
                title="Positive"
                value={feedbackData.feedback.positive}
              />
              <Statistic
                title="Neutral"
                value={feedbackData.feedback.neutral}
              />
              <Statistic
                title="Negative"
                value={feedbackData.feedback.negative}
              />
            </div>
          </Card>
        </Col>
        {/* Weekly Feedback */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Weekly Feedback"
              value={Object.values(feedbackData.weeklyFeedback).reduce(
                (a, b) => a + b,
                0
              )}
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

        {/* Third Section: Weekly Feedback (Bar Chart) */}
        <Col xs={24} md={12}>
          <Card title="Weekly Feedback (Bar Chart)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="feedback" fill="#1890FF" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetailDashboard;
