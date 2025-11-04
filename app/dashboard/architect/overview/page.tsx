'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Button,
  message,
  Spin,
  Divider,
} from 'antd';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { fetchWithToken } from '@/lib/api';
import {
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function ArchitectOverview() {
  // UseAuthGuard might return an object; make it flexible for build safety
  const auth = useAuthGuard('architect');
  const user: any = (auth as any)?.user || auth;

  const [stats, setStats] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchWithToken('/architect/overview');
        if (!res?.success)
          throw new Error(res?.message || 'Failed to fetch architect stats');
        setStats({
          totalProjects: res.data?.totalProjects || 0,
          ongoingProjects: res.data?.ongoingProjects || 0,
          completedProjects: res.data?.completedProjects || 0,
          pendingPayments: res.data?.pendingPayments || 0,
        });
      } catch (err: any) {
        console.error(err);
        message.error(err.message || 'Error loading architect data');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spin size="large" tip="Loading architect dashboard..." />
      </div>
    );
  }

  // ✅ Safely derive first name
  const firstName =
    typeof user?.name === 'string' && user?.name?.length > 0
      ? user.name.split(' ')[0]
      : typeof user?.fullName === 'string' && user?.fullName?.length > 0
      ? user.fullName.split(' ')[0]
      : 'Architect';

  return (
    <main className="min-h-screen bg-bgPage px-6 py-10 text-textPrimary">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card bordered={false} className="shadow-card rounded-xl bg-bgSectionDark border border-borderSoft">
          <Title level={3} className="!text-textPrimary">Welcome back, {firstName} 👋</Title>
          <Paragraph className="text-textSecondary mb-0">
            Here’s a quick overview of your projects, earnings, and client activity.
          </Paragraph>
        </Card>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-card rounded-xl border border-borderSoft">
              <Statistic
                title="Total Projects"
                value={stats.totalProjects}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-card rounded-xl border border-borderSoft">
              <Statistic
                title="Ongoing Projects"
                value={stats.ongoingProjects}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-card rounded-xl border border-borderSoft">
              <Statistic
                title="Completed Projects"
                value={stats.completedProjects}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-card rounded-xl border border-borderSoft">
              <Statistic
                title="Pending Payments"
                value={stats.pendingPayments}
                prefix={<DollarOutlined />}
                suffix="¥"
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Link href="/dashboard/architect/projects">
              <Card hoverable className="shadow-card rounded-xl text-center border border-borderSoft">
                <Title level={4} className="!text-textPrimary">Manage Projects</Title>
                <Paragraph className="text-textSecondary">View and update your assigned projects.</Paragraph>
                <Button type="primary">Go to Projects</Button>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Link href="/dashboard/architect/services">
              <Card hoverable className="shadow-card rounded-xl text-center border border-borderSoft">
                <Title level={4} className="!text-textPrimary">My Services</Title>
                <Paragraph className="text-textSecondary">Create or update your service packages.</Paragraph>
                <Button type="primary">Manage Services</Button>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Link href="/dashboard/architect/clients">
              <Card hoverable className="shadow-card rounded-xl text-center border border-borderSoft">
                <Title level={4} className="!text-textPrimary">My Clients</Title>
                <Paragraph className="text-textSecondary">View all your connected clients.</Paragraph>
                <Button type="primary">View Clients</Button>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Link href="/dashboard/architect/earnings">
              <Card hoverable className="shadow-card rounded-xl text-center border border-borderSoft">
                <Title level={4} className="!text-textPrimary">My Earnings</Title>
                <Paragraph className="text-textSecondary">Track your total revenue and payouts.</Paragraph>
                <Button type="primary" icon={<RiseOutlined />}>
                  View Earnings
                </Button>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </main>
  );
}
