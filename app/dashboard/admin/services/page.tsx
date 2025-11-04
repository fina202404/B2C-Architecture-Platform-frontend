'use client';

import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { adminGetServices, adminSaveService } from '@/lib/api';
import { message } from 'antd';

type Service = {
  id?: string;
  name: string;
  description: string;
  price: number;
};

export default function AdminServicesPage() {
  const user = useAuthGuard('admin');
  const [services, setServices] = useState<Service[]>([]);
  const [draft, setDraft] = useState<Service>({
    name: '',
    description: '',
    price: 0,
  });

  async function loadServices() {
    try {
      const token = localStorage.getItem('token') || '';
      const data = await adminGetServices(token);
      setServices(data);
    } catch {
      // swallow for now
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      await adminSaveService(token, draft);
      message.success('Service saved.');
      setDraft({ name: '', description: '', price: 0 });
      await loadServices();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || 'Error saving service.'
      );
    }
  }

  if (!user) return null;

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold">Service Catalog</h1>
      <p className="text-sm text-gray-600 max-w-xl">
        Manage architectural services offered on the platform:
        permit submission, feasibility studies, interior design,
        urban design advisory, etc.
      </p>

      {/* Add / Edit service */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4 max-w-xl"
      >
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Service Name
          </label>
          <input
            className="w-full border rounded p-3 text-sm"
            placeholder="Interior Design Consultation"
            value={draft.name}
            onChange={(e) =>
              setDraft({ ...draft, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full border rounded p-3 text-sm min-h-[80px]"
            placeholder="Describe what’s included, timeline, deliverables…"
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Base Price (USD)
          </label>
          <input
            className="w-full border rounded p-3 text-sm"
            type="number"
            min={0}
            value={draft.price}
            onChange={(e) =>
              setDraft({
                ...draft,
                price: Number(e.target.value),
              })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-5 py-3 rounded text-sm font-semibold hover:bg-gray-900"
        >
          Save Service
        </button>
      </form>

      {/* Services table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {services.map((s) => (
              <tr key={s.id || s.name}>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">
                  {s.description}
                </td>
                <td className="px-4 py-3">${s.price}</td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-gray-400 text-xs"
                >
                  No services defined.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
