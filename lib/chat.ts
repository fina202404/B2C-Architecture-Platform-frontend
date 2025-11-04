"use client";
import { api } from './api';

export type ChatMessage = {
  _id: string;
  projectId: string;
  senderId: { fullName?: string; email?: string; role?: string } | string;
  text: string;
  createdAt: string;
};

// Backend messages are scoped to a project: /projects/:projectId/messages
export async function fetchConversation(projectId: string, token: string) {
  const res = await api.get(`/projects/${projectId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as { success: boolean; data: ChatMessage[] };
}

export async function sendMessage(projectId: string, text: string, token: string) {
  const res = await api.post(
    `/projects/${projectId}/messages`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data as { success: boolean; data: ChatMessage };
}
