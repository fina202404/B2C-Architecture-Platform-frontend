'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
  Card,
  Spin,
  Modal,
} from 'antd';
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('You must be logged in');
        router.push('/auth/login');
        return;
      }

      // prepare form data
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'files' && values.files) {
          values.files.forEach((file: any) =>
            formData.append('files', file.originFileObj)
          );
        } else {
          formData.append(key, values[key]);
        }
      });

      const res = await api.post('/projects/client/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        // 🎉 Success modal animation
        Modal.success({
          title: 'Project Created Successfully!',
          icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
          content: 'Your new project has been submitted for review.',
          okText: 'View My Projects',
          centered: true,
          onOk: () => router.push('/dashboard/projects'),
        });

        // Reset form
        form.resetFields();

        // Optional delay before redirect
        setTimeout(() => {
          router.push('/dashboard/projects');
        }, 1500);
      } else {
        message.error('Failed to create project');
      }
    } catch (err: any) {
      console.error(err);
      message.error('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Card
          title="Create New Project"
          bordered
          className="shadow-md transition-transform hover:scale-[1.01]"
        >
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spin tip="Submitting project..." size="large" />
            </div>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ style: '', budget: undefined }}
            >
              <Form.Item
                label="Project Title"
                name="title"
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input placeholder="Enter your project title" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <Input.TextArea rows={4} placeholder="Describe your project" />
              </Form.Item>

              <Form.Item
                label="Service ID"
                name="serviceId"
                rules={[{ required: true, message: 'Please select a service type' }]}
              >
                <Select placeholder="Select a service">
                  <Select.Option value="basic-service">Basic Service</Select.Option>
                  <Select.Option value="premium-service">Premium Service</Select.Option>
                  <Select.Option value="custom-service">Custom Service</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please enter a location' }]}
              >
                <Input placeholder="e.g., Tokyo, Japan" />
              </Form.Item>

              <Form.Item label="Style" name="style">
                <Input placeholder="Optional: e.g., Modern, Minimalist" />
              </Form.Item>

              <Form.Item label="Budget" name="budget">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Optional: Enter budget in yen"
                  min={0}
                />
              </Form.Item>

              <Form.Item label="Upload Files" name="files" valuePropName="fileList">
                <Upload beforeUpload={() => false} multiple>
                  <Button icon={<UploadOutlined />}>Select Files</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end space-x-3">
                  <Button onClick={() => router.push('/dashboard/projects')}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Create Project
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </main>
  );
}
