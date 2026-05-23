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
  // 预约记录（模拟）
  const [reservations, setReservations] = useState([
    { id: 1, facility: '多功能厅', date: '2025-05-10', time: '14:00-16:00', user: '张三', status: 'approved' },
    { id: 2, facility: '健身房', date: '2025-05-11', time: '09:00-10:00', user: '李四', status: 'pending' },
    { id: 3, facility: '会议室', date: '2025-05-12', time: '10:00-12:00', user: '王五', status: 'approved' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [isFacilityLocked, setIsFacilityLocked] = useState(false);
  const [lockedFacility, setLockedFacility] = useState('');

  // 可预约设施列表，改为从后端读取
  const facilities = ['多功能厅', '健身房', '会议室', '棋牌室', '儿童乐园'];

  // 打开预约弹窗
  const openModal = (facilityName = null, lock = false) => {
    if (lock && facilityName) {
      // 快速预约
      setIsFacilityLocked(true);
      setLockedFacility(facilityName);
      form.setFieldsValue({ facility: facilityName });
    } else {
      // 立即预约
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

  // 提交预约申请
  const handleReserve = (values) => {
    const newReservation = {
      id: reservations.length + 1,
      facility: values.facility,
      date: values.date.format('YYYY-MM-DD'),
      time: `${values.time.format('HH:mm')}-${values.time.add(1, 'hour').format('HH:mm')}`,
      user: '当前用户', // TODO: 替换为实际登录用户
      status: 'pending',
    };
    setReservations([newReservation, ...reservations]);
    message.success('预约申请已提交，等待物业审核');
    closeModal();
  };

  return (
    <div style={styles.page}>
      <Card bordered={false} style={styles.card}>
        {/* 头部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2}>设施预约</Title>
            <Paragraph type="secondary">提前预订社区公共设施</Paragraph>
          </div>
          <Button type="primary" icon={<CalendarOutlined />} onClick={() => openModal()}>
            立即预约
          </Button>
        </div>

        {/* 设施卡片列表 */}
        <Row gutter={[16, 16]}>
          {facilities.map(facility => (
            <Col span={12} key={facility}>
              <Card size="small" title={facility} extra={<Tag color="blue">可预约</Tag>}>
                <Space direction="vertical">
                  <Text><UserOutlined /> 今日剩余时段：10:00-12:00, 14:00-17:00</Text>
                  {/* 快速预约按钮 */}
                  <Button type="link" onClick={() => openModal(facility, true)}>
                    快速预约
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 我的预约记录 */}
        <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>我的预约记录</Title>
        <List
          dataSource={reservations}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color={item.status === 'approved' ? 'green' : 'orange'}>
                  {item.status === 'approved' ? '已通过' : '审核中'}
                </Tag>
              ]}
            >
              <List.Item.Meta
                title={`${item.facility} · ${item.date}`}
                description={<Space><ClockCircleOutlined />{item.time}<UserOutlined />{item.user}</Space>}
              />
            </List.Item>
          )}
        />

        {/* 预约弹窗 */}
        <Modal
          title="预约设施"
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={500}
        >
          <Form form={form} onFinish={handleReserve} layout="vertical">
            <Form.Item
              name="facility"
              label="选择设施"
              rules={[{ required: true, message: '请选择设施' }]}
            >
              <Select
                placeholder="请选择设施"
                allowClear={!isFacilityLocked}  // 锁定时不允许清空
                disabled={isFacilityLocked}     // 锁定时不可编辑
              >
                {facilities.map(f => (
                  <Option key={f} value={f}>{f}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="预约日期"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="time"
              label="开始时间"
              rules={[{ required: true, message: '请选择开始时间' }]}
            >
              <TimePicker format="HH:mm" minuteStep={30} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">提交预约</Button>
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