import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import { PlusOutlined, ToolOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const INITIAL_REQUESTS = [
  {
    id: 1,
    title: "Hallway light is out",
    location: "Building A, Floor 5",
    priority: "normal",
    description: "The light near the elevator has been out since yesterday.",
    status: "pending",
    submittedAt: "2026-05-07",
  },
  {
    id: 2,
    title: "Laundry room washer leak",
    location: "Laundry room",
    priority: "urgent",
    description: "One washer is leaking water onto the floor.",
    status: "in_progress",
    submittedAt: "2026-05-06",
  },
];

function Maintenance() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const stats = useMemo(
    () => ({
      open: requests.filter((item) => item.status !== "resolved").length,
      urgent: requests.filter((item) => item.priority === "urgent").length,
      resolved: requests.filter((item) => item.status === "resolved").length,
    }),
    [requests],
  );

  const closeModal = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const submitRequest = (values) => {
    const newRequest = {
      id: Date.now(),
      ...values,
      status: "pending",
      submittedAt: new Date().toLocaleDateString(),
    };

    setRequests((current) => [newRequest, ...current]);
    message.success("Maintenance request submitted locally");
    closeModal();
  };

  return (
    <div style={styles.page}>
      <Space direction="vertical" size={24} style={{ display: "flex" }}>
        <Card bordered={false} style={styles.card}>
          <div style={styles.header}>
            <div>
              <Title level={2} style={styles.title}>
                Maintenance Requests
              </Title>
              <Text type="secondary">
                Report issues and follow their repair status.
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              New Request
            </Button>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card bordered={false} style={styles.card}>
              <Statistic title="Open requests" value={stats.open} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} style={styles.card}>
              <Statistic title="Urgent" value={stats.urgent} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} style={styles.card}>
              <Statistic title="Resolved" value={stats.resolved} />
            </Card>
          </Col>
        </Row>

        <Card bordered={false} style={styles.card}>
          <List
            dataSource={requests}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Tag color={getPriorityColor(item.priority)}>
                    {formatLabel(item.priority)}
                  </Tag>,
                  <Tag color={getStatusColor(item.status)}>
                    {formatLabel(item.status)}
                  </Tag>,
                ]}
              >
                <List.Item.Meta
                  avatar={<ToolOutlined style={styles.requestIcon} />}
                  title={item.title}
                  description={
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">
                        {item.location} - submitted {item.submittedAt}
                      </Text>
                      <Paragraph style={styles.description}>
                        {item.description}
                      </Paragraph>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Space>

      <Modal
        title="New Maintenance Request"
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        width={620}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitRequest}
          initialValues={{ priority: "normal" }}
        >
          <Form.Item
            label="Issue title"
            name="title"
            rules={[{ required: true, message: "Please enter an issue title." }]}
          >
            <Input placeholder="Short issue summary" />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter a location." }]}
          >
            <Input placeholder="Building, floor, room, or common area" />
          </Form.Item>
          <Form.Item label="Priority" name="priority">
            <Select
              options={[
                { value: "normal", label: "Normal" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please describe the issue." }]}
          >
            <TextArea rows={4} placeholder="Describe what happened" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Request
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

function formatLabel(value) {
  return String(value || "").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPriorityColor(priority) {
  return priority === "urgent" ? "red" : "blue";
}

function getStatusColor(status) {
  if (status === "resolved") return "green";
  if (status === "in_progress") return "orange";
  return "default";
}

const styles = {
  page: { maxWidth: "960px", margin: "0 auto" },
  card: { boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  },
  title: { marginBottom: 4 },
  requestIcon: { fontSize: 22, color: "#1890ff" },
  description: { marginBottom: 0 },
};

export default Maintenance;
