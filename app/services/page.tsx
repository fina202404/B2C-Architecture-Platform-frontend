"use client";
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  const services = [
    {
      title: 'Residential Concept',
      desc: 'Concept design, mood boards, and space planning for your home.',
      price: 500,
      tag: '7 days',
    },
    {
      title: 'Permit Package',
      desc: 'Drawings and documents for city permit submission.',
      price: 1500,
      tag: '3 weeks',
    },
    {
      title: 'Interior Package',
      desc: 'Materials, lighting, and furniture layout with 2 revisions.',
      price: 1200,
      tag: '2 weeks',
    },
    {
      title: 'Commercial Fit‑Out',
      desc: 'Functional layouts with brand integration and code compliance.',
      price: 2400,
      tag: '4 weeks',
    },
    {
      title: 'Site Consultation',
      desc: 'On‑site survey and feasibility report with recommendations.',
      price: 300,
      tag: '48 hours',
    },
  ];

  return (
    <main className="px-6 py-16 max-w-[1200px] mx-auto text-textPrimary bg-bgPage">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">{t('pages.services.title')}</h1>
      <p className="text-sm text-textSecondary leading-relaxed mb-8">{t('pages.services.subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-bgSectionDark border border-borderSoft rounded-xl shadow-card p-5 flex flex-col justify-between"
          >
            <div>
              <div className="text-accentGold text-xs uppercase tracking-wide mb-2">{s.tag}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-textSecondary text-sm">{s.desc}</p>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="text-accentGold font-semibold">¥{s.price.toLocaleString()}</div>
              <a href="/dashboard/client/chat" className="px-3 py-2 bg-accentGold text-black text-xs font-semibold rounded hover:opacity-90">
                {t('pages.services.chatBook')}
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
