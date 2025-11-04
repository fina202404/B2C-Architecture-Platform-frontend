'use client';

import React from 'react';
import ChatBox from '@/components/chat/ChatBox';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ClientChatPage() {
  const { user, token, loading } = useAuthGuard('client');
  if (loading || !token) return null;
  const conversationId = 'client-lobby';
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-8">
      <ChatBox conversationId={conversationId} role="client" token={token} />
    </main>
  );
}

