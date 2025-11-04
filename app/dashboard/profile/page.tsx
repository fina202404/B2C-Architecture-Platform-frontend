'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Form,
  Input,
  Button,
  message,
  Spin,
  Modal,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { fetchWithToken } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const { Title, Paragraph } = Typography;

interface ArchitectProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  location?: string;
}

export default function ArchitectProfilePage() {
  const user = useAuthGuard('architect');
  const [profile, setProfile] = useState<ArchitectProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  // ✅ Load current architect profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchWithToken('/architect/user/me');
        if (!res?.success)
          throw new Error(res?.message || 'Failed to fetch architect profile');

        setProfile(res.data);
      } catch (err: any) {
        console.error(err);
        message.error(err.message || 'Error loading architect profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ✅ Handle profile update
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetchWithToken('/architect/user/update', {
        method: 'PUT',
        data: values,
      });

      if (!res?.success) throw new Error(res?.message || 'Failed to update profile');

      message.success('Profile updated successfully ✨');
      setProfile(res.data);
      setEditing(false);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Error saving profile');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spin size="large" tip="Loading Profile..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 👤 Profile Header */}
        <Card bordered={false} className="shadow-md rounded-xl text-center p-8 bg-white">
          <Avatar
            size={96}
            style={{ backgroundColor: '#1890ff', fontSize: 32 }}
            icon={<UserOutlined />}
          />
          <Title level={3} className="mt-3">
            {profile?.name || 'Architect'}
          </Title>
          <Paragraph className="text-gray-600 flex justify-center items-center gap-2">
            <MailOutlined /> {profile?.email}
          </Paragraph>

          {profile?.phone && (
            <Paragraph className="text-gray-600 flex justify-center items-center gap-2">
              <PhoneOutlined /> {profile.phone}
            </Paragraph>
          )}

          <Button
            icon={<EditOutlined />}
            type="primary"
            className="mt-2"
            onClick={() => {
              form.setFieldsValue(profile);
              setEditing(true);
            }}
          >
            Edit Profile
          </Button>
        </Card>

        {/* 📋 Professional Details */}
        <Card bordered={false} className="shadow-sm rounded-xl bg-white">
          <Title level={4}>Professional Details</Title>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Specialization">
              {profile?.specialization || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Experience">
              {profile?.experience ? `${profile.experience} years` : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {profile?.location || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Bio">
              {profile?.bio || 'No bio available.'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* 🛠️ Edit Modal */}
      <Modal
        title="Edit Profile"
        open={editing}
        onOk={handleSave}
        onCancel={() => setEditing(false)}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input placeholder="Phone number" prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item name="specialization" label="Specialization">
            <Input placeholder="e.g. Residential Architecture" />
          </Form.Item>

          <Form.Item name="experience" label="Experience (Years)">
            <Input type="number" placeholder="Years of experience" />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="City, Country" prefix={<EnvironmentOutlined />} />
          </Form.Item>

          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={3} placeholder="Describe your work or style..." />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
