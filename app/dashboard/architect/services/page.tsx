'use client';

import React from 'react';

export default function ArchitectServicesPage() {
  const services = [
    { title: 'Residential Concept', tag: '7 days', price: 500, desc: 'Concept design and mood boards.' },
    { title: 'Permit Package', tag: '3 weeks', price: 1500, desc: 'Drawings for permit submission.' },
    { title: 'Interior Package', tag: '2 weeks', price: 1200, desc: 'Materials, lighting, FF&E layout.' },
    { title: 'Commercial Fit‑Out', tag: '4 weeks', price: 2400, desc: 'Layout + brand integration.' },
    { title: 'Site Consultation', tag: '48 hours', price: 300, desc: 'On‑site survey and report.' },
  ];

  return (
    <main className="min-h-screen bg-bgPage px-6 py-10 text-textPrimary">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Services</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-bgSectionDark border border-borderSoft rounded-xl shadow-card p-5">
              <div className="text-accentGold text-xs uppercase tracking-wide mb-1">{s.tag}</div>
              <div className="text-lg font-semibold">{s.title}</div>
              <div className="text-textSecondary text-sm mt-1">{s.desc}</div>
              <div className="flex items-center justify-between mt-5">
                <div className="text-accentGold font-semibold">¥{s.price.toLocaleString()}</div>
                <a href="/dashboard/client/chat" className="px-3 py-2 bg-accentGold text-black text-xs font-semibold rounded hover:opacity-90">Chat</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

