import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Typography, message } from "antd"; // Import Table, Button, Modal, and Typography from Ant Design
import { DownloadOutlined, CloseOutlined } from "@ant-design/icons";
import { getFeedback, getReport } from "../../../redux/action/answer"; // Import getReport action
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [report, setReport] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <>
          <Button
            type="link"
            onClick={(event) => {
              event.stopPropagation();
              handleFeedbackDetailClick(record);
            }}
          >
            Detail
          </Button>
          <Button
            type="link"
            onClick={() => handleGenerateReport(record.surveyId)}
          >
            Generate report
          </Button>
        </>
      ),
    },
  ];

  // Handler to dispatch getReport action
  const handleGenerateReport = async (surveyId: string) => {
    const response = await dispatch(getReport(surveyId) as any);
    if (response.payload) {
      setReport(response.payload.data);
      setIsModalVisible(true);
    } else {
      message.error("Failed to generate report.");
    }
  };

  // Handler to download the report as PDF
  const handleDownloadReport = () => {
    if (report) {
      const doc = new jsPDF();
      doc.text("Feedback Report", 10, 10);

      // Use the autoTable plugin to create a table
      autoTable(doc, {
        startY: 20,
        html: `<div>${report}</div>`,
      });

      doc.save("feedback_report.pdf");
    }
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setReport(null);
  };

  return (
    <div>
      <h2>Feedback</h2>
      {/* Ant Design Table component */}
      <Table<FeedbackType>
        columns={columns}
        dataSource={feedback}
        rowKey="surveyId" // Ensures unique key for each row
        loading={loading} // Set loading state to true when data is being fetched
        scroll={{ x: "max-content" }}
      />
      {/* Modal to display the report */}
      <Modal
        title="Feedback Report"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={handleDownloadReport}
          >
            Download
          </Button>,
          <Button
            key="close"
            icon={<CloseOutlined />}
            onClick={handleCloseModal}
          >
            Close
          </Button>,
        ]}
      >
        <Typography.Paragraph>{report}</Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default FeedBack;
