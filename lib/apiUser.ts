import { API_BASE } from './api';

export async function fetchCurrentUser(token: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch user');
    return data.data; // returns user object
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}
