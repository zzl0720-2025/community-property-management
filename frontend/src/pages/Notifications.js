import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Empty,
  List,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "payment",
    title: "Payment reminder",
    message: "You have outstanding bills ready for review.",
    time: "Today",
    read: false,
    path: "/payment",
  },
  {
    id: 2,
    type: "booking",
    title: "Reservation update",
    message: "Your gym reservation is waiting for approval.",
    time: "Yesterday",
    read: false,
    path: "/rooms",
  },
  {
    id: 3,
    type: "maintenance",
    title: "Maintenance request received",
    message: "The hallway light request has been added to the repair queue.",
    time: "May 7",
    read: true,
    path: "/maintenance",
  },
];

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    message.success("All notifications marked as read");
  };

  const openNotification = (item) => {
    markAsRead(item.id);
    navigate(item.path);
  };

  return (
    <div style={styles.page}>
      <Space direction="vertical" size={24} style={{ display: "flex" }}>
        <Card bordered={false} style={styles.card}>
          <div style={styles.header}>
            <div>
              <Space align="center">
                <Badge count={unreadCount} size="small">
                  <BellOutlined style={styles.headerIcon} />
                </Badge>
                <Title level={2} style={styles.title}>
                  Notifications
                </Title>
              </Space>
              <Paragraph type="secondary" style={styles.subtitle}>
                Keep track of updates that need your attention.
              </Paragraph>
            </div>
            <Button
              icon={<CheckOutlined />}
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          </div>
        </Card>

        <Card bordered={false} style={styles.card}>
          {notifications.length === 0 ? (
            <Empty description="No notifications" />
          ) : (
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => openNotification(item)}>
                      View
                    </Button>,
                    <Button
                      type="link"
                      disabled={item.read}
                      onClick={() => markAsRead(item.id)}
                    >
                      Mark read
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong={!item.read}>{item.title}</Text>
                        <Tag color={getTypeColor(item.type)}>{formatLabel(item.type)}</Tag>
                        {!item.read ? <Badge status="processing" /> : null}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text>{item.message}</Text>
                        <Text type="secondary">{item.time}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </Space>
    </div>
  );
}

function formatLabel(value) {
  return String(value || "").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getTypeColor(type) {
  if (type === "payment") return "green";
  if (type === "booking") return "blue";
  if (type === "maintenance") return "orange";
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
  title: { marginBottom: 0 },
  subtitle: { marginTop: 8, marginBottom: 0 },
  headerIcon: { fontSize: 26, color: "#1890ff" },
};

export default Notifications;
