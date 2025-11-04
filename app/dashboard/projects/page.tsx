'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, message, Spin, Empty } from 'antd';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

type Project = {
  _id: string;
  title: string;
  description: string;
  status: string;
  serviceId?: string;
  createdAt?: string;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch projects from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    async function fetchProjects() {
      try {
        const res = await api.get('/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success && Array.isArray(res.data.data)) {
          setProjects(res.data.data);
        } else {
          message.warning('No projects found');
        }
      } catch (err: any) {
        console.error('Failed to load projects:', err);
        message.error('Failed to fetch your projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [router]);

  // ✅ Status color tags
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Tag color="green">Completed</Tag>;
      case 'In Progress':
        return <Tag color="orange">In Progress</Tag>;
      default:
        return <Tag color="volcano">Proposal Pending</Tag>;
    }
  };

  // ✅ Table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Service ID',
      dataIndex: 'serviceId',
      key: 'serviceId',
      render: (val: string) => val || '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) =>
        val ? new Date(val).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Project) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              router.push(`/dashboard/projects/${record._id}`)
            }
          >
            View Details →
          </Button>
        </Space>
      ),
    },
  ];

  // ✅ Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin tip="Loading your projects..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Projects</h1>
          {/* 🧭 Redirect to Create Page */}
          <Button
            type="primary"
            onClick={() => router.push('/dashboard/client/projects/create')}
          >
            + New Project
          </Button>
        </div>

        {/* ✅ Handle empty projects gracefully */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <Empty
              description="No projects found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button
              type="primary"
              className="mt-4"
              onClick={() => router.push('/dashboard/client/projects/create')}
            >
              Create Your First Project
            </Button>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
            bordered
          />
        )}
      </div>
    </main>
  );
}
