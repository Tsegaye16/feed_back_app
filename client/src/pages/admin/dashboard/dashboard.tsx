import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Typography,
  notification,
  Button,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  NotificationOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileDoneOutlined,
  InboxOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("user");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    notification.warning({ message: "You are logged out" });
    navigate("/");
  };

  const user = useSelector((state: any) => state.user?.user?.newUser);
  const company = useSelector(
    (state: any) => state.company?.companyData?.result
  );

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
  const onUpdate = async () => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const data = await dispatch(getUserById(decodedToken.id) as any);
      return data;
    }
    return;
  };
  // console.log("user111: ", user);
  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    setSelectedDetail(null);
    setSelectedAddCompany(null);
    setSelectedAddQuestion(null);
    setSelectedEditQuestion(null);
    setSelectedAddSurvey(null);
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

  const handleSaveQuestion = () => {
    setSelectedAddQuestion(null);
    setSelectedEditQuestion(null);
    setSelectedAddSurvey(null);
    setSelectedAddCompany(null);
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme="light"
        style={{ position: "fixed", height: "100vh", left: 0, top: 0 }}
      >
        {company === null ? (
          ""
        ) : (
          <div
            className="logo"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <Avatar src={`http://localhost:4000/${company?.logo}`} />
            <Title level={5}>{company?.name}</Title>
          </div>
        )}

        <Menu
          //theme="light"
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
            <Menu.Item key="Published" icon={<FileDoneOutlined />}>
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
          backgroundColor: "#FAF9F6",
        }}
      >
        <Header
          style={{
            backgroundColor: "white",
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
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingRight: "20px",
              }}
            >
              <Badge count={4}>
                <NotificationOutlined style={{ fontSize: "24px" }} />
              </Badge>

              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar
                  src={`http://localhost:4000/${user?.image}`}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
              <Title level={5}>{user?.name}</Title>
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
          ) : selectedDetail ? (
            <Detail
              id={selectedDetail}
              onClickAddQuestion={handleAddQuestionSelection}
              onClickEditQuestion={handleEditClick}
            />
          ) : selectedAddSurvey ? (
            <AddSurvey info={selectedAddSurvey} onSave={handleSaveQuestion} />
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
                <FeedBack compmanyId={company?.id} />
              )}
              {selectedItem === "setting" && (
                <AddCompany
                  onSave={handleSaveQuestion}
                  managerId={selectedAddCompany}
                />
              )}
              {selectedItem === "profile" && (
                <Profile user={user} onUpdate={onUpdate} company={company} />
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
