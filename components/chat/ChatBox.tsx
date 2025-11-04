'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, List, Typography } from 'antd';
import { ChatMessage, fetchConversation, sendMessage } from '@/lib/chat';

const { Text } = Typography;

export default function ChatBox({
  conversationId,
  role,
  token,
}: {
  conversationId: string;
  role: 'client' | 'architect' | 'admin';
  token: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any;
    async function load() {
      try {
        const res = await fetchConversation(conversationId, token);
        if (res?.data) setMessages(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
    // simple polling while backend sockets not available
    timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [conversationId, token]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const submit = async () => {
    if (!text.trim()) return;
    const optimistic: ChatMessage = {
      id: 'temp-' + Date.now(),
      from: role,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setText('');
    try {
      const res = await sendMessage(conversationId, optimistic.text, token);
      if (res?.data) {
        setMessages((m) => m.map((x) => (x.id === optimistic.id ? res.data : x)));
      }
    } catch (e) {
      // rollback on error
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-surface border border-borderSoft rounded-xl2 shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-borderSoft text-textSecondary text-xs uppercase">
        Conversation
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-bgSectionDark">
        <List
          loading={loading}
          dataSource={messages}
          renderItem={(m) => (
            <div className={`flex ${m.from === role ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] p-2 rounded-md ${
                  m.from === role ? 'bg-accentGold text-black' : 'bg-surface text-white'
                }`}
              >
                <Text className="block text-xs opacity-70">{m.from}</Text>
                <div className="text-sm leading-snug">{m.text}</div>
              </div>
            </div>
          )}
        />
      </div>
      <div className="p-3 flex gap-2 border-t border-borderSoft">
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPressEnter={submit}
        />
        <Button type="primary" onClick={submit}>
          Send
        </Button>
      </div>
    </div>
  );
}

