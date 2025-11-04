'use client';

import React, { useEffect, useState } from 'react';
import ChatBox from '@/components/chat/ChatBox';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { api } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { Select, Empty } from 'antd';

export default function ArchitectChatPage() {
  const { user, token, loading } = useAuthGuard('architect');
  const params = useSearchParams();
  const [projectId, setProjectId] = useState<string | null>(params.get('projectId'));
  const [projects, setProjects] = useState<Array<{ _id: string; title: string }>>([]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await api.get('/projects', { headers: { Authorization: `Bearer ${token}` } });
        const list = res.data?.data || res.data || [];
        setProjects(list);
        if (!projectId && list[0]?._id) setProjectId(list[0]._id);
      } catch {
        setProjects([]);
      }
    })();
  }, [token]);

  if (loading || !token) return null;
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-8 text-textPrimary">
      <div className="mb-4">
        <Select
          value={projectId || undefined}
          placeholder="Select a project"
          className="min-w-[260px]"
          onChange={(v) => setProjectId(v)}
          options={projects.map((p: any) => ({ value: p._id, label: p.title }))}
        />
      </div>
      {projectId ? (
        <ChatBox projectId={projectId} role="architect" token={token} />
      ) : (
        <div className="bg-bgSectionDark border border-borderSoft rounded-xl shadow-card p-12 text-center">
          <Empty description="No projects yet. Create or ask admin to assign one." />
        </div>
      )}
    </main>
  );
}
