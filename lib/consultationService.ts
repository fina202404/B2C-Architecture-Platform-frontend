// frontend/lib/consultationService.ts
import { API_BASE } from './api';

/**
 * 📅 Client: Book a consultation
 */
export async function bookConsultation(payload: any, token: string) {
  const res = await fetch(`${API_BASE}/consultations/client/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

/**
 * 👤 Client: Fetch all consultations for a logged-in client
 */
export async function getMyConsultations(token: string) {
  const res = await fetch(`${API_BASE}/consultations/client`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

/**
 * 🧠 Architect: Fetch consultations assigned to the logged-in architect
 */
export async function fetchArchitectConsultations(architectId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/consultations/architect/${architectId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch consultations');
    return data;
  } catch (err: any) {
    console.error('❌ fetchArchitectConsultations error:', err);
    throw err;
  }
}

/**
 * 🔄 Architect/Admin: Update consultation status
 */
export async function updateConsultationStatus(
  consultationId: string,
  status: string,
  token: string
) {
  const res = await fetch(`${API_BASE}/consultations/${consultationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return await res.json();
}
