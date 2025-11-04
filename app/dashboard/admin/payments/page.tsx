'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { adminGetFinancials } from '@/lib/api';

type Invoice = {
  id: string;
  clientName: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded' | 'escrow';
};

export default function AdminPaymentsPage() {
  const user = useAuthGuard('admin');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<{
    totalRevenue?: number;
    pendingPayouts?: number;
    activeSubscriptions?: number;
  }>({});

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await adminGetFinancials(token);
        // expected shape, example:
        // {
        //   summary: { totalRevenue, pendingPayouts, activeSubscriptions },
        //   invoices: [{id, clientName, amount, status}, ...]
        // }
        setSummary(data.summary || {});
        setInvoices(data.invoices || []);
      } catch {
        // do nothing for now
      }
    }
    load();
  }, []);

  if (!user) return null;

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold">Payments & Invoices</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-gray-500 uppercase">
            Total Revenue
          </div>
          <div className="text-2xl font-semibold">
            {summary.totalRevenue ? `$${summary.totalRevenue}` : '—'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-gray-500 uppercase">
            Pending Payouts
          </div>
          <div className="text-2xl font-semibold">
            {summary.pendingPayouts ? `$${summary.pendingPayouts}` : '—'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-gray-500 uppercase">
            Active Subscriptions
          </div>
          <div className="text-2xl font-semibold">
            {summary.activeSubscriptions ?? '—'}
          </div>
        </div>
      </div>

      {/* Invoice table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-3">{inv.id}</td>
                <td className="px-4 py-3">{inv.clientName}</td>
                <td className="px-4 py-3">${inv.amount}</td>
                <td className="px-4 py-3 capitalize">
                  {inv.status}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-gray-400 text-xs"
                >
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
