'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { adminGetTickets } from '@/lib/api';

type Ticket = {
  id: string;
  fromUser: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
};

export default function AdminTicketsPage() {
  const user = useAuthGuard('admin');
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token') || '';
      try {
        const data = await adminGetTickets(token);
        // expected: [{id, fromUser, subject, status}]
        setTickets(data);
      } catch {
        // ignore error
      }
    }
    load();
  }, []);

  if (!user) return null;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Support Tickets</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket ID</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {tickets.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3">{t.id}</td>
                <td className="px-4 py-3">{t.fromUser}</td>
                <td className="px-4 py-3">{t.subject}</td>
                <td className="px-4 py-3 capitalize">{t.status}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-gray-400 text-xs"
                >
                  No tickets.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
