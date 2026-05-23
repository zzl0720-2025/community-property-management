import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Space, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { login } from "../services/api";

function LoginPage({ onLoginSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        accountType: inferAccountType(data),
      });
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        <Space direction="vertical" size={24} style={{ display: "flex" }}>
          <div>
            <Typography.Title level={2} style={{ marginBottom: 8 }}>
              Sign In
            </Typography.Title>
            <Typography.Text type="secondary">
              Residents and admins sign in here. Admin access is determined by
              your account role after login.
            </Typography.Text>
          </div>

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
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Typography.Text type="secondary">
            No account? <Link to="/register">Create a resident account</Link>
          </Typography.Text>
        </Space>
      </Card>
    </div>
  );
}

function inferAccountType(loginData) {
  return (
    normalizeAccountType(loginData?.role) ||
    normalizeAccountType(loginData?.roles) ||
    normalizeAccountType(loginData?.authorities) ||
    normalizeAccountType(decodeJwtPayload(loginData?.token)?.role) ||
    normalizeAccountType(decodeJwtPayload(loginData?.token)?.roles) ||
    "user"
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
