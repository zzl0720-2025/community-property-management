import React from 'react';
import { Card, Typography } from 'antd';

function Discussion() {
  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        <Typography.Title level={2}>Discussion</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Community discussion board coming soon.
        </Typography.Paragraph>
      </Card>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  card: {
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  },
};

export default Discussion;
