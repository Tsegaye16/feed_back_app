import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Alert, Typography } from "antd";

import { emailConfirmation } from "../../redux/action/auth";

const { Title } = Typography;

const EmailConfirm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token") as string;

  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(
    null
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const confirm = async () => {
      try {
        setStatus("loading");
        const response = await dispatch(emailConfirmation(token) as any);

        if (response?.payload?.message) {
          setStatus("success");
          setMessage("Thank you! Your email has been successfully confirmed.");
          setTimeout(() => {
            navigate("/login");
          }, 3000); // Redirect to login page after 3 seconds
        } else if (response?.error) {
          setStatus("error");
          setMessage(response?.error || "Email confirmation failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    confirm();
  }, [dispatch, token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Title>Email Confirmation</Title>
      {status === "loading" && (
        <Spin tip="Confirming your email..." size="large" />
      )}
      {status === "error" && (
        <Alert
          message="Error"
          description={message}
          type="error"
          showIcon
          style={{ maxWidth: "400px", margin: "0 auto" }}
        />
      )}
      {status === "success" && (
        <>
          <Alert
            message="Success"
            description={message}
            type="success"
            showIcon
            style={{ maxWidth: "400px", margin: "0 auto" }}
          />
          <Title level={5}>Redirecting to login...</Title>
          <Spin tip="Redirecting to login..." size="large" />
        </>
      )}
    </div>
  );
};

export default EmailConfirm;
