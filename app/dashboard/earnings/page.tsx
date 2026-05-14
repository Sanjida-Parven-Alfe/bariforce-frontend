"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId } from "@/lib/auth";
import api from "@/lib/axios";

interface Earning {
  id: number;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: string;
  paidAt?: string;
}

export default function EarningsPage() {
  const router = useRouter();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      const res = await api.get(`/worker/earnings/detailed/${workerId}`);
      setEarnings(res.data.earnings);
      setTotal(Number(res.data.total) || 0);
    } catch (err) {
      setError("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div>Loading earnings...</div></DashboardLayout  >;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Earnings</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <div className="bg-green-50 p-4 rounded mb-6">
          <p className="text-lg font-semibold">Total Earnings: ${total.toFixed(2)}</p>
        </div>
        <div className="space-y-2">
          {earnings.map((earning) => (
            <div key={earning.id} className="border p-4 rounded bg-white">
              <p>Amount: ${earning.amount} | Net: ${earning.netAmount}</p>
              <p>Platform fee: ${earning.platformFee} | Status: {earning.status}</p>
            </div>
          ))}
          {earnings.length === 0 && <p>No earnings recorded yet.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}