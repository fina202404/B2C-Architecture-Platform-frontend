'use client';

import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { Button, Card, Row, Col, Typography, Rate, Spin } from 'antd';
import Footer from '../components/Footer';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';

const { Title, Paragraph, Text } = Typography;
const ThreeHero = dynamic(() => import('../components/ThreeHero'), { ssr: false });

// =============================
// 👥 Dynamic Architect Team Section
// =============================
function DynamicArchitectTeam() {
  const [architects, setArchitects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const FILE_BASE = API_BASE.replace(/\/api$/, '');

  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        const res = await fetch(`${API_BASE}/architect/public/all`);
        const data = await res.json();
        if (data.success) {
          // Display only the first 2 architects (for homepage preview)
          setArchitects(data.data.slice(0, 2));
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
      <div className="flex justify-center items-center h-40">
        <Spin />
      </div>
    );

  return (
    <Row gutter={[24, 24]}>
      {architects.map((member, i) => (
        <Col xs={24} sm={12} key={i}>
          <Card
            hoverable
            className="bg-bgSectionDark border border-borderSoft rounded-xl text-center shadow-card"
            cover={
              <Image
                src={
                  member.photo
                    ? `${FILE_BASE}${member.photo}`
                    : '/default-avatar.png'
                }
                alt={member.name}
                width={400}
                height={250}
                className="object-cover h-52 w-full rounded-t-xl"
              />
            }
          >
            <div className="text-center">
              <Text strong className="block text-base">
                {member.name}
              </Text>
              <Text className="text-[11px] text-gray-400 uppercase tracking-wide">
                Architect
              </Text>
              <div className="mt-2">
                <Rate disabled defaultValue={member.rating || 5} />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

// =============================
// 🏠 Main Home Page Component
// =============================
export default function HomePage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="flex flex-col min-h-screen bg-bgPage text-textPrimary">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-28 pb-20 text-white overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://cdn.pixabay.com/photo/2016/11/29/02/05/architecture-1867426_1280.jpg')",
          }}
        />
        <div className="mx-auto w-full max-w-[1400px] px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Title
              level={1}
              className="!text-white !leading-[1.1] !uppercase drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
            >
              <div>{mounted ? t('hero.headline_top') : ' '}</div>
              <div>{mounted ? t('hero.headline_bottom') : ' '}</div>
            </Title>
            <Paragraph className="!text-white/80 max-w-md text-[15px] leading-relaxed">
              {mounted ? t('hero.subtext') : ' '}
            </Paragraph>

            <Row gutter={16}>
              <Col>
                <Link href="/services">
                  <Button type="primary" size="large">
                    {t('hero.cta_start')}
                  </Button>
                </Link>
              </Col>
              <Col>
                <Link href="/contact">
                  <Button size="large" ghost>
                    {t('hero.cta_book')}
                  </Button>
                </Link>
              </Col>
            </Row>
          </div>

          <div className="flex flex-col gap-4">
            <ThreeHero />
            <Text className="text-[11px] text-white/60 uppercase tracking-wide text-center">
              Interactive concept preview  Erotate, zoom, explore
            </Text>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-24">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={10}>
            <div className="space-y-5">
              <Text className="uppercase text-[12px] text-accentGold tracking-wider font-semibold">
                / {t('servicesSection.title')}
              </Text>
              <Title level={2} className="!text-white leading-[1.2]">
                Residential, Commercial, Interior, Compliance
              </Title>
              <Paragraph className="!text-gray-400 leading-relaxed">
                We connect clients with licensed architects and deliver transparent milestones,
                proposals, cost guidance, permitting support, and construction-ready detail  Eall managed in one platform.
              </Paragraph>
              <Button type="primary" shape="round">
                {t('servicesSection.viewAll')}
              </Button>
            </div>
          </Col>

          <Col xs={24} lg={14}>
            <Row gutter={[24, 24]}>
              {[
                {
                  title: 'Residential Design',
                  desc: 'Full concept-to-delivery service for private homes and renovations.',
                  bg: 'white',
                  text: 'dark',
                },
                {
                  title: 'Restaurant Design',
                  desc: 'Functional layouts, brand experience, code compliance.',
                  bg: "url('/service-restaurant.jpg')",
                  text: 'light',
                },
                {
                  title: 'Corporate / Commercial',
                  desc: 'Intelligent spatial planning, productivity-driven interior strategy.',
                  bg: 'white',
                  text: 'dark',
                },
                {
                  title: 'Permit & Compliance',
                  desc: 'Regulations, documents, submittals, city approvals  Ehandled.',
                  bg: 'white',
                  text: 'dark',
                },
              ].map((service, i) => (
                <Col xs={24} sm={12} key={i}>
                  <Card
                    hoverable
                    className={`transition-all duration-300 ${
                      service.bg.startsWith('url')
                        ? 'text-white relative overflow-hidden'
                        : 'text-textPrimary'
                    }`}
                    style={
                      service.bg.startsWith('url')
                        ? {
                            backgroundImage: service.bg,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: 200,
                          }
                        : {}
                    }
                    cover={
                      service.bg.startsWith('url') ? (
                        <div className="absolute inset-0 bg-black/60" />
                      ) : undefined
                    }
                  >
                    <div className="relative">
                      <Text
                        className={`uppercase text-[11px] font-semibold tracking-wide ${
                          service.text === 'light' ? 'text-accentGold' : 'text-accentGold/90'
                        }`}
                      >
                        {service.title}
                      </Text>
                      <Title level={4} className="!mt-1 !mb-1 !text-lg">
                        {service.text === 'light'
                          ? 'Experience & Flow'
                          : service.title.includes('Commercial')
                          ? 'Future-ready Workplaces'
                          : service.title.includes('Compliance')
                          ? 'No Surprises'
                          : 'Your Space, Tailored'}
                      </Title>
                      <Paragraph
                        className={`text-xs leading-relaxed ${
                          service.text === 'light' ? 'text-white/80' : 'text-gray-400'
                        }`}
                      >
                        {service.desc}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <section className="mx-auto w-full max-w-[1400px] px-6 pb-24">
        <Row gutter={[40, 40]} align="top">
          <Col xs={24} lg={10}>
            <Text className="uppercase text-[12px] text-accentGold tracking-wider font-semibold">
              Meet Our Team
            </Text>
            <Title level={2} className="!text-white leading-[1.2] mt-3">
              Architects, interior designers, project managers
            </Title>
            <Paragraph className="!text-gray-400">
              Get matched with specialists based on style, budget, timeline, and project type.
            </Paragraph>
            <Button
              ghost
              size="large"
              onClick={() => (window.location.href = '/architects')}
            >
              View All Architects
            </Button>
          </Col>

          <Col xs={24} lg={14}>
            <DynamicArchitectTeam />
          </Col>
        </Row>
      </section>

      <Footer />
    </main>
  );
}


