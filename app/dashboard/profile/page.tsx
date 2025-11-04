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

interface Profile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  location?: string;
}

export default function ProfilePage() {
  const auth = useAuthGuard();
  const role = (auth as any)?.user?.role || '';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const meEndpoint = role === 'Architect' ? '/architect/user/me' : '/users/me';
  const updateEndpoint = role === 'Architect' ? '/architect/user/update' : '/users/me';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchWithToken(meEndpoint);
        if (!res?.success) throw new Error(res?.message || 'Failed to fetch profile');
        const data = res.data || res;
        setProfile({
          name: data?.fullName || data?.name || '',
          email: data?.email || '',
          phone: data?.phone || '',
          bio: data?.bio || '',
          specialization: data?.specialization || '',
          experience: data?.experience ? Number(data.experience) : undefined,
          location: data?.location || '',
        });
      } catch (err: any) {
        console.error(err);
        message.error(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [meEndpoint]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetchWithToken(updateEndpoint, {
        method: 'PUT',
        data: values,
      });
      if (!res?.success) throw new Error(res?.message || 'Failed to update profile');
      message.success('Profile updated successfully');
      setProfile({
        name: values.name,
        email: profile?.email || '',
        phone: values.phone,
        bio: values.bio,
        specialization: values.specialization,
        experience: values.experience ? Number(values.experience) : undefined,
        location: values.location,
      });
      setEditing(false);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Error saving profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spin size="large" tip="Loading Profile..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bgPage px-6 py-10 text-textPrimary">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card bordered={false} className="shadow-card rounded-xl text-center p-8 bg-bgSectionDark border border-borderSoft">
          <Avatar size={96} style={{ backgroundColor: '#C6A664', color: '#000', fontSize: 32 }} icon={<UserOutlined />} />
          <Title level={3} className="mt-3 !text-textPrimary">{profile?.name || 'User'}</Title>
          <Paragraph className="text-textSecondary flex justify-center items-center gap-2">
            <MailOutlined /> {profile?.email}
          </Paragraph>
          {profile?.phone && (
            <Paragraph className="text-textSecondary flex justify-center items-center gap-2">
              <PhoneOutlined /> {profile.phone}
            </Paragraph>
          )}
          <Button icon={<EditOutlined />} type="primary" className="mt-2" onClick={() => { form.setFieldsValue(profile || {}); setEditing(true); }}>
            Edit Profile
          </Button>
        </Card>

        <Card bordered={false} className="shadow-card rounded-xl bg-bgSectionDark border border-borderSoft">
          <Title level={4} className="!text-textPrimary">Professional Details</Title>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Specialization">{profile?.specialization || '-'}</Descriptions.Item>
            <Descriptions.Item label="Experience">{profile?.experience ? `${profile.experience} years` : '-'}</Descriptions.Item>
            <Descriptions.Item label="Location">{profile?.location || '-'}</Descriptions.Item>
            <Descriptions.Item label="Bio">{profile?.bio || 'No bio available.'}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Modal title="Edit Profile" open={editing} onOk={handleSave} onCancel={() => setEditing(false)} okText="Save">
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Enter your full name" className="bg-white text-black" />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Phone number" prefix={<PhoneOutlined />} className="bg-white text-black" />
          </Form.Item>
          <Form.Item name="specialization" label="Specialization">
            <Input placeholder="e.g. Residential Architecture" className="bg-white text-black" />
          </Form.Item>
          <Form.Item name="experience" label="Experience (Years)">
            <Input type="number" placeholder="Years of experience" className="bg-white text-black" />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="City, Country" prefix={<EnvironmentOutlined />} className="bg-white text-black" />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={3} placeholder="Describe your work or style" className="bg-white text-black" />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
