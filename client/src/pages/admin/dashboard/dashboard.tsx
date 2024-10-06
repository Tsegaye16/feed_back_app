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
  Watermark,
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
import Sample from "../serveys/addQuestion";
import EditQuestion from "../serveys/editQuestion";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [isServeysOpen, setIsServeysOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [selectedAddQuestion, setSelectedAddQuestion] = useState<any>(null);
  const [selectedEditQuestion, setSelectedEditQuestion] = useState<any>(null);

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

  const user = useSelector((state: any) => state.user?.user?.newUser);

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    setSelectedDetail(null);
  };

  const handleServeysClick = () => {
    setIsServeysOpen(!isServeysOpen);
  };

  const handleDetailClick = (id: number) => {
    setSelectedDetail(id);
  };

  const handleEditClick = (record: any) => {
    setSelectedEditQuestion(record);
  };

  const handleAddQuestionSelection = (id: any) => {
    setSelectedAddQuestion(id);
  };

  const handleSaveQuestion = () => {
    setSelectedAddQuestion(null);
    setSelectedEditQuestion(null);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Watermark content="sample">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapsed}
          theme="light"
        >
          <div
            className="logo"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <Avatar src="/avatar.png" />
            <Title level={5}>{user?.name}</Title>
          </div>

          <Menu
            theme="light"
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

        <Layout className="site-layout">
          <Header style={{ backgroundColor: "#fff", padding: 0 }}>
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
                  <Avatar src="/avatar.png" style={{ cursor: "pointer" }} />
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
              <Sample id={selectedDetail} onSave={handleSaveQuestion} />
            ) : selectedDetail ? (
              <Detail
                id={selectedDetail}
                onClickAddQuestion={handleAddQuestionSelection}
                onClickEditQuestion={handleEditClick}
              />
            ) : (
              <>
                {selectedItem === "Dashboard" && <div>Dashboard Content</div>}
                {selectedItem === "Published" && (
                  <Published onDetailClick={handleDetailClick} />
                )}
                {selectedItem === "Draft" && (
                  <Draft onDetailClick={handleDetailClick} />
                )}
                {selectedItem === "FeedBacks" && <div>Feedbacks Content</div>}
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Watermark>
  );
};

export default Dashboard;
