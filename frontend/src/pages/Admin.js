import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  createAnnouncement,
  createPayment,
  deleteAnnouncement,
  deleteUser,
  getAllBookings,
  getAllMaintenanceRequests,
  getAnnouncements,
  getUsers,
  updateBookingStatus,
  updateMaintenanceStatus,
} from "../services/api";

const { Title, Text } = Typography;
const PAYMENT_STATUS_OPTIONS = ["unpaid", "paid"];

function Admin() {
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [announcementForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  const loadAdminData = useCallback(async () => {
    setError("");
    setRefreshing(true);

    const requests = [
      ["users", getUsers],
      ["announcements", getAnnouncements],
      ["bookings", getAllBookings],
      ["maintenance requests", getAllMaintenanceRequests],
    ];

    const results = await Promise.allSettled(
      requests.map(([, request]) => request())
    );
    const failed = [];

    results.forEach((result, index) => {
      const key = requests[index][0];

      if (result.status === "rejected") {
        failed.push(key);
        return;
      }

      const list = toList(result.value);
      if (key === "users") setUsers(list);
      if (key === "announcements") setAnnouncements(list);
      if (key === "bookings") setBookings(list);
      if (key === "maintenance requests") setMaintenance(list);
    });

    if (failed.length > 0) {
      setError(`Could not load ${failed.join(", ")}. Check backend access and admin permissions.`);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const stats = useMemo(
    () => [
      { label: "Users", value: users.length },
      { label: "Announcements", value: announcements.length },
      { label: "Pending bookings", value: countStatus(bookings, "pending") },
      { label: "Open maintenance", value: countOpenMaintenance(maintenance) },
    ],
    [announcements.length, bookings, maintenance, users.length]
  );

  const handleCreateAnnouncement = async (values) => {
    try {
      const { data } = await createAnnouncement(values);
      setAnnouncements((current) => [data || values, ...current]);
      announcementForm.resetFields();
      message.success("Announcement created");
      loadAdminData();
    } catch (actionError) {
      message.error(getActionError(actionError, "Could not create announcement"));
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements((current) => current.filter((item) => getId(item) !== id));
      message.success("Announcement deleted");
    } catch (actionError) {
      message.error(getActionError(actionError, "Could not delete announcement"));
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers((current) => current.filter((item) => getId(item) !== id));
      message.success("User deleted");
    } catch (actionError) {
      message.error(getActionError(actionError, "Could not delete user"));
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings((current) => updateLocalStatus(current, id, status));
      message.success("Booking status updated");
    } catch (actionError) {
      message.error(getActionError(actionError, "Could not update booking status"));
    }
  };

  const handleMaintenanceStatus = async (id, status) => {
    try {
      await updateMaintenanceStatus(id, status);
      setMaintenance((current) => updateLocalStatus(current, id, status));
      message.success("Maintenance status updated");
    } catch (actionError) {
      message.error(getActionError(actionError, "Could not update maintenance status"));
    }
  };

  const handleCreatePayment = async (values) => {
    try {
      await createPayment({
        ...values,
        amount: Number(values.amount),
        dueDate: values.dueDate.format("YYYY-MM-DD"),
      });
      paymentForm.resetFields();
      message.success("Payment record created");
    } catch (actionError) {
      message.error(getActionError(actionError, "Could not create payment record"));
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Space direction="vertical" size={24} style={{ display: "flex" }}>
        <div style={styles.header}>
          <div>
            <Title level={2} style={styles.title}>
              Admin Panel
            </Title>
            <Text type="secondary">
              Manage residents, announcements, bookings, maintenance, and payments.
            </Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            loading={refreshing}
            onClick={loadAdminData}
          >
            Refresh
          </Button>
        </div>

        {error ? <Alert message={error} type="warning" showIcon /> : null}

        <Row gutter={[16, 16]}>
          {stats.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.label}>
              <Card bordered={false} style={styles.statCard}>
                <Statistic title={item.label} value={item.value} />
              </Card>
            </Col>
          ))}
        </Row>

        <Tabs
          items={[
            {
              key: "users",
              label: "Users",
              children: renderUsers(users, handleDeleteUser),
            },
            {
              key: "announcements",
              label: "Announcements",
              children: renderAnnouncements({
                announcements,
                form: announcementForm,
                onCreate: handleCreateAnnouncement,
                onDelete: handleDeleteAnnouncement,
              }),
            },
            {
              key: "bookings",
              label: "Bookings",
              children: renderBookings(bookings, handleBookingStatus),
            },
            {
              key: "maintenance",
              label: "Maintenance",
              children: renderMaintenance(maintenance, handleMaintenanceStatus),
            },
            {
              key: "payments",
              label: "Payments",
              children: renderPayments(paymentForm, handleCreatePayment),
            },
          ]}
        />
      </Space>
    </div>
  );
}

function renderUsers(users, onDelete) {
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => getUserName(record),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone", render: valueOrDash },
    {
      title: "Role",
      key: "role",
      render: (_, record) => renderRole(record),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const id = getId(record);
        return (
          <Popconfirm
            title="Delete this user?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(id)}
            disabled={!id}
          >
            <Button danger type="link" icon={<DeleteOutlined />} disabled={!id}>
              Delete
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return renderTable(users, columns, "No users found");
}

function renderAnnouncements({ announcements, form, onCreate, onDelete }) {
  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: valueOrDash,
    },
    {
      title: "Posted By",
      key: "postedBy",
      render: (_, record) => getUserName(record.postedBy) || "Community Management",
    },
    {
      title: "Posted At",
      dataIndex: "postedAt",
      key: "postedAt",
      render: formatDate,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const id = getId(record);
        return (
          <Popconfirm
            title="Delete this announcement?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(id)}
            disabled={!id}
          >
            <Button danger type="link" icon={<DeleteOutlined />} disabled={!id}>
              Delete
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ display: "flex" }}>
      <div style={styles.panel}>
        <Title level={4} style={styles.panelTitle}>
          Create Announcement
        </Title>
        <Form form={form} layout="vertical" onFinish={onCreate}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title." }]}
          >
            <Input placeholder="Community notice title" />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter announcement content." }]}
          >
            <Input.TextArea rows={4} placeholder="Announcement content" />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Publish
          </Button>
        </Form>
      </div>
      {renderTable(announcements, columns, "No announcements found")}
    </Space>
  );
}

function renderBookings(bookings, onStatusChange) {
  const columns = [
    {
      title: "Facility",
      dataIndex: "facility",
      key: "facility",
      render: valueOrDash,
    },
    {
      title: "Resident",
      key: "resident",
      render: (_, record) => getUserName(record.user) || record.userName || "Unknown",
    },
    { title: "Date", dataIndex: "date", key: "date", render: formatDate },
    { title: "Time", dataIndex: "time", key: "time", render: valueOrDash },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const id = getId(record);
        return (
          <Space>
            <Button
              type="link"
              icon={<CheckOutlined />}
              disabled={!id || normalizeStatus(record.status) === "approved"}
              onClick={() => onStatusChange(id, "approved")}
            >
              Approve
            </Button>
            <Button
              danger
              type="link"
              icon={<CloseOutlined />}
              disabled={!id || normalizeStatus(record.status) === "rejected"}
              onClick={() => onStatusChange(id, "rejected")}
            >
              Reject
            </Button>
          </Space>
        );
      },
    },
  ];

  return renderTable(bookings, columns, "No bookings found");
}

function renderMaintenance(maintenance, onStatusChange) {
  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_, record) => record.title || record.issue || record.description || "Request",
    },
    {
      title: "Resident",
      key: "resident",
      render: (_, record) => getUserName(record.user) || record.userName || "Unknown",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: valueOrDash,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const id = getId(record);
        return (
          <Space>
            <Button
              type="link"
              disabled={!id || normalizeStatus(record.status) === "in_progress"}
              onClick={() => onStatusChange(id, "in_progress")}
            >
              Start
            </Button>
            <Button
              type="link"
              icon={<CheckOutlined />}
              disabled={!id || normalizeStatus(record.status) === "resolved"}
              onClick={() => onStatusChange(id, "resolved")}
            >
              Resolve
            </Button>
          </Space>
        );
      },
    },
  ];

  return renderTable(maintenance, columns, "No maintenance requests found");
}

function renderPayments(form, onCreate) {
  return (
    <div style={styles.panel}>
      <Title level={4} style={styles.panelTitle}>
        Create Payment Record
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreate}
        initialValues={{ status: "unpaid" }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="User ID"
              name="userId"
              rules={[{ required: true, message: "Please enter a user ID." }]}
            >
              <Input placeholder="Resident user ID" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Fee Type"
              name="type"
              rules={[{ required: true, message: "Please enter a fee type." }]}
            >
              <Input placeholder="Property Management Fee" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please enter an amount." }]}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Due Date"
              name="dueDate"
              rules={[{ required: true, message: "Please choose a due date." }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Status" name="status">
              <Select options={PAYMENT_STATUS_OPTIONS.map((value) => ({ value, label: toTitle(value) }))} />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          Create Payment
        </Button>
      </Form>
    </div>
  );
}

function renderTable(data, columns, emptyText) {
  if (data.length === 0) {
    return (
      <div style={styles.panel}>
        <Empty description={emptyText} />
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => getId(record) || record.email || record.title || JSON.stringify(record)}
        pagination={{ pageSize: 8 }}
        scroll={{ x: true }}
      />
    </div>
  );
}

function toList(response) {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getId(record) {
  return record?.id ?? record?._id ?? record?.uuid;
}

function getUserName(user) {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user.fullName || user.name || user.username || user.email || "";
}

function renderRole(record) {
  const role = record.role || record.accountType || record.type;
  const roles = record.roles || record.authorities;
  if (Array.isArray(roles)) {
    return roles.map((item) => getRoleName(item)).join(", ");
  }
  return getRoleName(role) || "Resident";
}

function getRoleName(role) {
  if (!role) return "";
  if (typeof role === "string") return role;
  return role.name || role.authority || "";
}

function valueOrDash(value) {
  return value || "-";
}

function formatDate(value) {
  if (!value) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
}

function getActionError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function renderStatus(status) {
  const normalized = normalizeStatus(status);
  return <Tag color={getStatusColor(normalized)}>{toTitle(normalized || "unknown")}</Tag>;
}

function normalizeStatus(status) {
  return String(status || "").toLowerCase();
}

function toTitle(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusColor(status) {
  if (["paid", "approved", "resolved"].includes(status)) return "green";
  if (["pending", "in_progress"].includes(status)) return "orange";
  if (["unpaid", "rejected", "cancelled"].includes(status)) return "red";
  return "default";
}

function updateLocalStatus(items, id, status) {
  return items.map((item) => (getId(item) === id ? { ...item, status } : item));
}

function countStatus(items, status) {
  return items.filter((item) => normalizeStatus(item.status) === status).length;
}

function countOpenMaintenance(items) {
  return items.filter((item) => {
    const status = normalizeStatus(item.status);
    return status !== "resolved" && status !== "closed";
  }).length;
}

const styles = {
  page: {
    maxWidth: "1180px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  },
  title: {
    marginBottom: 4,
  },
  statCard: {
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
  },
  panel: {
    background: "#ffffff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
  },
  panelTitle: {
    marginTop: 0,
  },
  center: {
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Admin;
