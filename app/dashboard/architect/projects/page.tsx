'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Input,
  message,
  Typography,
  Spin,
  Card,
  Row,
  Col,
  Badge,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { fetchWithToken } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const { Title } = Typography;
const { Option } = Select;

interface Project {
  _id: string;
  title: string;
  status: string;
  budget?: number;
  clientId?: { fullName?: string };
  notes?: string;
  updatedAt?: string;
}

export default function ArchitectProjects() {
  const { user, token } = useAuthGuard(); // ✅ ensure we have user & token
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // ✅ Load projects (via dashboard route)
  const loadProjects = async () => {
    if (!user?._id || !token) return;
    try {
      setLoading(true);
      const res = await fetchWithToken(
        `/architect/dashboard/projects?architectId=${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res?.success) throw new Error(res?.message || 'Failed to fetch projects');

      // For this endpoint, res.count is returned — so just wrap it as an array or dummy
      // But if later you attach project list data, it’ll render correctly.
      const projectList = res.data || []; // fallback if backend later includes detailed list
      setProjects(projectList);
      setFilteredProjects(projectList);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  // ✅ Apply filters
  useEffect(() => {
    let filtered = projects;
    if (searchText) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          p.clientId?.fullName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    setFilteredProjects(filtered);
  }, [searchText, filterStatus, projects]);

  // ✅ Modal actions
  const openModal = (project: Project) => {
    setSelectedProject(project);
    form.setFieldsValue({
      status: project.status,
      notes: project.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetchWithToken(`/architect/projects/${selectedProject?._id}`, {
        method: 'PATCH',
        data: values,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res?.success) throw new Error(res?.message || 'Update failed');

      message.success('✅ Project updated successfully');

      const updated = projects.map((p) =>
        p._id === selectedProject?._id
          ? { ...p, ...values, updatedAt: new Date().toISOString() }
          : p
      );
      setProjects(updated);
      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err.message || 'Update failed');
    }
  };

  // ✅ Status badge visuals
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'completed') {
      return <Badge color="green" text={<span className="flex items-center gap-1"><CheckCircleOutlined /> Completed</span>} />;
    }
    if (s === 'in progress' || s === 'ongoing') {
      return <Badge color="gold" text={<span className="flex items-center gap-1"><ClockCircleOutlined /> In Progress</span>} />;
    }
    if (s === 'proposal pending' || s === 'pending') {
      return <Badge color="red" text={<span className="flex items-center gap-1"><ExclamationCircleOutlined /> Pending</span>} />;
    }
    return <Badge color="default" text={<span className="flex items-center gap-1"><MinusCircleOutlined /> Unknown</span>} />;
  };

  // ✅ Dashboard summary stats
  const total = projects.length;
  const completed = projects.filter((p) => p.status.toLowerCase() === 'completed').length;
  const inProgress = projects.filter((p) => ['in progress', 'ongoing'].includes(p.status.toLowerCase())).length;
  const pending = projects.filter((p) => ['pending', 'proposal pending'].includes(p.status.toLowerCase())).length;

  // ✅ Table Columns
  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: 'Client',
      dataIndex: ['clientId', 'fullName'],
      key: 'client',
      render: (_: any, record: Project) => record?.clientId?.fullName || '—',
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (value: number) => (value ? `$${value.toLocaleString()}` : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => (date ? new Date(date).toLocaleString() : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <Space>
          <Button onClick={() => openModal(record)} type="primary">
            Update
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spin size="large" tip="Loading Projects..." />
      </div>
    );
  }

  // ✅ Main Layout
  return (
    <div className="p-6">
      <Title level={2}>My Projects</Title>

      {/* 🌟 Summary Bar */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl">
            <Statistic title="Total Projects" value={total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl">
            <Statistic title="Completed" value={completed} prefix={<CheckCircleOutlined />} valueStyle={{ color: 'green' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl">
            <Statistic title="In Progress" value={inProgress} prefix={<ClockCircleOutlined />} valueStyle={{ color: 'goldenrod' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl">
            <Statistic title="Pending" value={pending} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: 'crimson' }} />
          </Card>
        </Col>
      </Row>

      {/* 🔍 Search & Filter */}
      <Card className="shadow-md rounded-xl mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by project or client..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              value={filterStatus || undefined}
              onChange={(value) => setFilterStatus(value)}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="proposal pending">Proposal Pending</Option>
              <Option value="in progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              onClick={() => {
                setSearchText('');
                setFilterStatus(null);
                setFilteredProjects(projects);
              }}
            >
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 🧱 Project Table */}
      <Card className="shadow-md rounded-xl">
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          locale={{
            emptyText: (
              <div className="text-gray-500">No projects found.</div>
            ),
          }}
        />
      </Card>

      {/* 🛠 Update Modal */}
      <Modal
        title={`Update Project: ${selectedProject?.title || ''}`}
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Select status' }]}
          >
            <Select placeholder="Select project status">
              <Option value="proposal pending">Proposal Pending</Option>
              <Option value="in progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes (optional)">
            <Input.TextArea rows={3} placeholder="Add notes or updates..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
