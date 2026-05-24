import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { EditOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const INITIAL_PROFILE = {
  fullName: "Resident User",
  email: "resident@test.com",
  phone: "555-0188",
  unit: "Building A, Unit 1203",
  emergencyContact: "555-0112",
  role: "Resident",
};

function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const startEditing = () => {
    form.setFieldsValue(profile);
    setEditing(true);
  };

  const cancelEditing = () => {
    form.resetFields();
    setEditing(false);
  };

  const saveProfile = (values) => {
    setProfile({ ...profile, ...values, role: profile.role });
    setEditing(false);
    message.success("Profile updated locally");
  };

  return (
    <div style={styles.page}>
      <Space direction="vertical" size={24} style={{ display: "flex" }}>
        <Card bordered={false} style={styles.card}>
          <Row gutter={[24, 24]} align="middle">
            <Col>
              <Avatar size={72} icon={<UserOutlined />} style={styles.avatar} />
            </Col>
            <Col flex="auto">
              <Title level={2} style={styles.title}>
                My Profile
              </Title>
              <Text type="secondary">
                Keep your resident contact details up to date.
              </Text>
            </Col>
            <Col>
              {editing ? (
                <Space>
                  <Button onClick={cancelEditing}>Cancel</Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                  >
                    Save
                  </Button>
                </Space>
              ) : (
                <Button icon={<EditOutlined />} onClick={startEditing}>
                  Edit
                </Button>
              )}
            </Col>
          </Row>
        </Card>

        <Card bordered={false} style={styles.card}>
          {editing ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={profile}
              onFinish={saveProfile}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full name"
                    name="fullName"
                    rules={[{ required: true, message: "Please enter your name." }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email." },
                      { type: "email", message: "Please enter a valid email." },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Phone" name="phone">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Unit" name="unit">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Emergency contact" name="emergencyContact">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Role" name="role">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            <Descriptions column={{ xs: 1, md: 2 }} bordered>
              <Descriptions.Item label="Full name">
                {profile.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color="blue">{profile.role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{profile.phone}</Descriptions.Item>
              <Descriptions.Item label="Unit">{profile.unit}</Descriptions.Item>
              <Descriptions.Item label="Emergency contact">
                {profile.emergencyContact}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      </Space>
    </div>
  );
}

const styles = {
  page: { maxWidth: "960px", margin: "0 auto" },
  card: { boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)" },
  avatar: { backgroundColor: "#1890ff" },
  title: { marginBottom: 4 },
};

export default Profile;
