import React, { useState } from 'react';
import { Card, Typography, Table, Tag, Button, message, Space, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function Payment() {
    // 账单列表（模拟）
  const [bills, setBills] = useState([
    { id: 1, type: '物业管理费', amount: 320.00, dueDate: '2025-04-30', status: 'unpaid' },
    { id: 2, type: '水费', amount: 45.50, dueDate: '2025-05-05', status: 'paid' },
    { id: 3, type: '电费', amount: 128.30, dueDate: '2025-05-10', status: 'unpaid' },
    { id: 4, type: '停车费', amount: 200.00, dueDate: '2025-05-15', status: 'unpaid' },
  ]);
    // 模拟单笔缴费
  const handlePay = (id) => {
    setBills(bills.map(bill => bill.id === id ? { ...bill, status: 'paid' } : bill));
    message.success('缴费成功（模拟）');
  };
    // 表格列定义
  const columns = [
    { title: '费用类型', dataIndex: 'type', key: 'type' },
    { title: '金额(¥)', dataIndex: 'amount', key: 'amount', render: (amount) => amount.toFixed(2) },
    { title: '截止日期', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag icon={status === 'paid' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={status === 'paid' ? 'green' : 'red'}>
          {status === 'paid' ? '已缴费' : '未缴费'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" disabled={record.status === 'paid'} onClick={() => handlePay(record.id)}>
          {record.status === 'paid' ? '已缴费' : '立即支付'}
        </Button>
      ),
    },
  ];
    // 计算未缴纳总金额
  const totalUnpaid = bills.filter(b => b.status === 'unpaid').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        <Title level={2}>在线缴费</Title>
        <Paragraph type="secondary">物业费、水电费一键支付</Paragraph>

        {totalUnpaid > 0 && (
          <Alert
            message={`您有未缴账单共 ${totalUnpaid.toFixed(2)} 元`}
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Table columns={columns} dataSource={bills} rowKey="id" pagination={false} />
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button type="primary" icon={<DollarOutlined />} onClick={() => message.info('批量缴费功能开发中')}>
            一键缴纳所有未缴费账单
          </Button>
        </div>
      </Card>
    </div>
  );
}

const styles = {
  page: { maxWidth: '960px', margin: '0 auto' },
  card: { boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)' },
};

export default Payment;