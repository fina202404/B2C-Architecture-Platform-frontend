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
    <div className="min-h-screen flex bg-bgPage text-textPrimary">
      {/* SIDEBAR */}
      <aside className="w-64 bg-surface border-r border-borderSoft shadow-card flex flex-col">
        <div className="px-6 py-5 border-b border-borderSoft">
          <div className="text-xs text-textSecondary uppercase tracking-wide">
            WAIS Admin
          </div>
          <div className="text-sm font-semibold text-textPrimary">Admin Console</div>
        </div>

        <nav className="flex-1 px-4 py-6 text-sm space-y-1">
          <Link
            href="/dashboard/admin"
            className="block px-3 py-2 rounded hover:bg-bgSectionDark"
          >
            Overview / KPIs
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="block px-3 py-2 rounded hover:bg-bgSectionDark"
          >
            Users & Roles
          </Link>
          <Link
            href="/dashboard/admin/services"
            className="block px-3 py-2 rounded hover:bg-bgSectionDark"
          >
            Service Catalog
          </Link>
          <Link
            href="/dashboard/admin/payments"
            className="block px-3 py-2 rounded hover:bg-bgSectionDark"
          >
            Payments & Invoices
          </Link>
          <Link
            href="/dashboard/admin/reports"
            className="block px-3 py-2 rounded hover:bg-bgSectionDark"
          >
            Analytics / Reports
          </Link>
          <Link
            href="/dashboard/admin/tickets"
            className="block px-3 py-2 rounded hover:bg-bgSectionDark"
          >
            Support Tickets
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-borderSoft text-xs">
          <div className="mb-2 text-textSecondary">
            {/* safely handle undefined fields */}
            {user?.name || user?.fullName || 'Admin'} <br />
            <span className="text-textSecondary">{user?.email || ''}</span>
          </div>
          <button
            onClick={logout}
            className="w-full bg-accentGold text-black text-xs font-semibold py-2 rounded hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <div className="bg-bgSectionDark border border-borderSoft rounded-xl shadow-card p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
