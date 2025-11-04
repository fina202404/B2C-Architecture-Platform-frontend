'use client';

import Link from 'next/link';
import { useAuthGuard, logout } from '@/hooks/useAuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // if useAuthGuard returns an object with { user, loading } etc., destructure accordingly
  const auth = useAuthGuard('admin');
  const user: any = (auth as any)?.user || auth; // ensures backward compatibility

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            WAIS Admin
          </div>
          <div className="text-sm font-semibold">Admin Console</div>
        </div>

        <nav className="flex-1 px-4 py-6 text-sm space-y-1">
          <Link
            href="/dashboard/admin"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Overview / KPIs
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Users & Roles
          </Link>
          <Link
            href="/dashboard/admin/services"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Service Catalog
          </Link>
          <Link
            href="/dashboard/admin/payments"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Payments & Invoices
          </Link>
          <Link
            href="/dashboard/admin/reports"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Analytics / Reports
          </Link>
          <Link
            href="/dashboard/admin/tickets"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Support Tickets
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-gray-200 text-xs">
          <div className="mb-2 text-gray-600">
            {/* safely handle undefined fields */}
            {user?.name || user?.fullName || 'Admin'} <br />
            <span className="text-gray-400">{user?.email || ''}</span>
          </div>
          <button
            onClick={logout}
            className="w-full bg-black text-white text-xs font-semibold py-2 rounded hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
