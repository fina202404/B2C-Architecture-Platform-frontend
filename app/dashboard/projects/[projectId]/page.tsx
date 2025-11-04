'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Descriptions, Tag, Button, Spin, message, Typography } from 'antd';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

type UserRef = {
  _id: string;
  fullName: string;
  email: string;
};

type Project = {
  _id: string;
  title: string;
  description: string;
  status: string;
  serviceId?: string;
  clientId?: string | UserRef;
  architectId?: string | UserRef;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { projectId } = useParams() as { projectId: string };

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    async function fetchProject() {
      try {
        const res = await api.get(`/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success && res.data.data) {
          setProject(res.data.data);
        } else {
          message.warning('Project not found');
          router.push('/dashboard/projects');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        message.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin tip="Loading project details..." />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <p>No project found.</p>
        <Button type="link" onClick={() => router.push('/dashboard/projects')}>
          ← Back to My Projects
        </Button>
      </main>
    );
  }

  const statusColor =
    project.status === 'Completed'
      ? 'green'
      : project.status === 'In Progress'
      ? 'orange'
      : 'volcano';

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 🔙 Back button */}
        <Button onClick={() => router.push('/dashboard/projects')}>← Back to My Projects</Button>

        {/* 🏗️ Project Details Card */}
        <Card bordered className="shadow-md">
          <div className="mb-4">
            <Title level={3} className="mb-0">{project.title}</Title>
            <Tag color={statusColor} className="mt-2">{project.status}</Tag>
          </div>

          <Descriptions column={1} bordered size="middle" labelStyle={{ fontWeight: 500 }}>
            <Descriptions.Item label="Project ID">{project._id}</Descriptions.Item>
            <Descriptions.Item label="Description">
              <Paragraph style={{ marginBottom: 0 }}>
                {project.description || 'No description provided.'}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Service ID">{project.serviceId || '-'}</Descriptions.Item>

            <Descriptions.Item label="Client">
              {typeof project.clientId === 'object'
                ? `${project.clientId.fullName} (${project.clientId.email})`
                : project.clientId || '-'}
            </Descriptions.Item>

            <Descriptions.Item label="Architect">
              {typeof project.architectId === 'object'
                ? `${project.architectId.fullName} (${project.architectId.email})`
                : project.architectId || 'Unassigned'}
            </Descriptions.Item>

            <Descriptions.Item label="Created At">
              {project.createdAt ? dayjs(project.createdAt).format('YYYY-MM-DD HH:mm') : '-'}
            </Descriptions.Item>

            <Descriptions.Item label="Last Updated">
              {project.updatedAt ? dayjs(project.updatedAt).format('YYYY-MM-DD HH:mm') : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </main>
  );
}
