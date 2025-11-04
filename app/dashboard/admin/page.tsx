'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { adminGetReports, adminGetUsers } from '@/lib/api';
import { fetchPayments, fetchPaymentSummary } from '@/lib/adminPaymentService';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Table,
  Tag,
  message,
  Spin,
  Divider,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  DollarCircleOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const { Title } = Typography;

interface KPIData {
  totalClients?: number;
  totalArchitects?: number;
  monthlyRevenue?: number;
  activeProjects?: number;
}

interface UserRecord {
  _id: string;
  fullName: string;
  email: string;
  role: 'Client' | 'Architect' | 'Admin';
  createdAt: string;
}

interface PaymentRecord {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const user = useAuthGuard('admin');
  const [kpi, setKpi] = useState<KPIData>({});
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // === Chart Filtering States ===
  const [filterRange, setFilterRange] = useState<'7' | '30' | 'all'>('7');
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken') ||
          '';
        if (!token) {
          message.error('Session expired. Please log in again.');
          return;
        }

        // ✅ Fetch reports
        const reportRes = await adminGetReports(token);
        setKpi(reportRes.data || {});

        // ✅ Fetch users
        setTableLoading(true);
        const usersRes = await adminGetUsers(token);
        setUsers(usersRes.data || []);

        // ✅ Fetch payments & summary
        const paySummaryRes = await fetchPaymentSummary(token);
        const payRes = await fetchPayments(token);
        setPaymentSummary(paySummaryRes.data);
        setPayments(payRes.data);
      } catch (err: any) {
        console.error('Admin load error:', err);
        message.error('Failed to load admin data.');
      } finally {
        setLoading(false);
        setTableLoading(false);
      }
    }

    loadData();
  }, []);

  // === Filter Payments for Chart ===
  useEffect(() => {
    if (payments.length === 0) return;

    const now = new Date();
    let cutoff = new Date();

    if (filterRange === '7') cutoff.setDate(now.getDate() - 7);
    else if (filterRange === '30') cutoff.setDate(now.getDate() - 30);
    else cutoff = new Date(0); // All time

    const filtered = payments
      .filter((p) => new Date(p.createdAt) >= cutoff)
      .map((p) => ({
        ...p,
        date: new Date(p.createdAt).toISOString(),
      }))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    setFilteredPayments(filtered);
  }, [payments, filterRange]);

  if (!user) return null;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bgPage">
        <Spin size="large" tip="Loading admin overview..." />
      </main>
    );
  }

  const userColumns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'default';
        if (role === 'Admin') color = 'geekblue';
        else if (role === 'Client') color = 'green';
        else if (role === 'Architect') color = 'volcano';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  const paymentColumns = [
    { title: '#', render: (_: any, __: any, i: number) => i + 1 },
    {
      title: 'Amount (¥)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => amt.toLocaleString(),
    },
    { title: 'Currency', dataIndex: 'currency', key: 'currency' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Succeeded' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => new Date(d).toLocaleDateString(),
    },
  ];

  return (
    <main className="min-h-screen bg-bgPage p-10 text-textPrimary">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* === KPI Section === */}
        <Title level={2} style={{ marginBottom: '2rem' }}>
          Platform Overview
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered hoverable>
              <Statistic
                title="Clients"
                value={kpi.totalClients ?? 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered hoverable>
              <Statistic
                title="Architects"
                value={kpi.totalArchitects ?? 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered hoverable>
              <Statistic
                title="Active Projects"
                value={kpi.activeProjects ?? 0}
                prefix={<ProjectOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card bordered hoverable>
              <Statistic
                title="Revenue (This Month)"
                prefix={<DollarCircleOutlined />}
                value={
                  kpi.monthlyRevenue
                    ? `$${kpi.monthlyRevenue.toLocaleString()}`
                    : '$0'
                }
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        {/* === User Management Table === */}
        <Card title="User Management" bordered hoverable>
          <Table
            columns={userColumns}
            dataSource={users}
            loading={tableLoading}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* === Payment Analytics Section === */}
        <Divider />
        <Title level={3}>💰 Payment Analytics</Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Card bordered hoverable>
              <Statistic
                title="Total Revenue"
                value={`¥${paymentSummary?.totalRevenue?.toLocaleString() || 0}`}
                prefix={<DollarCircleOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card bordered hoverable>
              <Statistic
                title="Succeeded Payments"
                value={paymentSummary?.succeededCount || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card bordered hoverable>
              <Statistic
                title="Total Transactions"
                value={paymentSummary?.totalPayments || 0}
                prefix={<CreditCardOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* === Charts Section === */}
        <Divider />
        <Title level={4}>📊 Revenue & Payment Trends</Title>

        {/* === Filter Bar === */}
        <div className="flex items-center justify-end mb-4 space-x-4">
          <select
            className="border px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value as '7' | '30' | 'all')}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <Row gutter={[24, 24]}>
          {/* 📈 Line Chart: Revenue Over Time */}
          <Col xs={24} md={16}>
            <Card title="Revenue Trend (Filtered)" bordered hoverable>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredPayments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`¥${value}`, 'Revenue']}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString('en-US')
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#1890ff"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* 🥧 Pie Chart: Status Ratio */}
          <Col xs={24} md={8}>
            <Card title="Payment Status Ratio" bordered hoverable>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'Succeeded',
                        value: payments.filter(
                          (p) => p.status === 'Succeeded'
                        ).length,
                      },
                      {
                        name: 'Failed',
                        value: payments.filter(
                          (p) => p.status !== 'Succeeded'
                        ).length,
                      },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    <Cell key="Succeeded" fill="#52c41a" />
                    <Cell key="Failed" fill="#ff4d4f" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* === Payment Table === */}
        <Card
          title="Recent Payments"
          bordered
          hoverable
          style={{ marginTop: '2rem' }}
        >
          <Table
            columns={paymentColumns}
            dataSource={payments}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>
    </main>
  );
}
