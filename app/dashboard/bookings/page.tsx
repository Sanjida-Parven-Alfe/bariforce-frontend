"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId } from "@/lib/auth";
import api from "@/lib/axios";

interface Booking {
  id: number;
  customerId: number;
  serviceId: number;
  scheduledAt: string;
  price: number;
  status: string;
  workerId: number;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      const res = await api.get(`/worker/bookings/${workerId}`);
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId: number, action: string) => {
    setActionLoading(bookingId);
    let endpoint = "";
    switch (action) {
      case "accept": endpoint = `/worker/accept-booking/${bookingId}`; break;
      case "reject": endpoint = `/worker/reject-booking/${bookingId}`; break;
      case "start": endpoint = `/worker/start-job/${bookingId}`; break;
      case "end": endpoint = `/worker/end-job/${bookingId}`; break;
      default: return;
    }
    try {
      await api.put(endpoint);
      await fetchBookings();
    } catch (err) {
      setError(`Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <DashboardLayout><div>Loading bookings...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {bookings.length === 0 && !error && <p className="text-gray-500">No bookings found.</p>}
        {bookings.map((booking) => (
          <div key={booking.id} className="border p-4 rounded shadow-sm mb-4 bg-white">
            <p><strong>Booking #{booking.id}</strong> – Status: {booking.status}</p>
            <p>Service ID: {booking.serviceId} | Price: ${booking.price}</p>
            <p>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
            <div className="mt-2 flex gap-2">
              {booking.status === "pending" && (
                <>
                  <button onClick={() => handleAction(booking.id, "accept")} disabled={actionLoading === booking.id} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
                  <button onClick={() => handleAction(booking.id, "reject")} disabled={actionLoading === booking.id} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                </>
              )}
              {booking.status === "accepted" && (
                <button onClick={() => handleAction(booking.id, "start")} disabled={actionLoading === booking.id} className="bg-blue-600 text-white px-3 py-1 rounded">Start Job</button>
              )}
              {booking.status === "started" && (
                <button onClick={() => handleAction(booking.id, "end")} disabled={actionLoading === booking.id} className="bg-purple-600 text-white px-3 py-1 rounded">End Job</button>
              )}
              <button onClick={() => router.push(`/bookings/${booking.id}`)} className="bg-gray-600 text-white px-3 py-1 rounded">Details</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}