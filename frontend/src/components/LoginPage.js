import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Space,
  Typography,
  message,
} from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { login, register } from "../services/api";

function LoginPage({ mode, onLoginSuccess }) {
  const [registerForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const isAdminMode = mode === "admin";

  const handleLogin = async (values) => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await login(values);
      const token = data?.token;

      if (!token) {
        throw new Error("Missing token in login response");
      }

      onLoginSuccess({
        token,
        accountType: inferAccountType(data, mode),
      });
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (values) => {
    setRegistering(true);
    setError("");

    try {
      await register(values);
      registerForm.resetFields();
      message.success("Registration successful. You can sign in now.");
    } catch (registerError) {
      setError(registerError.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        <Space direction="vertical" size={24} style={{ display: "flex" }}>
          <div>
            <Typography.Title level={2} style={{ marginBottom: 8 }}>
              {isAdminMode ? "Admin Sign In" : "Resident Sign In"}
            </Typography.Title>
            <Typography.Text type="secondary">
              {isAdminMode
                ? "Sign in to manage community operations."
                : "Sign in to access your community dashboard."}
            </Typography.Text>
          </div>

          <Space size={12} wrap>
            <Link to="/login/user">Resident Login</Link>
            <Link to="/login/admin">Admin Login</Link>
          </Space>

          {error ? <Alert message={error} type="error" showIcon /> : null}

          <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email." },
                { type: "email", message: "Please enter a valid email." },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="name@example.com" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password." }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                {isAdminMode ? "Sign In as Admin" : "Sign In"}
              </Button>
            </Form.Item>
          </Form>

          {!isAdminMode ? (
            <>
              <Divider style={{ margin: 0 }}>Create Resident Account</Divider>
              <Form
                form={registerForm}
                layout="vertical"
                onFinish={handleRegister}
                autoComplete="off"
              >
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true, message: "Please enter your full name." }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Full Name" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email." },
                    { type: "email", message: "Please enter a valid email." },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="name@example.com" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please enter your password." }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                  <Input prefix={<PhoneOutlined />} placeholder="Optional phone number" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button htmlType="submit" loading={registering} block>
                    Register Resident Account
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : null}
        </Space>
      </Card>
    </div>
  );
}

function inferAccountType(loginData, fallbackMode) {
  return (
    normalizeAccountType(loginData?.role) ||
    normalizeAccountType(loginData?.roles) ||
    normalizeAccountType(loginData?.authorities) ||
    normalizeAccountType(decodeJwtPayload(loginData?.token)?.role) ||
    normalizeAccountType(decodeJwtPayload(loginData?.token)?.roles) ||
    fallbackMode
  );
}

function normalizeAccountType(value) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => String(entry).toLowerCase().includes("admin"))
      ? "admin"
      : "user";
  }

  return String(value).toLowerCase().includes("admin") ? "admin" : "user";
}

function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    background: "#f5f7fb",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)",
  },
};

export default LoginPage;
