"use client";
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  const projects = [
    {
      id: 'demo-1',
      title: 'Modern Courtyard House',
      desc: 'Single‑story L‑shape with inner garden and warm wood palette.',
      location: 'West End',
      status: 'Pending Approval',
      img: '/hero-placeholder.jpg',
    },
    {
      id: 'demo-2',
      title: 'Restaurant Fit‑Out',
      desc: '90‑seat layout, open kitchen pass, acoustic treatment.',
      location: 'City Center',
      status: 'In Progress',
      img: '/service-restaurant.jpg',
    },
    {
      id: 'demo-3',
      title: 'Apartment Renovation',
      desc: 'Compact plan optimization, storage wall and daylight strategy.',
      location: 'Harbor District',
      status: 'Completed',
      img: '/team-1.jpg',
    },
    {
      id: 'demo-4',
      title: 'Office Concept',
      desc: 'Collaboration hubs, focus pods, and material sample library.',
      location: 'Tech Park',
      status: 'Ongoing',
      img: '/team-2.jpg',
    },
    {
      id: 'demo-5',
      title: 'Retail Flagship',
      desc: 'Entry sequence, VM zones, fixture family and lighting scenes.',
      location: 'High Street',
      status: 'Proposal Pending',
      img: '/hero-placeholder.jpg',
    },
  ];

  return (
    <main className="px-6 py-16 max-w-[1200px] mx-auto text-textPrimary bg-bgPage">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">{t('pages.projects.title')}</h1>
      <p className="text-sm text-textSecondary leading-relaxed mb-8">{t('pages.projects.subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-bgSectionDark border border-borderSoft rounded-xl shadow-card overflow-hidden">
            <img src={p.img} alt={p.title} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-2">
              <div className="text-xs text-accentGold uppercase tracking-wide">{p.status}</div>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-textSecondary text-sm">{p.desc}</p>
              <div className="text-textSecondary text-xs">{p.location}</div>
              <div className="flex items-center justify-between pt-2">
                <a href={`/dashboard/projects/${p.id}`} className="text-accentGold text-xs hover:opacity-90">{t('pages.projects.viewDetails')}</a>
                <a href={`/dashboard/client/chat`} className="px-3 py-1.5 bg-accentGold text-black text-xs font-semibold rounded hover:opacity-90">{t('pages.projects.chat')}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
