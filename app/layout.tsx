import '../global.d.ts'; // ✅ Force-load three.js + fiber type definitions
import './globals.css';
// moved i18n init into ClientLayout (client-only)
import Navbar from '../components/Navbar';
import { UserProvider } from '@/context/UserContext';
import ClientLayout from './ClientLayout'; // 👈 import the new wrapper

export const metadata = {
  title: 'WAIS ARCHITECTURE PLATFORM',
  description:
    'Architectural consultation, design delivery, and project execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bgPage text-textPrimary antialiased">
        <UserProvider>
          <ClientLayout>
            <Navbar />
            <div className="pt-[72px]">{children}</div>
          </ClientLayout>
        </UserProvider>
      </body>
    </html>
  );
}
