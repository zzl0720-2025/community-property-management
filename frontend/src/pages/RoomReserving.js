import React, { useState } from 'react';
import {
  Card, Typography, Row, Col, Button, Modal, Form,
  DatePicker, TimePicker, message, List, Tag, Space, Select
} from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

function RoomReserving() {
  // Reservation records (mock data — replace with API calls for real integration)
  const [reservations, setReservations] = useState([
    { id: 1, facility: 'Multipurpose Hall', date: '2025-05-10', time: '14:00-16:00', user: 'Alice', status: 'approved' },
    { id: 2, facility: 'Gym', date: '2025-05-11', time: '09:00-10:00', user: 'Bob', status: 'pending' },
    { id: 3, facility: 'Meeting Room', date: '2025-05-12', time: '10:00-12:00', user: 'Charlie', status: 'approved' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [isFacilityLocked, setIsFacilityLocked] = useState(false);
  const [lockedFacility, setLockedFacility] = useState('');

  // Available facilities; should later be fetched from the backend
  const facilities = ['Multipurpose Hall', 'Gym', 'Meeting Room', 'Game Room', "Children's Playground"];

  // Open the reservation modal
  const openModal = (facilityName = null, lock = false) => {
    if (lock && facilityName) {
      // Quick reservation
      setIsFacilityLocked(true);
      setLockedFacility(facilityName);
      form.setFieldsValue({ facility: facilityName });
    } else {
      // Standard reservation
      setIsFacilityLocked(false);
      setLockedFacility('');
      form.setFieldsValue({ facility: undefined });
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsFacilityLocked(false);
    setLockedFacility('');
    form.resetFields();
  };

  // Submit a reservation request
  const handleReserve = (values) => {
    const newReservation = {
      id: reservations.length + 1,
      facility: values.facility,
      date: values.date.format('YYYY-MM-DD'),
      time: `${values.time.format('HH:mm')}-${values.time.add(1, 'hour').format('HH:mm')}`,
      user: 'Current User', // TODO: replace with the logged-in user
      status: 'pending',
    };
    setReservations([newReservation, ...reservations]);
    message.success('Reservation submitted. Awaiting management approval.');
    closeModal();
  };

  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2}>Facility Reservation</Title>
            <Paragraph type="secondary">Book community facilities in advance</Paragraph>
          </div>
          <Button type="primary" icon={<CalendarOutlined />} onClick={() => openModal()}>
            Reserve Now
          </Button>
        </div>

        {/* Facility cards */}
        <Row gutter={[16, 16]}>
          {facilities.map(facility => (
            <Col span={12} key={facility}>
              <Card size="small" title={facility} extra={<Tag color="blue">Available</Tag>}>
                <Space direction="vertical">
                  <Text><UserOutlined /> Today's remaining slots: 10:00-12:00, 14:00-17:00</Text>
                  {/* Quick reserve button */}
                  <Button type="link" onClick={() => openModal(facility, true)}>
                    Quick Reserve
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* My reservations */}
        <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>My Reservations</Title>
        <List
          dataSource={reservations}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color={item.status === 'approved' ? 'green' : 'orange'}>
                  {item.status === 'approved' ? 'Approved' : 'Pending'}
                </Tag>
              ]}
            >
              <List.Item.Meta
                title={`${item.facility} - ${item.date}`}
                description={<Space><ClockCircleOutlined />{item.time}<UserOutlined />{item.user}</Space>}
              />
            </List.Item>
          )}
        />

        {/* Reservation modal */}
        <Modal
          title="Reserve Facility"
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={500}
        >
          <Form form={form} onFinish={handleReserve} layout="vertical">
            <Form.Item
              name="facility"
              label="Select facility"
              rules={[{ required: true, message: 'Please select a facility' }]}
            >
              <Select
                placeholder="Please select a facility"
                allowClear={!isFacilityLocked}  // Disable clearing when locked
                disabled={isFacilityLocked}     // Read-only when locked
              >
                {facilities.map(f => (
                  <Option key={f} value={f}>{f}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Reservation date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="time"
              label="Start time"
              rules={[{ required: true, message: 'Please select a start time' }]}
            >
              <TimePicker format="HH:mm" minuteStep={30} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Submit reservation</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

const styles = {
  page: { maxWidth: '960px', margin: '0 auto' },
  card: { boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)' },
};

export default RoomReserving;
