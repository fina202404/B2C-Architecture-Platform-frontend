'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);

  // 🧠 Load user from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  // 🧾 Logout
  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  // 🧭 Define tabs dynamically (no hard reload)
  const tabs = [
    { name: 'Overview', href: '/dashboard/architect' },
    { name: 'Projects', href: '/dashboard/architect/projects' },
    { name: 'Consultations', href: '/dashboard/architect/consultations' },
    { name: 'Earnings', href: '/dashboard/architect/earnings' },
    { name: 'Clients', href: '/dashboard/architect/clients' },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <span onClick={() => router.push('/dashboard/architect')}>Profile</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" danger onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="w-full bg-black text-white border-b border-gray-700 flex justify-between items-center px-8 py-4">
      {/* Left side: brand */}
      <div className="text-lg font-semibold tracking-wide">
        WAIS ARCHITECTURE PLATFORM
      </div>

      {/* Center: nav tabs */}
      <nav className="flex gap-6 text-sm">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`${
              pathname === tab.href
                ? 'text-yellow-400 font-semibold'
                : 'text-gray-300 hover:text-yellow-300'
            } transition-colors`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>

      {/* Right side: profile */}
      <div className="flex items-center gap-3">
        {user && (
          <Dropdown overlay={menu} trigger={['click']}>
            <button className="bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Hi, {user.fullName || 'Architect'} <DownOutlined />
            </button>
          </Dropdown>
        )}
      </div>
    </header>
  );
}
