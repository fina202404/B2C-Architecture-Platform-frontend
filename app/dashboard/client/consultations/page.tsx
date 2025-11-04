'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Table, Tag, Typography, Spin, message } from 'antd';
import { CalendarOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { api } from '@/lib/api';

const { Title } = Typography;

interface Consultation {
  _id: string;
  projectId?: {
    title: string;
    status: string;
  };
  architectId?: {
    fullName: string;
    email: string;
  };
  startTime: string;
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
  message?: string;
}

export default function ConsultationPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    async function fetchConsultations() {
      try {
        const res = await api.get('/consultations/client', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setConsultations(res.data.data || []);
        } else {
          message.warning('No consultations found.');
        }
      } catch (err: any) {
        console.error('Failed to fetch consultations:', err);
        message.error('Unable to load consultations.');
      } finally {
        setLoading(false);
      }
    }

    fetchConsultations();
  }, [router]);

  const columns = [
    {
      title: 'Project',
      dataIndex: ['projectId', 'title'],
      key: 'project',
      render: (text: string) => text || '-',
    },
    {
      title: 'Architect',
      dataIndex: ['architectId', 'fullName'],
      key: 'architect',
      render: (text: string) => text || '-',
    },
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Consultation['status']) => {
        const colorMap: Record<Consultation['status'], string> = {
          Pending: 'orange',
          Scheduled: 'blue',
          Completed: 'green',
          Cancelled: 'red',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text: string) => text || '-',
    },
  ];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bgPage">
        <Spin tip="Loading consultations..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bgPage p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/dashboard/client')}
            className="!bg-bgSectionDark !text-textPrimary border border-borderSoft hover:!bg-[#2a2a2a]"
          >
            Back to Dashboard
          </Button>
          <Title level={4} className="m-0 text-accentGold">
            Consultation Bookings
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/architects')}
            className="!bg-accentGold !text-black hover:!opacity-90"
          >
            New Booking
          </Button>
        </div>

        {/* Table Section */}
        <Card bordered={false} className="shadow-card bg-bgSectionDark border border-borderSoft">
          <Table
            columns={columns}
            dataSource={consultations}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            locale={{
              emptyText: (
                <div className="text-textSecondary">
                  No consultations yet.
                  <br />
                  <Button
                    type="link"
                    icon={<CalendarOutlined />}
                    onClick={() => router.push('/architects')}
                  >
                    Book a consultation
                  </Button>
                </div>
              ),
            }}
          />
        </Card>
      </div>
    </main>
  );
}

