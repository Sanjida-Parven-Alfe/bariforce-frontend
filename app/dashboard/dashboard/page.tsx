"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId } from "@/lib/auth";
import api from "@/lib/axios";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(0);
  const [slotCount, setSlotCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const workerId = getWorkerId();
    if (!workerId) return;

    try {
      // Fetch earnings, availability slots, and bookings in parallel
      const [earningsRes, slotsRes, bookingsRes] = await Promise.all([
        api.get(`/worker/earnings/${workerId}`),
        api.get(`/worker/availability/schedule/${workerId}`),
        api.get(`/worker/bookings/${workerId}`),
      ]);

     setEarnings(Number(earningsRes.data.totalEarnings || 0));
      setSlotCount(slotsRes.data.slots?.length || 0);

      const bookings = bookingsRes.data || [];
      const pendingCount = bookings.filter(
        (booking: any) => booking.status === "pending"
      ).length;
      setPendingBookingsCount(pendingCount);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Worker Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Earnings Card */}
          <div className="border p-6 rounded shadow bg-white">
            <p className="text-lg text-gray-600">Total Earnings</p>
          <p className="text-3xl font-bold text-green-600">
            ${earnings.toFixed(2)}
          </p>
          </div>

          {/* Availability Slots Card */}
          <div className="border p-6 rounded shadow bg-white">
            <p className="text-lg text-gray-600">Your Availability Slots</p>
            <p className="text-3xl font-bold text-blue-600">{slotCount}</p>
            <Link
              href="/dashboard/availability"
              className="mt-3 inline-block text-sm text-blue-500 hover:underline"
            >
              Manage Slots →
            </Link>
          </div>

          {/* Pending Bookings Card */}
          <div className="border p-6 rounded shadow bg-white">
            <p className="text-lg text-gray-600">Pending Bookings</p>
            <p className="text-3xl font-bold text-orange-600">
              {pendingBookingsCount}
            </p>
            <Link
              href="/dashboard/bookings"
              className="mt-3 inline-block text-sm text-blue-500 hover:underline"
            >
              View Bookings →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}