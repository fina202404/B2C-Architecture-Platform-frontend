'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Typography, Spin } from 'antd';
import { UserOutlined, ProjectOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

type UserInfo = {
  fullName: string;
  email: string;
  role: string;
};

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fullName = localStorage.getItem('fullName') || '';
    const email = localStorage.getItem('email') || '';
    const role = localStorage.getItem('role') || '';

    if (!fullName || !email) {
      router.push('/auth/login');
      return;
    }

    if (role.toLowerCase() !== 'client') {
      router.push('/dashboard/admin');
      return;
    }

    setUser({ fullName, email, role });
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bgPage">
        <Spin tip="Loading your dashboard..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bgPage p-8 text-textPrimary">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <Card bordered={false} className="shadow-card bg-bgSectionDark border border-borderSoft">
          <Title level={3} className="mb-2 !text-textPrimary">
            Welcome back, {user.fullName} 👋
          </Title>
          <Paragraph className="text-textSecondary mb-2">
            You are logged in as <strong>{user.role}</strong>.
          </Paragraph>
          <Paragraph className="text-sm text-textSecondary">
            <strong>Email:</strong> {user.email}
          </Paragraph>
        </Card>

        {/* Quick Actions */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card
              hoverable
              onClick={() => router.push('/dashboard/profile')}
              className="shadow-card bg-bgSectionDark border border-borderSoft hover:shadow-md transition"
              actions={[<UserOutlined key="profile" />]}
            >
              <Title level={5}>Profile Settings</Title>
              <Paragraph className="text-sm text-textSecondary">
                Update your account details and preferences.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              onClick={() => router.push('/dashboard/projects')}
              className="shadow-card bg-bgSectionDark border border-borderSoft hover:shadow-md transition"
              actions={[<ProjectOutlined key="projects" />]}
            >
              <Title level={5}>My Projects</Title>
              <Paragraph className="text-sm text-textSecondary">
                View project progress and communicate with your architect.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              onClick={() => router.push('/dashboard/client/consultations')}
              className="shadow-card bg-bgSectionDark border border-borderSoft hover:shadow-md transition"
              actions={[<CalendarOutlined key="consult" />]}
            >
              <Title level={5}>Consultation Booking</Title>
              <Paragraph className="text-sm text-textSecondary">
                Book sessions and review past consultations.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}
