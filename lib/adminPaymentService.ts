"use client";
import { api } from './api';

// 🔹 Fetch all payments
export const fetchPayments = async (token: string) => {
  const res = await api.get('/admin/payments', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔹 Fetch summary (total revenue, success count, failed count)
export const fetchPaymentSummary = async (token: string) => {
  const res = await api.get('/admin/payments/summary', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
