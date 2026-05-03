import React, { useEffect, useState } from 'react';
import { Alert, Card, Empty, List, Space, Spin, Typography } from 'antd';
import { getAnnouncements } from '../services/api';

/**
 * Dashboard page — shows the latest community announcements.
 * Fetches from GET /api/announcements on mount.
 */
function Dashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnnouncements()
      .then(({ data }) => setAnnouncements(data))
      .catch(() => setError('Failed to load announcements'))
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
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Space direction="vertical" size={24} style={{ display: 'flex' }}>
        <div>
          <Typography.Title level={2} style={{ marginBottom: 8 }}>
            Community Dashboard
          </Typography.Title>
          <Typography.Text type="secondary">
            Latest announcements
          </Typography.Text>
        </div>

        {announcements.length === 0 ? (
          <Card bordered={false}>
            <Empty description="No announcements yet." />
          </Card>
        ) : (
          <List
            dataSource={announcements}
            split={false}
            renderItem={(announcement) => (
              <List.Item style={{ padding: 0, marginBottom: 16 }}>
                <Card title={announcement.title} bordered={false} style={styles.card}>
                  <Typography.Paragraph style={styles.cardBody}>
                    {announcement.content}
                  </Typography.Paragraph>
                  <Typography.Text type="secondary">
                    Posted by {announcement.postedBy?.fullName || 'Community Team'} {'\u2022'} {formatDate(announcement.postedAt)}
                  </Typography.Text>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Space>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return 'Date unavailable';
  }

  return new Date(value).toLocaleDateString();
}

const styles = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  card: {
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  },
  cardBody: {
    marginBottom: 16,
  },
  center: {
    minHeight: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Dashboard;
