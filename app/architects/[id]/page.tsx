'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  Typography,
  Row,
  Col,
  Rate,
  Tag,
  Spin,
  Button,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { bookConsultation } from '@/lib/consultationService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ArchitectDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [architect, setArchitect] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [booking, setBooking] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchArchitect = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/architect/public/${id}/portfolio`);
        const data = await res.json();
        if (data.success) {
          setArchitect(data.data);
        } else {
          console.warn('Architect data not found', data);
        }
      } catch (error) {
        console.error('Error fetching architect:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArchitect();
  }, [id]);

  // Load client projects for booking dropdown
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setProjects(data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleBookConsultation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.warning('Please log in as a client to book a consultation.');
        return;
      }

      const values = await form.validateFields();
      setBooking(true);

      const payload = {
        architectId: id,
        projectId: values.projectId,
        startTime: values.dateTime.toISOString(),
        message: values.message,
      };

      const data = await bookConsultation(payload, token);

      if (data.success) {
        message.success('Consultation booked successfully!');
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error(data.error?.message || 'Failed to book consultation.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      message.error('An error occurred while booking consultation.');
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading architect profile..." />
      </div>
    );

  if (!architect)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Architect not found.
      </div>
    );

  const photoUrl = architect.photo
    ? `http://localhost:5000${architect.photo}`
    : '/default-avatar.png';

  return (
    <main className="min-h-screen bg-bgPage text-textPrimary px-8 py-16">
      <div className="max-w-[1200px] mx-auto">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8}>
            <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-lg">
              <Image src={photoUrl} alt={architect.name || 'Architect'} fill className="object-cover" />
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div className="space-y-3">
              <Title level={2} className="!text-accentGold">{architect.name}</Title>
              <Text className="block text-gray-400">{architect.email}</Text>
              <Rate disabled defaultValue={architect.rating || 5} />
              <Paragraph className="!text-gray-300 max-w-lg">
                {architect.bio || 'Architect bio not available.'}
              </Paragraph>

              <div className="space-x-2">
                {architect.specialties?.length ? (
                  architect.specialties.map((s: string, i: number) => (
                    <Tag color="gold" key={i}>
                      {s}
                    </Tag>
                  ))
                ) : (
                  <Tag color="default">General Architecture</Tag>
                )}
              </div>

              <div className="pt-4 space-x-3">
                <Button type="primary" size="large" onClick={() => setIsModalOpen(true)}>
                  Book Consultation
                </Button>
                <Link href="/projects">
                  <Button ghost size="large">View Other Projects</Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        <section className="mt-20">
          <Title level={3} className="!text-accentGold mb-8">
            Featured Projects
          </Title>
          {architect.projects?.length ? (
            <Row gutter={[24, 24]}>
              {architect.projects.map((proj: any) => (
                <Col xs={24} md={12} lg={8} key={proj._id}>
                  <Card
                    hoverable
                    className="bg-bgSectionDark border border-borderSoft rounded-xl text-center shadow-card transition-all"
                  >
                    <Title level={4} className="!text-white">
                      {proj.title}
                    </Title>
                    <Text className="block text-gray-400 capitalize">
                      Status: {proj.status}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Text className="text-gray-400">No projects available yet.</Text>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      <Modal
        title="Book a Consultation"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleBookConsultation}
        confirmLoading={booking}
        okText="Book Now"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Select Project"
            name="projectId"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select placeholder="Choose a project">
              {projects.map((proj) => (
                <Option key={proj._id} value={proj._id}>
                  {proj.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Date & Time"
            name="dateTime"
            rules={[{ required: true, message: 'Please select a date and time' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Message" name="message">
            <TextArea rows={4} placeholder="Add a note or request..." />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
