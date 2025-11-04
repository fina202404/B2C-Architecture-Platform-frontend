'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Rate, Spin, Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

export default function ArchitectsPage() {
  const { t } = useTranslation();
  const [architects, setArchitects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        const res = await fetch(`${API_BASE}/architect/public/all`);
        const data = await res.json();
        if (data.success) {
          setArchitects(data.data);
        }
      } catch (err) {
        console.error('Error fetching architects:', err);
        setArchitects([
          { id: 'head-1', name: 'A. Rahman', rating: 5, bio: 'Senior design lead with 12+ years experience.' },
          { id: 'head-2', name: 'C. Nguyen', rating: 5, bio: 'Urban and interiors specialist.' },
          { id: 'head-3', name: 'M. Haddad', rating: 5, bio: 'Sustainability and passive design expert.' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchArchitects();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading architects..." />
      </div>
    );

  return (
    <main className="min-h-screen bg-bgPage text-textPrimary px-8 py-16">
      <div className="max-w-[1300px] mx-auto">
        <Title level={2} className="text-accentGold mb-10">{t('pages.architects.title')}</Title>

        <Row gutter={[32, 32]}>
          {architects.length > 0 ? (
            architects.map((a) => (
              <Col xs={24} sm={12} lg={8} key={a.id}>
                <Card
                  hoverable
                  className="bg-bgSectionDark border border-borderSoft rounded-xl text-center shadow-card transition-all"
                  cover={
                    <Image
                      src={a.photo ? `${API_BASE.replace(/\/api$/, '')}${a.photo}` : '/default-avatar.png'}
                      alt={a.name}
                      width={400}
                      height={250}
                      className="object-cover h-52 w-full rounded-t-xl"
                    />
                  }
                >
                  <div className="text-center space-y-2">
                    <Text strong className="block text-base">
                      {a.name}
                    </Text>
                    <Text className="text-[11px] text-gray-400 uppercase tracking-wide">
                      Architect
                    </Text>
                    <div className="mt-2">
                      <Rate disabled defaultValue={a.rating || 5} />
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      className="!text-gray-400 text-sm mt-2"
                    >
                      {a.bio || 'Experienced professional ready to bring your vision to life.'}
                    </Paragraph>

                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/architects/${a.id}`}>
                        <Button type="primary" shape="round" size="small">{t('pages.architects.viewPortfolio')}</Button>
                      </Link>
                      <Link href="/dashboard/client/chat">
                        <Button size="small" ghost>
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Text className="text-gray-400">No architects available yet.</Text>
            </Col>
          )}
        </Row>
      </div>
    </main>
  );
}
