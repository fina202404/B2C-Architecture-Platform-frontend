'use client';

import React from 'react';
import ChatBox from '@/components/chat/ChatBox';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function AdminChatPage() {
  const { user, token, loading } = useAuthGuard('admin');
  if (loading || !token) return null;
  // In real usage, conversationId comes from route or selection
  const conversationId = 'admin-lobby';
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-8">
      <ChatBox conversationId={conversationId} role="admin" token={token} />
    </main>
  );
}

