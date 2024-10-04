import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Avatar } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import "./../form.css";
import { signup } from "../../../redux/action/auth";

const { Title, Link } = Typography;

const initialState = {
  name: "",
  email: "",
  password: "",
};

const Registration = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    const response = await dispatch(signup(values, navigate) as any);

    if (response?.error) {
      message.error(`${response.error}`);
    } else if (response?.payload?.message) {
      message.success(`${response?.payload?.message}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
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
            rules={[{ required: true, message: "Please enter your full name" }]}
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
    </div>
  );
};

export default Registration;

//////////////////////////////////////////////////////
