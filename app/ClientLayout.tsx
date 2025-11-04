'use client';

import { ConfigProvider, theme as antdTheme, App } from 'antd';
import type { ThemeConfig } from 'antd';
import '../i18n/init'; // initialize i18n on the client boundary

const waisTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    // ✨ Main palette (luxury dark gold theme)
    colorPrimary: '#C6A664',          // gold accent
    colorBgBase: '#1b1b1b',           // softened dark background
    colorBgContainer: '#252525',      // lighter surface for cards/sections
    colorTextBase: '#FFFFFF',
    colorTextSecondary: '#C0C0C0',    // slightly brighter for readability
    colorBorder: '#3a3a3a',           // more visible border
    colorLink: '#C6A664',
    colorLinkHover: '#E6C984',
    fontFamily: 'Inter, sans-serif',
    borderRadius: 4,
  },
  components: {
    Button: {
      colorBgContainer: '#C6A664',
      colorText: '#000000',
      colorBgTextHover: '#E6C984',
      borderRadius: 0,
      controlHeight: 42,
    },
    Card: {
      colorBgContainer: '#252525', // matches new bgContainer tone
      borderRadiusLG: 8,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    Menu: {
      colorBgContainer: '#1b1b1b',   // unified with overall theme
      colorItemText: '#FFFFFF',
      colorItemTextHover: '#E6C984',
    },
  },
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider theme={waisTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
