import React, { useState } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  message,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function Payment() {
  // Bill list (mock data — replace with API calls for real integration)
  const [bills, setBills] = useState([
    {
      id: 1,
      type: "Property Management Fee",
      amount: 320.0,
      dueDate: "2025-04-30",
      status: "unpaid",
    },
    {
      id: 2,
      type: "Water Bill",
      amount: 45.5,
      dueDate: "2025-05-05",
      status: "paid",
    },
    {
      id: 3,
      type: "Electricity Bill",
      amount: 128.3,
      dueDate: "2025-05-10",
      status: "unpaid",
    },
    {
      id: 4,
      type: "Parking Fee",
      amount: 200.0,
      dueDate: "2025-05-15",
      status: "unpaid",
    },
  ]);

  // Simulated single-bill payment
  const handlePay = (id) => {
    setBills(
      bills.map((bill) =>
        bill.id === id ? { ...bill, status: "paid" } : bill,
      ),
    );
    message.success("Payment successful (simulated)");
  };

  const handlePayAll = () => {
    setBills(
      bills.map((bill) =>
        bill.status === "unpaid" ? { ...bill, status: "paid" } : bill,
      ),
    );
    message.success("All outstanding bills marked as paid (simulated)");
  };

  // Table columns
  const columns = [
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          icon={
            status === "paid" ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          color={status === "paid" ? "green" : "red"}
        >
          {status === "paid" ? "Paid" : "Unpaid"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          disabled={record.status === "paid"}
          onClick={() => handlePay(record.id)}
        >
          {record.status === "paid" ? "Paid" : "Pay Now"}
        </Button>
      ),
    },
  ];

  // Total amount of unpaid bills
  const totalUnpaid = bills
    .filter((b) => b.status === "unpaid")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        <div style={styles.header}>
          <div>
            <Title level={2} style={styles.title}>
              My Bills
            </Title>
            <Paragraph type="secondary" style={styles.subtitle}>
              Review payment status
            </Paragraph>
          </div>
          <Button
            type="primary"
            icon={<DollarOutlined />}
            disabled={totalUnpaid === 0}
            onClick={handlePayAll}
          >
            Pay all outstanding bills
          </Button>
        </div>

        {totalUnpaid > 0 && (
          <Alert
            message={`You have $${totalUnpaid.toFixed(2)} in outstanding bills`}
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Table
          columns={columns}
          dataSource={bills}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

const styles = {
  page: { maxWidth: "960px", margin: "0 auto" },
  card: { boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 0,
  },
};

export default Payment;
