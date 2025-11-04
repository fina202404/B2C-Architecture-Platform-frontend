'use client';

import { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Button, message, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { ReloadOutlined, CalendarOutlined } from '@ant-design/icons';

// ✅ Interface for consultation objects
interface Consultation {
  _id: string;
  clientId?: {
    fullName?: string;
    email?: string;
  };
  projectId?: {
    title?: string;
    status?: string;
  };
  startTime: string;
  status: string;
}

export default function ArchitectConsultationsPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch consultations from backend
  const fetchConsultations = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      if (!refreshing) setLoading(true);

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://your-backend.azurewebsites.net/api'; // fallback for production

      const response = await fetch(`${apiBase}/consultations/architect`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setConsultations(data.data);
      } else {
        message.error('Failed to load consultations');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      message.error('Something went wrong while fetching consultations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router, refreshing]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // ✅ Define table columns
  const columns = [
    {
      title: 'Client',
      dataIndex: ['clientId', 'fullName'],
      key: 'client',
      render: (text: string | undefined) => text || '—',
    },
    {
      title: 'Project',
      dataIndex: ['projectId', 'title'],
      key: 'project',
      render: (text: string | undefined) => text || '—',
    },
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'date',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Completed') color = 'green';
        else if (status === 'Cancelled') color = 'red';
        else if (status === 'Pending') color = 'gold';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Consultation) => (
        <Button
          type="link"
          onClick={() =>
            router.push(`/dashboard/architect/consultations/${record._id}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push('/dashboard/architect')} type="default">
            ← Back to Dashboard
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={refreshing}
            onClick={() => {
              setRefreshing(true);
              fetchConsultations();
            }}
          >
            Refresh
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          My Consultations <CalendarOutlined />
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading consultations..." />
        </div>
      ) : consultations.length > 0 ? (
        <Table
          columns={columns}
          dataSource={consultations}
          rowKey="_id"
          pagination={false}
          bordered
        />
      ) : (
        <div className="text-center text-gray-400 py-10 border border-gray-700 rounded-lg bg-[#1e1e1e]">
          No consultations yet.
        </div>
      )}
    </div>
  );
}
