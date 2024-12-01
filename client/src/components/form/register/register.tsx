import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Avatar, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RegisterData } from "../../../constants/types/dataType";
//import "./../form.css";
import { signup } from "../../../redux/action/auth";

const { Title, Link } = Typography;

const initialState: RegisterData = {
  name: "",
  email: "",
  password: "",
};

const Registration = () => {
  const [formData, setFormData] = useState<RegisterData>(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state: any) => state.auth);

  const onFinish = async (values: RegisterData) => {
    const response = await dispatch(signup(values) as any);

    if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
      navigate("/login");
    } else if (response?.error) {
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
        <Spin tip="Loading...." size="large">
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
              <Title level={3}> Sign Up</Title>
            </div>
            <Form
              name="registration"
              layout="vertical"
              initialValues={formData}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long",
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign Up
                </Button>
              </Form.Item>

              <Form.Item>
                <Typography.Text>
                  Already have an account? <Link href="/login">Sign in</Link>
                </Typography.Text>
              </Form.Item>
            </Form>
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
            <Title level={3}> Sign Up</Title>
          </div>
          <Form
            name="registration"
            layout="vertical"
            initialValues={formData}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>

            <Form.Item>
              <Typography.Text>
                Already have an account? <Link href="/login">Sign in</Link>
              </Typography.Text>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Registration;
