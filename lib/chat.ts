"use client";
import { api } from './api';

export type ChatMessage = {
  id: string;
  from: 'client' | 'architect' | 'admin';
  text: string;
  createdAt: string;
};

export async function fetchConversation(conversationId: string, token: string) {
  const res = await api.get(`/chat/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as { success: boolean; data: ChatMessage[] };
}

export async function sendMessage(
  conversationId: string,
  text: string,
  token: string
) {
  const res = await api.post(
    `/chat/${conversationId}`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data as { success: boolean; data: ChatMessage };
}

