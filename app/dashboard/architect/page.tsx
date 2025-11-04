'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
  Card,
  Table,
  Tag,
  Button,
  Typography,
  Spin,
  message,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { fetchWithToken } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

interface Project {
  _id: string;
  title: string;
  description: string;
  clientId?: { fullName?: string };
  status:
    | 'Proposal Pending'
    | 'Pending Approval'
    | 'Approved'
    | 'In Progress'
    | 'Completed';
  createdAt: string;
}

export default function ArchitectDashboard() {
  const auth = useAuthGuard('architect');
  const user: any = (auth as any)?.user || auth; // ✅ build-safe guard
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      try {
        const res = await fetchWithToken('/architect/projects');
        if (!res?.success)
          throw new Error(res?.message || 'Failed to fetch projects');
        setProjects(res.data || []);
      } catch (err: any) {
        console.error('Failed to fetch architect projects:', err);
        message.error(
          err.message || 'Failed to load projects. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  const columns = [
    {
      title: 'Project Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Project) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() =>
            router.push(
              `/dashboard/architect/projects?projectId=${record._id}`
            )
          }
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Client',
      dataIndex: ['clientId', 'fullName'],
      key: 'client',
      render: (text: string) => text || '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Project['status']) => {
        const colorMap: Record<string, string> = {
          Completed: 'green',
          'In Progress': 'blue',
          'Pending Approval': 'orange',
          'Proposal Pending': 'default',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) =>
        text ? new Date(text).toLocaleDateString() : '—',
    },
  ];

  // ✅ Safely compute architect's first name
  const firstName =
    typeof user?.name === 'string' && user?.name?.length > 0
      ? user.name.split(' ')[0]
      : typeof user?.fullName === 'string' && user?.fullName?.length > 0
      ? user.fullName.split(' ')[0]
      : 'Architect';

  // ✅ Loading screen
  if (!user || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin tip="Loading architect dashboard..." />
      </main>
    );
  }

  // ✅ Main dashboard UI
  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push('/dashboard/architect/overview')}
            className="border border-gray-300"
          >
            ← Overview
          </Button>
          <Button
            onClick={() => router.push('/dashboard/architect/projects')}
            type="default"
          >
            Manage Projects
          </Button>
        </div>

        <Card bordered={false} className="shadow-sm">
          <Title level={3}>Welcome back, {firstName} 👋</Title>
          <Paragraph className="text-gray-600 mb-0">
            Manage your assigned projects, deliverables, and client communications.
          </Paragraph>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/architect/overview" className="block">
            <Card hoverable title="Overview">
              <p>View your project summary, earnings, and performance stats.</p>
            </Card>
          </Link>

          <Link href="/dashboard/architect/projects" className="block">
            <Card hoverable title="Projects">
              <p>View and update all your assigned projects.</p>
            </Card>
          </Link>

          <Link href="/dashboard/architect/services" className="block">
            <Card hoverable title="Services">
              <p>Manage your offered services and pricing packages.</p>
            </Card>
          </Link>
        </div>

        {/* Assigned Projects Table */}
        <Card
          title="My Assigned Projects"
          bordered={false}
          className="shadow-sm"
        >
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            locale={{
              emptyText: (
                <div className="text-gray-500">No projects assigned yet.</div>
              ),
            }}
          />
        </Card>
      </div>
    </main>
  );
}
