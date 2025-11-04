'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout, Menu, Dropdown, Avatar, Space, Spin } from 'antd';
import {
  DashboardOutlined,
  FolderOpenOutlined,
  DollarOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { useAuthGuard, logout } from '@/hooks/useAuthGuard';

const { Header, Content } = Layout;

// 🧭 Architect Dashboard Navigation
const menuItems = [
  {
    key: '/dashboard/architect/overview',
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard/architect/overview">Overview</Link>,
  },
  {
    key: '/dashboard/architect/projects',
    icon: <FolderOpenOutlined />,
    label: <Link href="/dashboard/architect/projects">Projects</Link>,
  },
  {
    key: '/dashboard/architect/consultations',
    icon: <CalendarOutlined />,
    label: <Link href="/dashboard/architect/consultations">Consultations</Link>,
  },
  {
    key: '/dashboard/architect/earnings',
    icon: <DollarOutlined />,
    label: <Link href="/dashboard/architect/earnings">Earnings</Link>,
  },
  {
    key: '/dashboard/architect/clients',
    icon: <TeamOutlined />,
    label: <Link href="/dashboard/architect/clients">Clients</Link>,
  },
];

export default function ArchitectLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const selectedKey = menuItems.find((item) => pathname?.startsWith(item.key))?.key;

  // 👤 Authenticated user info
  const { user, loading } = useAuthGuard('architect');
  const firstName = user?.fullName?.split(' ')[0] || 'Architect';

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin tip="Loading dashboard..." size="large" />
      </div>
    );

  // ⚙️ Dropdown menu for profile actions
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/architect/profile">Profile</Link>,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <Layout className="min-h-screen bg-bgPage text-textPrimary">
      {/* 🔝 Sticky Dashboard Header */}
      <Header className="bg-surface border-b border-borderSoft px-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
          {/* 🧭 Navigation Tabs */}
          <Menu
            mode="horizontal"
            selectedKeys={selectedKey ? [selectedKey] : []}
            items={menuItems}
            style={{
              borderBottom: 'none',
              fontWeight: 500,
              flexGrow: 1,
            }}
          />

          {/* 👤 User Info with Dropdown */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Space className="cursor-pointer hover:opacity-80 transition">
              <Avatar style={{ backgroundColor: '#C6A664' as const, color: '#000' }}>
                {firstName?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              <span className="font-medium text-textPrimary">{firstName}</span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      {/* 📦 Main Page Content */}
      <Content className="max-w-6xl mx-auto p-6">
        <div className="bg-bgSectionDark border border-borderSoft rounded-xl shadow-card p-6">
          {children}
        </div>
      </Content>
    </Layout>
  );
}
