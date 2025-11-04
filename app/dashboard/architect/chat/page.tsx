'use client';

import React from 'react';
import ChatBox from '@/components/chat/ChatBox';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ArchitectChatPage() {
  const { user, token, loading } = useAuthGuard('architect');
  if (loading || !token) return null;
  const conversationId = 'architect-lobby';
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-8">
      <ChatBox conversationId={conversationId} role="architect" token={token} />
    </main>
  );
}

