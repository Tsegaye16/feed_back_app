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
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
const { Title, Text } = Typography;
// Sample data

// Color configuration for PieChart
const COLORS = ["#FF4D4F", "#52C41A", "#FAAD14"];
const themeStyles: any = {
  light: {
    background: "#ffffff",
    color: "#000000",
    cardShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    cardBackground: "#f9f9f9",
    answerColor: "#1DA57A",
    cardTitle: {
      font: "16px",
      fontWeight: 500,
      color: "rgba(0, 0, 0, 0.85)",
    },
  },
  dark: {
    background: "#1f1f1f",
    color: "#ffffff",
    cardShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
    cardBackground: "#2b2b2b",
    answerColor: "#52c41a",
    cardTitle: {
      font: "16px",
      fontWeight: 500,
      color: "rgba(255, 255, 255, 0.85)",
    },
  },
};

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
    (state: any) => state.recentFeedback?.recentFeedback?.data
  );

  const barData = statData?.dailyAnswersThisWeek;
  const pieData = [
    { name: "Negative", value: statData?.averageSentiment?.NEGATIVE },
    { name: "Positive", value: statData?.averageSentiment?.POSITIVE },
    { name: "Neutral", value: statData?.averageSentiment?.NEUTRAL },
  ];

  const theme = useSelector((state: any) => state.theme);
  const styles = themeStyles[theme];
  return (
    <div
      style={{
        padding: "20px",
        //backgroundColor: styles.background,
        color: styles.color,
      }}
    >
      <Timeline style={{ padding: "10px 0" }}>
        <Title>Todays feed back</Title>
        {todayData && todayData.length > 0 ? (
          todayData.map((feedback: any, index: number) => (
            <Timeline.Item
              key={index}
              dot={<span style={{ fontSize: "14px" }}>⬤</span>}
              style={{ paddingBottom: "20px" }}
            >
              <Card
                title={
                  <Text
                    style={{
                      color: styles.color,
                      // backgroundColor: styles.cardBackground,
                    }}
                  >
                    Feedback Received:{" "}
                    {moment(feedback.timestamp).format("h:mm:ss a")}
                  </Text>
                }
                bordered={false}
                bodyStyle={{ padding: "20px" }}
                style={{
                  marginBottom: "20px",
                  borderRadius: "10px",
                  // boxShadow: styles.cardShadow,
                  backgroundColor: styles.background,
                }}
              >
                <Divider
                  style={{
                    border: `${styles.color}`,
                    color: styles.color,
                  }}
                >
                  Feedback Details
                </Divider>
                {feedback.questionsWithAnswers.map(
                  (questionWithAnswer: any, qIndex: number) => (
                    <div key={qIndex} style={{ marginBottom: "25px" }}>
                      <Text
                        strong
                        style={{
                          fontSize: "16px",
                          color: styles.color,
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
                          color: styles.answerColor,
                        }}
                      />
                      <Text
                        strong
                        style={{
                          fontSize: "15px",
                          color: styles.color,
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
                          color: styles.answerColor, // Make answer more prominent with green color
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
          <Text style={{ color: styles.color }}>No feedback available.</Text>
        )}
      </Timeline>
      {/* First Section: Overview */}
      <Row gutter={[16, 16]}>
        {/* Average Rate */}
        <Col
          xs={24}
          sm={12}
          md={6}
          //style={{ backgroundColor: styles.background  }}
        >
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: styles.background,
              border: "none",
              //boxShadow: styles.cardShadow,
            }}
          >
            <Statistic
              title={
                <Text type="secondary" style={{ color: styles.color }}>
                  Average Rate
                </Text>
              }
              value={statData?.averageRate}
              precision={1}
              valueStyle={{ color: styles.color }}
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
              backgroundColor: styles.background,
              border: "none",
            }}
          >
            <Statistic
              title={
                <Text type="secondary" style={{ color: styles.color }}>
                  Total Surveys
                </Text>
              }
              value={
                (statData?.publishedSurveys ?? 0) +
                (statData?.draftedSurvey ?? 0)
              }
              valueStyle={{ color: styles.color }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Statistic
                title={
                  <Text type="secondary" style={{ color: styles.color }}>
                    Published
                  </Text>
                }
                value={statData?.publishedSurveys ?? 0}
                valueStyle={{ color: styles.color }}
              />
              <Statistic
                title={
                  <Text type="secondary" style={{ color: styles.color }}>
                    Drafted
                  </Text>
                }
                value={statData?.draftedSurvey ?? 0}
                valueStyle={{ color: styles.color }}
              />
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
              backgroundColor: styles.background,
              border: "none",
            }}
          >
            <Statistic
              title={
                <Text type="secondary" style={{ color: styles.color }}>
                  Total Feedback
                </Text>
              }
              value={statData?.totalAnswers}
              valueStyle={{ color: styles.color }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Statistic
                title={
                  <Text type="secondary" style={{ color: styles.color }}>
                    Positive
                  </Text>
                }
                value={`${statData?.averageSentiment?.POSITIVE ?? 0}%`}
                valueStyle={{ color: styles.color }}
              />
              <Statistic
                title={
                  <Text type="secondary" style={{ color: styles.color }}>
                    Neutral
                  </Text>
                }
                value={`${statData?.averageSentiment?.NEUTRAL ?? 0}%`}
                valueStyle={{ color: styles.color }}
              />
              <Statistic
                title={
                  <Text type="secondary" style={{ color: styles.color }}>
                    Negative
                  </Text>
                }
                value={`${statData?.averageSentiment?.NEGATIVE ?? 0}%`}
                valueStyle={{ color: styles.color }}
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
              backgroundColor: styles.background,
              border: "none",
            }}
          >
            <Statistic
              title={
                <Text type="secondary" style={{ color: styles.color }}>
                  Weekly Feedback
                </Text>
              }
              value={statData?.thisWeekAnswers}
              valueStyle={{ color: styles.color }}
            />
          </Card>
        </Col>
      </Row>

      {/* Second Section: Feedback Distribution (Pie Chart) */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col xs={24} md={12}>
          <Card
            title={<Text style={styles.cardTitle}>Feedback Distribution</Text>}
            style={{ backgroundColor: styles.background, border: "none" }}
          >
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
          <Card
            title={
              <Text style={styles.cardTitle}>Weekly Feedback (Bar Chart)</Text>
            }
            style={{ backgroundColor: styles.background, border: "none" }}
          >
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
