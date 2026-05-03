import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Drawer, Menu, Typography } from 'antd';

export const DRAWER_WIDTH = 260;

function Sidebar({ open, onClose, isAdmin }) {
  const { pathname } = useLocation();
  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
    { label: 'Discussion', path: '/discussion', icon: <MessageOutlined /> },
    { label: 'Payment', path: '/payment', icon: <CreditCardOutlined /> },
    { label: 'Room Reserving', path: '/rooms', icon: <CalendarOutlined /> },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: <SettingOutlined /> });
  }

  return (
    <Drawer
      placement="left"
      open={open}
      onClose={onClose}
      width={DRAWER_WIDTH}
      styles={{ body: { padding: 0 } }}
      title={
        <div>
          <Typography.Title level={4} style={styles.brandTitle}>
            Community
          </Typography.Title>
          <Typography.Text type="secondary">Service Center</Typography.Text>
        </div>
      }
    >
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        onClick={onClose}
        items={navItems.map((item) => ({
          key: item.path,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>,
        }))}
        style={styles.menu}
      />
    </Drawer>
  );
}

const styles = {
  brandTitle: {
    margin: 0,
  },
  menu: {
    borderInlineEnd: 'none',
    padding: '8px 12px',
  },
};

export default Sidebar;
