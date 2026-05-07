import React, { useEffect, useState } from 'react';
import { Alert, Card, Empty, List, Space, Spin, Typography, Row, Col, Avatar } from 'antd';
import { getAnnouncements } from '../services/api';
import { HomeOutlined, MessageOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 示例公告
const SAMPLE_ANNOUNCEMENT = {
  id: 0,
  title: '🏡 欢迎使用社区物业管理系统',
  content: '这是第一条示例公告。您可以在这里发布社区活动、物业通知等。目前系统正在建设中，更多功能即将上线。',
  postedBy: { fullName: '系统管理员' },
  postedAt: new Date().toISOString(),
};

function Dashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnnouncements()
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAnnouncements(data);
        } else {
          // 后端返回空数组时，显示示例公告
          setAnnouncements([SAMPLE_ANNOUNCEMENT]);
        }
      })
      .catch(() => {
        // 请求失败时，同样显示示例公告，并记录警告（不阻断页面）
        setAnnouncements([SAMPLE_ANNOUNCEMENT]);
        console.warn('公告接口请求失败，显示示例公告');
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
    // 错误时也回退到示例公告，但保留错误提示
    return (
      <div style={styles.container}>
        <Alert message={error} type="error" showIcon />
        <Card bordered={false} style={styles.card}>
          <Title level={4}>📢 示例公告（网络错误）</Title>
          <Paragraph>{SAMPLE_ANNOUNCEMENT.content}</Paragraph>
        </Card>
      </div>
    );
  }

  const quickActions = [
    { title: '邻里讨论', icon: <MessageOutlined />, path: '/discussion', color: '#1890ff' },
    { title: '在线缴费', icon: <DollarOutlined />, path: '/payment', color: '#52c41a' },
    { title: '设施预约', icon: <CalendarOutlined />, path: '/room-reserving', color: '#722ed1' },
  ];

  return (
    <div style={styles.container}>
      <Space direction="vertical" size={24} style={{ display: 'flex' }}>
        <Card bordered={false} style={styles.card}>
          <Space align="center">
            <Avatar size={48} icon={<HomeOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div>
              <Title level={3} style={{ marginBottom: 4 }}>欢迎回到社区服务平台</Title>
              <Text type="secondary">今日天气晴，空气优良，祝您生活愉快！</Text>
            </div>
          </Space>
        </Card>

        <Row gutter={16}>
          {quickActions.map((item) => (
            <Col span={8} key={item.title}>
              <Card
                hoverable
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => window.location.hash = item.path}
              >
                <div style={{ fontSize: 32, color: item.color }}>{item.icon}</div>
                <Text strong>{item.title}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        <div>
          <Title level={4} style={{ marginBottom: 16 }}>📢 最新公告</Title>
          {announcements.length === 0 ? (
            <Card bordered={false}>
              <Empty description="暂无公告" />
            </Card>
          ) : (
            <List
              dataSource={announcements}
              split={false}
              renderItem={(announcement) => (
                <List.Item style={{ padding: 0, marginBottom: 16 }}>
                  <Card title={announcement.title} bordered={false} style={styles.card}>
                    <Typography.Paragraph>{announcement.content}</Typography.Paragraph>
                    <Typography.Text type="secondary">
                      发布者：{announcement.postedBy?.fullName || '社区管理团队'} · {formatDate(announcement.postedAt)}
                    </Typography.Text>
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
  if (!value) return '日期未知';
  return new Date(value).toLocaleDateString();
}

const styles = {
  container: { maxWidth: '960px', margin: '0 auto' },
  card: { boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)' },
  center: { minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default Dashboard;