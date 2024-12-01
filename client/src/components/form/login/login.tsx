import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Avatar, Spin } from "antd";
import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signin } from "../../../redux/action/auth";
import { jwtDecode } from "jwt-decode";
import { AppDispatch, RootState } from "../../..";
import { LoginData } from "../../../constants/types/dataType";
const { Title } = Typography;

const initialState: LoginData = {
  email: "",
  password: "",
};

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>(initialState);

  // Select loading and error state from Redux store
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const token = localStorage.getItem("user");

  useEffect(() => {
    if (token) {
      const decodedToken: { exp: number } = jwtDecode(token);
      if (decodedToken.exp * 1000 > new Date().getTime()) {
        navigate("/manager");
      }
    }
  }, [dispatch, navigate, token]);

  useEffect(() => {
    if (error) {
      message.error(error); // Display error message from Redux state
    }
  }, [error]);

  const handleSubmit = async (values: LoginData) => {
    const response = await dispatch(signin(values) as any);
    if ("payload" in response && response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      navigate("/manager");
    } else if ("error" in response) {
      if (response.payload.includes(":")) {
        message.error(`${response.payload.split(":")[1]?.trim()}`);
      } else {
        message.error(response.payload); // or handle it another way if `:` is not present
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #e2e2e2, #c9d6ff)",
      }}
    >
      {loading ? (
        <Spin tip="Loading....." size="large">
          <div
            style={{
              width: "400px",
              padding: "40px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff", marginBottom: "10px" }}
                icon={<LockOutlined />}
              />
              <Title level={3}>Sign In</Title>
            </div>

            <Form
              name="login"
              onFinish={handleSubmit}
              initialValues={formData}
              layout="vertical"
            >
              {/* Email Field */}
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not a valid email address!",
                  },
                  {
                    required: true,
                    message: "Please enter your email!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <Link to="/forgot-password" style={{ color: "#1890ff" }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading} // Ant Design's built-in loading style
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Typography.Text>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </Typography.Text>
            </div>
          </div>
        </Spin>
      ) : (
        <div
          style={{
            width: "400px",
            padding: "40px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Avatar
              style={{ backgroundColor: "#1890ff", marginBottom: "10px" }}
              icon={<LockOutlined />}
            />
            <Title level={3}>Sign In</Title>
          </div>

          <Form
            name="login"
            onFinish={handleSubmit}
            initialValues={formData}
            layout="vertical"
          >
            {/* Email Field */}
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not a valid email address!",
                },
                {
                  required: true,
                  message: "Please enter your email!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Link to="/forgot-password" style={{ color: "#1890ff" }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading} // Ant Design's built-in loading style
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Typography.Text>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </Typography.Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
