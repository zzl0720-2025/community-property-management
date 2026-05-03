import React from 'react';
import { Card, Typography } from 'antd';

function Payment() {
  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        <Typography.Title level={2}>Payment</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Payment management coming soon.
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

export default Payment;
