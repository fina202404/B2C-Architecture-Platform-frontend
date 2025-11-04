import axios, { AxiosRequestConfig } from 'axios';

// ================================
// 🌐 Base Configuration (Fixed)
// ================================
const base =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') ||
  'http://localhost:5000';

export const API_BASE = `${base}/api`; // ✅ one clean /api prefix

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ================================
// 🔐 AUTHENTICATION
// ================================
export const registerClient = async (payload: {
  name: string;
  email: string;
  password: string;
  clientType: 'private' | 'corporate' | 'public';
}) => {
  const res = await api.post('/auth/register', {
    fullName: payload.name,
    email: payload.email,
    password: payload.password,
    profileType: payload.clientType,
  });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const getMe = async (token: string) => {
  const res = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ================================
// 👤 FETCH CURRENT USER (for AuthGuard)
// ================================
export const fetchCurrentUser = async (token: string) => {
  try {
    const res = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('❌ fetchCurrentUser error:', error?.response?.data || error);
    throw error;
  }
};

// ================================
// 🧭 ADMIN ENDPOINTS
// ================================
export const adminGetUsers = async (token: string) => {
  const res = await api.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const adminGetServices = async (token: string) => {
  const res = await api.get('/admin/services', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const adminSaveService = async (
  token: string,
  payload: { name: string; description: string; price: number }
) => {
  const res = await api.post('/admin/services', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const adminGetFinancials = async (token: string) => {
  const res = await api.get('/admin/financials', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const adminGetReports = async (token: string) => {
  const res = await api.get('/admin/reports', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const adminGetTickets = async (token: string) => {
  const res = await api.get('/admin/tickets', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ================================
// 🌍 UNIVERSAL FETCH HELPER (for dashboards)
// ================================
export const fetchWithToken = async (
  endpoint: string,
  options: AxiosRequestConfig = {},
  tokenOverride?: string
) => {
  try {
    // ✅ Use access or refresh token
    const token =
      tokenOverride ||
      localStorage.getItem('token') ||
      localStorage.getItem('refreshToken');

    // ✅ Clean and normalize the endpoint
    let cleanEndpoint = endpoint.replace(/^\/api/, ''); // remove leading /api if present
    if (cleanEndpoint.startsWith('/')) cleanEndpoint = cleanEndpoint.slice(1);

    const res = await api({
      url: '/' + cleanEndpoint,
      method: options.method || 'GET',
      data:
        (options as any).data ||
        (options as any).body ||
        undefined,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error?.response || error);

    // ✅ Handle unauthorized sessions
    if (error?.response?.status === 401) {
      [
        'token',
        'refreshToken',
        'role',
        'email',
        'fullName',
        'user',
      ].forEach((k) => localStorage.removeItem(k));

      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Request failed';

    throw new Error(message);
  }
};
