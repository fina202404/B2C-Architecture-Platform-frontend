'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Table, Spin, message } from 'antd';
import { DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { fetchWithToken } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const { Title, Paragraph } = Typography;

interface Payout {
  amount: number;
  date: string;
}

export default function ArchitectEarnings() {
  useAuthGuard();
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const res = await fetchWithToken('/architect/payments/earnings');
      if (!res?.success) throw new Error(res?.message || 'Failed to fetch earnings');
      setTotalEarnings(res.data?.totalEarnings || 0);
      setPayouts(res.data?.payoutHistory || []);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spin size="large" tip="Loading Earnings..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card bordered={false} className="shadow-md rounded-xl bg-white">
          <Title level={3}>My Earnings 💰</Title>
          <Paragraph className="text-gray-600 mb-0">
            Track your total revenue and payout history here.
          </Paragraph>
        </Card>

        {/* Summary Card */}
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} sm={12} md={8}>
            <Card className="shadow-sm rounded-xl text-center">
              <Statistic
                title="Total Earnings"
                value={totalEarnings}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#16a34a' }}
                suffix="¥"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={16}>
            <Card className="shadow-sm rounded-xl">
              <Title level={5}>Earnings Trend</Title>
              {payouts.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={payouts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip formatter={(v) => `¥${v.toLocaleString()}`} />
                    <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Paragraph className="text-gray-500 text-center mt-6">
                  No earnings data available yet.
                </Paragraph>
              )}
            </Card>
          </Col>
        </Row>

        {/* Payout History */}
        <Card title="Payout History" className="shadow-md rounded-xl mt-6">
          {payouts.length > 0 ? (
            <Table
              columns={columns}
              dataSource={payouts.map((p, i) => ({ key: i, ...p }))}
              pagination={false}
            />
          ) : (
            <Paragraph className="text-gray-500 text-center my-6">
              <CalendarOutlined /> No payout history yet.
            </Paragraph>
          )}
        </Card>
      </div>
    </main>
  );
}
