import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Typography,
  // notification,
  Button,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  NotificationOutlined,
  //  SettingOutlined,
  LogoutOutlined,
  FileDoneOutlined,
  InboxOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../../../redux/action/user";
import Draft from "../serveys/draft";
import Published from "../serveys/published";
import Detail from "../serveys/detail";

import EditQuestion from "../serveys/editQuestion";
import AddQuestion from "../serveys/addQuestion";
import AddCompany from "../serveys/addCompany";
import Profile from "../serveys/profile";
import DetailDashboard from "./detailDashboard";
import { getCompanyById } from "../../../redux/action/company";
import AddSurvey from "../serveys/addSurvey";
import FeedBack from "../feebBack/feedBack";
import FeedbackDetail from "../feebBack/feedbackDetail";
import { LOGOUT } from "../../../constants/types/actionType";
import { toggleTheme } from "../../../redux/reducer/theme";
//import { toggleTheme } from "../../../redux/action/theme";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [isServeysOpen, setIsServeysOpen] = useState(false);
  const [selectedAddSurvey, setSelectedAddSurvey] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedAddCompany, setSelectedAddCompany] = useState(null);
  const [selectedAddQuestion, setSelectedAddQuestion] = useState(null);
  const [selectedEditQuestion, setSelectedEditQuestion] = useState(null);
  const [feedbackDetail, setFeedbackDetail] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("user");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    await dispatch({ type: LOGOUT });
    localStorage.removeItem("user");
    //notification.warning({ message: "You are logged out" });
    navigate("/");
  };

  const user = useSelector((state: any) => state.user?.user);
  const company = useSelector((state: any) => state.company?.company);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    if (token) {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
      dispatch(getUserById(decodedToken.id) as any);
    }
  }, [dispatch, navigate, token]);

  useEffect(() => {
    if (user) {
      dispatch(getCompanyById(user?.id) as any);
    }
  }, [dispatch, user]);

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    setSelectedDetail(null);
    setSelectedAddCompany(null);
    setSelectedAddQuestion(null);
    setSelectedEditQuestion(null);
    setSelectedAddSurvey(null);
    setFeedbackDetail(null);
  };

  const handleServeysClick = () => {
    setIsServeysOpen(!isServeysOpen);
  };

  const handleAddSurvey = (id: any) => {
    setSelectedAddSurvey(id);
  };
  const handleDetailClick = (id: any) => {
    setSelectedDetail(id);
  };

  const handleEditClick = (record: any) => {
    setSelectedEditQuestion(record);
  };

  const handleAddQuestionSelection = (id: any) => {
    setSelectedAddQuestion(id);
  };

  const handleAddCompany = (id: any) => {
    setSelectedAddCompany(id);
  };

  const handleFeedbackDetailClick = (id: any) => {
    setFeedbackDetail(id);
  };

  const handleSaveQuestion = () => {
    setSelectedAddQuestion(null);
    setSelectedEditQuestion(null);
    setSelectedAddSurvey(null);
    setSelectedAddCompany(null);
  };

  const handleBack = () => {
    setSelectedDetail(null);
    setFeedbackDetail(null);
  };

  // Theming functionality

  const theme = useSelector((state: any) => state.theme); // Adjust state typing if needed
  // console.log("theme: ", theme);
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuItemClick(key)}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      {/* <Menu.Item key="setting" icon={<SettingOutlined />}>
        Settings
      </Menu.Item> */}
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme={theme}
        style={{ position: "fixed", height: "100vh", left: 0, top: 0 }}
      >
        {company === null ? (
          ""
        ) : (
          <div
            className="logo"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <Avatar
              style={{
                backgroundColor: `${theme === "light" ? "black" : "white"}`,
              }}
              src={`https://feed-back-app.onrender.com/${company?.logo}`}
            />
            <Title
              level={5}
              style={{ color: `${theme === "dark" ? "white" : "black"}` }}
            >
              {company?.name}
            </Title>
          </div>
        )}

        <Menu
          theme={theme}
          defaultSelectedKeys={["Dashboard"]}
          mode="inline"
          onClick={({ key }) => handleMenuItemClick(key)}
        >
          <Menu.Item key="Dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>

          <Menu.SubMenu
            key="Serveys"
            title="Serveys"
            icon={<UnorderedListOutlined />}
            onTitleClick={handleServeysClick}
          >
            <Menu.Item
              key="Published"
              icon={<FileDoneOutlined />}
              style={{ userSelect: "none" }}
            >
              Published
            </Menu.Item>
            <Menu.Item key="Draft" icon={<InboxOutlined />}>
              Draft
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item key="FeedBacks" icon={<NotificationOutlined />}>
            Feedbacks
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
          color: `${theme === "light" ? "black" : "white"}`,
          backgroundColor: `${theme === "light" ? "#FAF9F6" : "black"}`,
        }}
      >
        <Header
          style={{
            backgroundColor: `${theme === "light" ? "white" : "#001529"}`,
            padding: 0,
            top: 0,
            position: "sticky",
            zIndex: 999,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: `${theme === "light" ? "black" : "white"}`,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingRight: "20px",
              }}
            >
              <Button
                type="text"
                icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                onClick={handleToggleTheme}
                style={{
                  fontSize: "16px",
                  color: `${theme === "light" ? "black" : "white"}`,
                }}
              />
              {/* <Badge count={4}>
                <NotificationOutlined style={{ fontSize: "24px" }} />
              </Badge> */}

              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar
                  src={`https://feed-back-app.onrender.com//${user?.image}`}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
              <Title
                level={5}
                style={{
                  color: `${theme === "light" ? "black" : "white"}`,
                }}
              >
                {user?.name}
              </Title>
            </div>
          </div>
        </Header>

        <Content style={{ margin: "16px" }}>
          {selectedEditQuestion ? (
            <EditQuestion
              record={selectedEditQuestion}
              onSave={handleSaveQuestion}
            />
          ) : selectedAddQuestion ? (
            <AddQuestion id={selectedDetail} onSave={handleSaveQuestion} />
          ) : feedbackDetail ? (
            <FeedbackDetail
              feedbackDetail={feedbackDetail}
              onSave={handleBack}
            />
          ) : selectedDetail ? (
            <Detail
              id={selectedDetail}
              onClickAddQuestion={handleAddQuestionSelection}
              onClickEditQuestion={handleEditClick}
              onSave={handleBack}
            />
          ) : selectedAddSurvey ? (
            <AddSurvey
              info={selectedAddSurvey}
              onSave={handleSaveQuestion}
              companyName={company?.name}
            />
          ) : selectedAddCompany ? (
            <AddCompany
              onSave={handleSaveQuestion}
              managerId={selectedAddCompany}
            />
          ) : (
            <>
              {selectedItem === "Dashboard" && (
                <DetailDashboard companyId={company?.id} />
              )}
              {selectedItem === "Published" && (
                <Published
                  onDetailClick={handleDetailClick}
                  onAddCompany={handleAddCompany}
                  onAddSurvey={handleAddSurvey}
                  onSave={handleSaveQuestion}
                />
              )}
              {selectedItem === "Draft" && (
                <Draft
                  onDetailClick={handleDetailClick}
                  onAddCompany={handleAddCompany}
                  onAddSurvey={handleAddSurvey}
                />
              )}
              {selectedItem === "FeedBacks" && (
                <FeedBack
                  companyId={company?.id}
                  handleFeedbackDetailClick={handleFeedbackDetailClick}
                />
              )}
              {selectedItem === "setting" && (
                <AddCompany
                  onSave={handleSaveQuestion}
                  managerId={selectedAddCompany}
                />
              )}
              {selectedItem === "profile" && (
                <Profile user={user} company={company} />
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
