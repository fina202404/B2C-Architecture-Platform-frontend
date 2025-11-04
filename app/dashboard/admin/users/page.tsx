'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button, Select, message, Spin, Space } from 'antd';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { api } from '@/lib/api';

interface UserRow {
  _id: string;
  fullName: string;
  email: string;
  role: 'Client' | 'Architect' | 'Admin';
  profileType?: string;
  isActive?: boolean;
}

export default function AdminUsersPage() {
  const user = useAuthGuard('admin');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, isActive: boolean) {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/admin/users/${id}/status`,
        { isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`User ${isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      message.error('Failed to update status');
    }
  }

  async function handleRoleChange(id: string, role: string) {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/admin/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Role updated to ${role}`);
      fetchUsers();
    } catch (err) {
      message.error('Failed to update role');
    }
  }

  if (!user) return null;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: UserRow, b: UserRow) =>
        a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: UserRow) => (
        <Select
          size="small"
          value={role}
          onChange={(val) => handleRoleChange(record._id, val)}
          options={[
            { value: 'Client', label: 'Client' },
            { value: 'Architect', label: 'Architect' },
            { value: 'Admin', label: 'Admin' },
          ]}
        />
      ),
    },
    {
      title: 'Profile Type',
      dataIndex: 'profileType',
      key: 'profileType',
      render: (text: string) => text || '—',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: UserRow) => (
        <Space>
          <Button
            type={record.isActive ? 'default' : 'primary'}
            danger={record.isActive}
            size="small"
            onClick={() => handleStatusChange(record._id, !record.isActive)}
          >
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin tip="Loading users..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
            bordered
          />
        )}
      </div>
    </main>
  );
}
