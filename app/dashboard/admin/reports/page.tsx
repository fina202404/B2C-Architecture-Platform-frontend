'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { api } from '@/lib/api';
import { Card, Statistic, Row, Col, Spin, message, Button } from 'antd';
import {
  UserOutlined,
  ApartmentOutlined,
  ProjectOutlined,
  DollarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function AdminReportsPage() {
  const user = useAuthGuard('admin');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalArchitects: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalRevenue: 0,
  });
  const [trendData, setTrendData] = useState<{ month: string; projects: number }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await api.get('/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        const data = res.data.data;

        // ✅ Normalize backend data to avoid mismatched keys
        setStats({
          totalClients: data.totalClients || 0,
          totalArchitects: data.totalArchitects || 0,
          totalProjects: data.totalProjects || 0,
          activeProjects: data.activeProjects || 0,
          totalRevenue: data.totalRevenue || 0,
        });

        // ✅ Ensure trendData always has 6 months sorted
        const trend = (data.trendData || []).map((t: any) => ({
          month: t.month,
          projects: t.projects,
        }));

        setTrendData(trend);
        setLastUpdated(new Date());
      } else {
        message.warning('⚠️ Failed to fetch admin reports');
      }
    } catch (err) {
      console.error('❌ Error fetching admin reports:', err);
      message.error('Error fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin tip="Loading admin analytics..." />
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard Analytics</h1>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchReports}
              size="small"
            >
              Refresh Now
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-md">
              <Statistic
                title="Total Clients"
                value={stats.totalClients}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-md">
              <Statistic
                title="Total Architects"
                value={stats.totalArchitects}
                prefix={<ApartmentOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-md">
              <Statistic
                title="Active Projects"
                value={stats.activeProjects}
                prefix={<ProjectOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-md">
              <Statistic
                title="Total Revenue (¥)"
                value={stats.totalRevenue}
                prefix={<DollarOutlined />}
                precision={2}
              />
            </Card>
          </Col>
        </Row>

        {/* Project Trend Chart */}
        <div className="bg-white mt-8 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Project Growth Trend (Last 6 Months)</h2>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="#1677ff"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No project trend data available yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
