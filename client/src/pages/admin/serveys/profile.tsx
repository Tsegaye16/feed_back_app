import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, updateProfile } from "../../../redux/action/user";
import { updateCompany } from "../../../redux/action/company"; // Ensure you have updateCompany action
//import styled from "@emotion/styled"; // Use for custom media queries

const { Title } = Typography;
//const { Meta } = Card;

interface UserType {
  name: string;
  email: string;
  id: string;
  image?: string;
}

interface ProfileProps {
  user: UserType;
  company: any;
}

const Profile: React.FC<ProfileProps> = ({ user, company }) => {
  const dispatch = useDispatch();
  console.log("company: ", company);
  const { loading, error } = useSelector((state: any) => state.company);
  const userLoading = useSelector((state: any) => state.user.loading);
  // Define theme options
  const themes: {
    [key: string]: { backGroundColor: string; textColor: string };
  } = {
    black: {
      backGroundColor: "#000000",
      textColor: "#FFFFFF",
    },
    white: {
      backGroundColor: "#FFFFFF",
      textColor: "#000000",
    },
    purple: {
      backGroundColor: "#6A0DAD",
      textColor: "#FFFFFF",
    },
  };

  // State for user data
  const [userData, setUserData] = useState<{
    name: any;
    email: any;
    image: any;
  }>({
    name: "",
    email: "",
    image: null,
  });

  // State for company data
  const [companyData, setCompanyData] = useState<any>({
    name: "",
    logo: null,
    backGroundColor: "white",
    textColor: "black",
  });

  const [isUserChanged, setIsUserChanged] = useState(false);
  const [isCompanyChanged, setIsCompanyChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || null,
      });
    }

    if (company) {
      setCompanyData({
        name: company.name || "",
        logo: company.logo || null,
        backGroundColor: company.backGroundColor || "white",
        textColor: company.textColor || "black",
      });
    }
  }, [user, company]);

  const getSelectedTheme = (): any => {
    const themeKey = Object.keys(themes).find(
      (key) =>
        themes[key].backGroundColor.toLowerCase() ===
        companyData.backGroundColor.toLowerCase()
    );

    return themeKey; // Default to white if no match
  };

  const [selectedTheme, setSelectedTheme] = useState<string>(getSelectedTheme);

  useEffect(() => {
    setSelectedTheme(getSelectedTheme());
  }, [companyData.backGroundColor]);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    setIsUserChanged(true);
  };

  const handleUserImageChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      setUserData((prevData) => ({ ...prevData, image: file }));
      setIsUserChanged(true);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prevData: any) => ({ ...prevData, [name]: value }));
    setIsCompanyChanged(true);
  };

  const handleCompanyLogoChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      setCompanyData((prevData: any) => ({ ...prevData, logo: file }));
      setIsCompanyChanged(true);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleThemeChange = (theme: string) => {
    const selected = themes[theme];
    if (selected) {
      setCompanyData({
        ...companyData,
        backGroundColor: selected.backGroundColor,
        textColor: selected.textColor,
        theme: theme,
      });
      setSelectedTheme(theme);
      setIsCompanyChanged(true);
    }
  };

  const handleEditProfile = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    if (userData.image) {
      formData.append("image", userData.image);
    }

    const response = await dispatch(
      updateProfile({ id: user.id, data: formData }) as any
    );

    if (response?.payload) {
      setUserData({
        name: response.payload.user.name || user.name,
        email: response.payload.user.email || user.email,
        image: response.payload.user.image || user.image,
      });
      message.success(`${response.payload.message}`);
      setIsUserChanged(false);
      // await onUpdate();
    } else if (response?.error) {
      message.error(`${response.error}`);
    } else {
      message.error("Error updating profile");
    }
  };

  const handleEditCompany = async () => {
    const formData = new FormData();
    formData.append("name", companyData.name);
    formData.append("backGroundColor", companyData.backGroundColor);
    formData.append("textColor", companyData.textColor);
    if (companyData.logo) {
      formData.append("logo", companyData.logo);
    }
    const response = await dispatch(
      updateCompany({ id: company.id, companyData: formData }) as any
    );

    if (response?.payload) {
      message.success(`${response.payload.message}`);
      setIsCompanyChanged(false);
      // if (onUpdate) onUpdate();
    } else if (response?.error) {
      message.error(`${response.error}`);
    } else {
      message.error("Error updating company");
    }
  };

  // forgote password functionality
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    const response = await dispatch(
      changePassword({
        currentPassword,
        newPassword,
        email: user?.email,
      }) as any
    );
    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      setShowChangePassword(false);
    } else if (response?.error) {
      message.error(`${response.error}`);
    } else {
      message.error("Error changing password");
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Profile Section */}
      <Col xs={24} sm={24} md={12}>
        <Card title="Profile" bordered={false}>
          <Form layout="vertical">
            <Form.Item label="Profile Photo">
              <Upload
                name="image"
                listType="picture-circle"
                showUploadList={false}
                onChange={handleUserImageChange}
              >
                {userData.image ? (
                  <Avatar
                    src={
                      typeof userData.image === "string"
                        ? `https://feed-back-app.onrender.com/${userData.image}`
                        : URL.createObjectURL(userData.image)
                    }
                    size={100}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Avatar size={100} icon={<PlusOutlined />} />
                )}
              </Upload>
            </Form.Item>

            <Form.Item label="Name">
              <Input
                name="name"
                value={userData.name}
                onChange={handleUserInputChange}
              />
            </Form.Item>

            <Form.Item label="Email">
              <Input
                name="email"
                value={userData.email}
                onChange={handleUserInputChange}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                onClick={handleEditProfile}
                disabled={!isUserChanged}
                icon={<EditOutlined />}
                style={{ marginRight: 8 }}
                loading={userLoading}
              >
                Save
              </Button>
              <Button
                type="default"
                style={{ float: "right" }}
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
          {showChangePassword ? (
            <Form layout="vertical">
              <Form.Item
                label="Current password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter current password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter new and strong password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Row gutter={[8, 8]}>
                  <Col>
                    <Button
                      type="primary"
                      // onClick={handleEditProfile}
                      //disabled={!isUserChanged}
                      icon={<EditOutlined />}
                      style={{ marginRight: 8 }}
                      onClick={handleChangePassword}
                      loading={userLoading}
                    >
                      Save
                    </Button>
                    <Button
                      type="default"
                      style={{ float: "right" }}
                      onClick={() => setShowChangePassword(false)}
                    >
                      cancel
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          ) : null}
        </Card>
      </Col>

      {/* Company Section */}
      {!company ? (
        ""
      ) : (
        <Col xs={24} sm={24} md={12}>
          <Card title="Company" bordered={false}>
            {company ? (
              <Form layout="vertical">
                <Form.Item label="Company Logo">
                  <Upload
                    name="logo"
                    listType="picture-circle"
                    showUploadList={false}
                    onChange={handleCompanyLogoChange}
                  >
                    {companyData.logo ? (
                      <Avatar
                        src={
                          typeof companyData.logo === "string"
                            ? `https://feed-back-app.onrender.com/${companyData.logo}`
                            : URL.createObjectURL(companyData.logo)
                        }
                        size={100}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Avatar size={100} icon={<PlusOutlined />} />
                    )}
                  </Upload>
                </Form.Item>

                <Form.Item label="Company Name">
                  <Input
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyInputChange}
                  />
                </Form.Item>

                <Form.Item label="Theme">
                  <Row gutter={[8, 8]}>
                    {Object.keys(themes).map((themeKey) => (
                      <Col key={themeKey}>
                        <Button
                          style={{
                            backgroundColor: themes[themeKey].backGroundColor,
                            color: themes[themeKey].textColor,
                            border:
                              selectedTheme === themeKey
                                ? "4px solid #1890ff"
                                : "1px solid #f0f0f0",
                            width: 80,
                            height: 40,
                          }}
                          onClick={() => handleThemeChange(themeKey)}
                        >
                          {themeKey}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    onClick={handleEditCompany}
                    disabled={!isCompanyChanged}
                    icon={<EditOutlined />}
                    style={{ marginRight: 8 }}
                    loading={loading}
                  >
                    {loading ? "Saving" : "Save"}
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <div>
                <Title level={5}>Your company is not registered yet</Title>
                <Button type="primary" icon={<PlusOutlined />}>
                  Add New Company
                </Button>
              </div>
            )}
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default Profile;
