import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Space, Typography, message } from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { register } from "../services/api";

function RegisterPage() {
  const [registerForm] = Form.useForm();
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setRegistering(true);
    setError("");

    try {
      await register(values);
      registerForm.resetFields();
      message.success("Registration successful. Please sign in.");
      navigate("/login", { replace: true });
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
              Create Resident Account
            </Typography.Title>
            <Typography.Text type="secondary">
              Register here, then return to the shared sign-in page.
            </Typography.Text>
          </div>

          {error ? <Alert message={error} type="error" showIcon /> : null}

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

          <Typography.Text type="secondary">
            Already have an account? <Link to="/login">Back to sign in</Link>
          </Typography.Text>
        </Space>
      </Card>
    </div>
  );
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

export default RegisterPage;
