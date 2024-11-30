import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  message,
  Table,
  Typography,
  Space,
  Flex,
  Modal,
  Tooltip,
  //QRCode,
} from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode, JwtPayload } from "jwt-decode";

import { getUserById } from "../../../redux/action/user";
import {
  getCompanyById,
  getAllServey,
  deleteServey,
} from "../../../redux/action/company";
import { Box, Paper } from "@mui/material";

import { TableRowSelection } from "antd/es/table/interface";
import jsPDF from "jspdf";
const { Title } = Typography;

interface MyJwtPayload extends JwtPayload {
  id: string;
}

interface onClickType {
  onDetailClick: (surveyId: any) => void; // Update type to string
  onAddCompany: any;
  onAddSurvey: any;
  onSave: any;
}

const Published: React.FC<onClickType> = ({
  onDetailClick,
  onAddCompany,
  onAddSurvey,
  onSave,
}) => {
  const dispatch = useDispatch();

  const [selectedSurveys, setSelectedSurveys] = useState<any>(new Set());
  //const [loading, setLoading] = useState(true);

  const currenTtoken: any = localStorage.getItem("user");

  let userId = "";
  if (currenTtoken) {
    const decoded = jwtDecode<MyJwtPayload>(currenTtoken);
    userId = decoded.id;
  }

  useEffect(() => {
    if (currenTtoken) {
      dispatch(getUserById(userId) as any);
    }
  }, [userId, currenTtoken, dispatch]);

  const user = useSelector((state: any) => state.user?.user);

  const managerId = user?.id;

  console.log("managerId: ", managerId);
  const company = useSelector((state: any) => state.company?.company);

  const surveys = useSelector((state: any) => state.survey?.survey);
  const { loading, error } = useSelector((state: any) => state.survey);
  const surveyList = Array.isArray(surveys)
    ? surveys.filter((survey: any) => survey.isPublished === true)
    : [];

  useEffect(() => {
    if (user) {
      dispatch(getCompanyById(user?.id) as any);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (company?.id) {
      dispatch(getAllServey(company.id) as any).finally(() => {
        //  setLoading(false); // Set loading to false once data is fetched
      });
    }
  }, [company, dispatch]);

  // Handling the company form

  const generateSecretPhrase = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // Handle delete surveys
  const handleDeleteSurveys = async (idOrIds: React.Key | React.Key[]) => {
    // Convert Set to array
    const selectedIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

    if (selectedIds.length === 0) return; // Ensure there's something to delete

    // Send array of selected IDs to backend
    const response = await dispatch(deleteServey(selectedIds) as any);
    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      message.success(response.payload.message);
      // message.success("Survey deleted successfully!");
      setSelectedRowKeys([]);
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 1000);
      setOpen(false);
    }
    //dispatch(getAllServey(company.id) as any);

    // Reset selection after deletion
    setSelectedSurveys([]);
  };

  // Delete Confirmation detail
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [confirmLoading, setConfirmLoading] = useState(false);

  const confirmDialog = (
    <Modal
      title="Be care full"
      open={open}
      onOk={() => handleDeleteSurveys(selectedRowKeys)}
      // onClick={() => handleDelete(record.id)}
      confirmLoading={confirmLoading}
      onCancel={handleClose}
      loading={loading}
    >
      <p>You are deleting a survey</p>
    </Modal>
    // <Dialog
    //   open={open}
    //   onClose={handleClose}
    //   aria-labelledby="alert-dialog-title"
    //   aria-describedby="alert-dialog-description"
    // >
    //   <DialogTitle id="alert-dialog-title">
    //     {"You are deleting survey"}
    //   </DialogTitle>
    //   <DialogContent>
    //     <DialogContentText id="alert-dialog-description">
    //       Are you sure?
    //     </DialogContentText>
    //   </DialogContent>
    //   <DialogActions>
    //     <Button onClick={handleClose}>No</Button>
    //     <Button onClick={() => handleDeleteSurveys(selectedRowKeys)} autoFocus>
    //       Yes
    //     </Button>
    //   </DialogActions>
    // </Dialog>
  );

  // Edit selected servey functionality

  const handleAddSurveyClick = (option: any, event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    if (option === "add") {
      onAddSurvey({
        companyId: company?.id,
        editingId: null,
        secretePhrase: generateSecretPhrase(),
      });
    } else if (option === "edit") {
      const editingId = Array.from(selectedRowKeys)[0];

      const editingSurvey = surveys.find(
        (servey: any) => servey.id === editingId
      );

      onAddSurvey({
        companyId: company?.id,
        editingId: editingId,
        surveyName: editingSurvey?.name,
        secretePhrase: editingSurvey?.secretePhrase || generateSecretPhrase(),
      });
    }
  };
  // QR code

  const qrRef = useRef<HTMLCanvasElement>(null);

  const handleGenerateQRCode = (
    secretePhrase: string,
    surveyId: string
  ): void => {
    console.log("Secret Phrase: ", secretePhrase);
    console.log("Survey ID: ", surveyId);

    const qrCodeCanvas = qrRef.current;

    if (!qrCodeCanvas) return;

    const surveyLink = `https://customer-feedback-collector.netlify.app/`;

    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Access this link", 10, 20);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(surveyLink, 10, 30); // Link text

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Insert the secret phrase:", 10, 50);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(secretePhrase, 10, 60); // Secret phrase text

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Or scan this QR code:", 10, 80);

    // Add QR Code to the PDF (get the canvas and use it as an image)
    const qrCodeImage = qrCodeCanvas.toDataURL("image/png");
    pdf.addImage(qrCodeImage, "PNG", 40, 160, 128, 128); // QR Code position and size
    // Save the PDF
    pdf.save("SurveyQRCode.pdf");
  };

  //////// Ant Design Table
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const columns = [
    {
      title: "Survey Name",
      dataIndex: "name",
      key: "name",
      render: (htmlContent: string) => (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ),
    },
    {
      title: "Secret Phrase",
      dataIndex: "secretePhrase",
      key: "secretePhrase",
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick(record.id);
            }}
          >
            Detail
          </Button>
          <div style={{ display: "none" }}>
            <QRCodeCanvas
              value={`https://customer-feedback-collector.netlify.app/${company?.name}/surveys/${record.id}`}
              size={200}
              ref={qrRef} // You can use ref to capture the canvas
            />
          </div>
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateQRCode(record.secretePhrase, record.id); // Pass record.id as surveyId
            }}
          >
            Generate QR code
          </Button>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Box
      component="section"
      sx={{ p: 3, width: "100%", backgroundColor: "white" }}
    >
      {/* Page Heading */}
      <Flex
        align="center"
        gap="middle"
        justify="space-between"
        style={{
          borderBottom: "1px #FAF9F6 solid",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <Title level={5} style={{ marginBottom: "20px" }}>
          Published Survey
        </Title>
      </Flex>

      {/* Add New Survey Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={(event) => {
            event.stopPropagation();
            handleAddSurveyClick("add");
          }}
          disabled={company.length === 0}
        >
          Add New Survey
        </Button>
      </Box>

      {/* Company Check */}
      {company.length === 0 ? (
        <Paper sx={{ p: 3, mb: 3, textAlign: "start" }}>
          <Title level={5}>
            You have to register your company before proceeding to other tasks.
          </Title>
          <Button
            onClick={(event) => {
              event.stopPropagation();

              onAddCompany(managerId);
            }}
          >
            Let's Start
          </Button>
        </Paper>
      ) : (
        <>
          <Flex gap="middle" vertical>
            <Flex align="center" gap="middle">
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}

              {selectedRowKeys.length === 1 ? (
                <Button
                  // type="primary"
                  disabled={!hasSelected}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddSurveyClick("edit");
                  }}
                  style={{ float: "inline-end" }}
                >
                  Edit
                </Button>
              ) : null}
              {selectedRowKeys.length >= 1 ? (
                <Button
                  // type="primary"
                  danger
                  onClick={handleClickOpen}
                  style={{ float: "inline-end" }}
                >
                  Delete
                </Button>
              ) : null}
            </Flex>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={surveyList}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={loading}
              scroll={{ x: "max-content" }}
            />
          </Flex>
        </>
      )}

      {confirmDialog}
    </Box>
  );
};

export default Published;
