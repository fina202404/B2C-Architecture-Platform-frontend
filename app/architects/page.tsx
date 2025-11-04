'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Rate, Spin, Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

export default function ArchitectsPage() {
  const [architects, setArchitects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/architect/public/all');
        const data = await res.json();
        if (data.success) {
          setArchitects(data.data);
        }
      } catch (err) {
        console.error('Error fetching architects:', err);
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
        <Title level={2} className="text-accentGold mb-10">
          Meet Our Architects
        </Title>

        <Row gutter={[32, 32]}>
          {architects.length > 0 ? (
            architects.map((a) => (
              <Col xs={24} sm={12} lg={8} key={a.id}>
                <Card
                  hoverable
                  className="bg-bgSectionDark border border-borderSoft rounded-xl text-center shadow-card transition-all"
                  cover={
                    <Image
                      src={
                        a.photo
                          ? `http://localhost:5000${a.photo}`
                          : '/default-avatar.png'
                      }
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

                    <Link href={`/architects/${a.id}`}>
                      <Button type="primary" shape="round" size="small">
                        View Portfolio
                      </Button>
                    </Link>
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
