import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCompanyInfo } from "../../../redux/action/company";
import {
  Button,
  Input,
  Form,
  Typography,
  Row,
  Col,
  Upload,
  Card,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Meta } = Card;

// Define the possible theme types
type Theme = "black" | "white" | "purple";

interface Props {
  managerId: any;
  onSave: any;
}

const AddCompany: React.FC<Props> = ({ managerId, onSave }) => {
  const dispatch = useDispatch();

  const [companyData, setCompanyData] = useState<any>({
    name: "",
    logo: null,
    backgroundColor: "#000000", // default to black theme
    textColor: "#FFFFFF", // opposite of black
    theme: "black", // default theme
  });

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj; // Directly get the file object
    if (file) {
      setCompanyData((prevData: any) => ({
        ...prevData,
        logo: file, // Store the file object
      }));
    } else {
      message.error("Failed to upload logo. Please try again.");
    }
  };

  const themes: Record<Theme, { backgroundColor: string; textColor: string }> =
    {
      black: {
        backgroundColor: "#000000", // Black background
        textColor: "#FFFFFF", // White text for visibility
      },
      white: {
        backgroundColor: "#FFFFFF", // White background
        textColor: "#000000", // Black text for contrast
      },
      purple: {
        backgroundColor: "#6A0DAD", // Purple background
        textColor: "#FFFFFF", // White text for better contrast
      },
    };

  // Rest of the component remains the same

  // Handle theme change
  const handleThemeChange = (selectedTheme: Theme) => {
    setCompanyData({
      ...companyData,
      backgroundColor: themes[selectedTheme].backgroundColor,
      textColor: themes[selectedTheme].textColor,
      theme: selectedTheme,
    });
  };

  // Handle saving company info
  const handleSaveCompany = async () => {
    const formData = new FormData();
    formData.append("name", companyData.name);
    if (companyData.logo) {
      formData.append("logo", companyData.logo);
    }
    formData.append("backgroundColor", companyData.backgroundColor);
    formData.append("textColor", companyData.textColor);
    formData.append("managerId", managerId);

    try {
      const response = await dispatch(addCompanyInfo(formData) as any);

      if (response?.payload?.message) {
        message.success(`${response?.payload?.message}`);
        onSave();
      } else if (response?.error) {
        message.error(`${response.error}`);
      }
    } catch (error) {
      message.error("Failed to save company info. Please try again.");
    }
  };

  const handleCancelCompany = () => {
    onSave();
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={3}>Register Company</Title>
      <Form layout="vertical" onFinish={handleSaveCompany}>
        <Form.Item
          label="Company Name"
          name="name"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input
            value={companyData.name}
            onChange={(e) =>
              setCompanyData({ ...companyData, name: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item label="Upload Logo">
          <Upload
            name="logo"
            listType="picture"
            maxCount={1}
            //  beforeUpload={() => false} // Prevent auto-upload
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Select Theme">
          <Row gutter={[10, 16]} justify="start">
            {Object.keys(themes).map((themeKey) => {
              const theme = themeKey as Theme;
              return (
                <Col
                  xs={8} // For mobile responsiveness (8 spans per button in small screens)
                  sm={6} // For slightly larger screens (6 spans per button)
                  md={4} // For medium screens (4 spans per button)
                  lg={3} // For large screens (3 spans per button)
                  key={theme}
                >
                  <Button
                    style={{
                      backgroundColor: themes[theme].backgroundColor,
                      color: themes[theme].textColor,
                      border:
                        companyData.theme === theme
                          ? "4px solid #1890ff"
                          : "1px solid #f0f0f0",
                      width: "100%", // Ensure the button takes full width of the column
                      height: 40,
                    }}
                    onClick={() => handleThemeChange(theme)}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Form.Item>

        <Row justify="end" gutter={16}>
          <Col>
            <Button onClick={handleCancelCompany}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddCompany;
