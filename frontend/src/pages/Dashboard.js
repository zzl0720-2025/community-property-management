import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Card,
  Col,
  Empty,
  List,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  MessageOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getAnnouncements } from "../services/api";

const { Title, Text, Paragraph } = Typography;

const SAMPLE_ANNOUNCEMENT = {
  id: 0,
  title: "Welcome to the Community Service Platform",
  content:
    "This is a sample announcement. Community events and management notices will be posted here. The platform is still under development, and more features are on the way.",
  postedBy: { fullName: "System Administrator" },
  postedAt: new Date().toISOString(),
};

function Dashboard() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnnouncements()
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAnnouncements(data);
        } else {
          setAnnouncements([SAMPLE_ANNOUNCEMENT]);
        }
      })
      .catch(() => {
        setAnnouncements([SAMPLE_ANNOUNCEMENT]);
        console.warn("Failed to load announcements; showing sample data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Alert message={error} type="error" showIcon />
        <Card bordered={false} style={styles.card}>
          <Title level={4}>Sample announcement (network error)</Title>
          <Paragraph>{SAMPLE_ANNOUNCEMENT.content}</Paragraph>
        </Card>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Discussion",
      icon: <MessageOutlined />,
      path: "/discussion",
      color: "#1890ff",
    },
    {
      title: "Pay Bills",
      icon: <DollarOutlined />,
      path: "/payment",
      color: "#52c41a",
    },
    {
      title: "Reserve Facility",
      icon: <CalendarOutlined />,
      path: "/rooms",
      color: "#722ed1",
    },
    {
      title: "Maintenance",
      icon: <ToolOutlined />,
      path: "/maintenance",
      color: "#fa8c16",
    },
    {
      title: "Profile",
      icon: <UserOutlined />,
      path: "/profile",
      color: "#13c2c2",
    },
  ];

  return (
    <div style={styles.container}>
      <Space direction="vertical" size={24} style={{ display: "flex" }}>
        <Card bordered={false} style={styles.card}>
          <Space align="center">
            <Avatar
              size={48}
              icon={<HomeOutlined />}
              style={styles.avatar}
            />
            <div>
              <Title level={3} style={styles.greetingTitle}>
                Welcome home
              </Title>
              <Text type="secondary">
                Stay connected with your community and take care of the small
                things here.
              </Text>
            </div>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          {quickActions.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.title}>
              <Card
                hoverable
                style={styles.actionCard}
                onClick={() => navigate(item.path)}
              >
                <div style={{ fontSize: 32, color: item.color }}>
                  {item.icon}
                </div>
                <Text strong>{item.title}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        <div>
          <Title level={4} style={styles.sectionTitle}>
            Latest Announcements
          </Title>
          {announcements.length === 0 ? (
            <Card bordered={false}>
              <Empty description="No announcements yet" />
            </Card>
          ) : (
            <List
              dataSource={announcements}
              split={false}
              renderItem={(announcement) => (
                <List.Item style={styles.announcementItem}>
                  <Card
                    title={announcement.title}
                    bordered={false}
                    style={styles.card}
                  >
                    <Paragraph>{announcement.content}</Paragraph>
                    <Text type="secondary">
                      Posted by:{" "}
                      {announcement.postedBy?.fullName ||
                        "Community Management"}{" "}
                      - {formatDate(announcement.postedAt)}
                    </Text>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      </Space>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Date unknown";
  return new Date(value).toLocaleDateString();
}

const styles = {
  container: { maxWidth: "960px", margin: "0 auto" },
  card: { boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)" },
  center: {
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { backgroundColor: "#1890ff" },
  greetingTitle: { marginBottom: 4 },
  actionCard: { textAlign: "center", cursor: "pointer" },
  sectionTitle: { marginBottom: 16 },
  announcementItem: { padding: 0, marginBottom: 16 },
};

export default Dashboard;
