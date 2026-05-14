"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated } from "@/lib/auth";
import api from "@/lib/axios";

interface Booking {
  id: number;
  workerId: number;
  serviceId: number;
  scheduledAt: string;
  price: number;
  status: string;
  startedAt?: string;
  completedAt?: string;
  earning?: { id: number; amount: number; netAmount: number };
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = Number(params.id);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const res = await api.get(`/worker/booking-with-earning/${bookingId}`);
      setBooking(res.data);
    } catch (err) {
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout >;
  if (!booking) return <DashboardLayout><div>Booking not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Booking #{booking.id}</h1>
        <div className="space-y-2">
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Service ID:</strong> {booking.serviceId}</p>
          <p><strong>Price:</strong> ${booking.price}</p>
          <p><strong>Scheduled:</strong> {new Date(booking.scheduledAt).toLocaleString()}</p>
          {booking.startedAt && <p><strong>Started:</strong> {new Date(booking.startedAt).toLocaleString()}</p>}
          {booking.completedAt && <p><strong>Completed:</strong> {new Date(booking.completedAt).toLocaleString()}</p>}
          {booking.earning && (
            <div className="mt-4 border-t pt-4">
              <h2 className="text-lg font-semibold">Earning details</h2>
              <p>Net amount: ${booking.earning.netAmount}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}