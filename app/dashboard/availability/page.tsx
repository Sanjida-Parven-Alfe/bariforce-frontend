"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId } from "@/lib/auth";
import api from "@/lib/axios";

interface Slot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

export default function AvailabilityPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Slot | null>(null);
  const [form, setForm] = useState({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isRecurring: true });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      const res = await api.get(`/worker/availability/schedule/${workerId}`);
      setSlots(res.data.slots);
    } catch (err) {
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      await api.post(`/worker/availability/slots/${workerId}`, form);
      await fetchSlots();
      setForm({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isRecurring: true });
    } catch (err) {
      setError("Failed to add slot");
    }
  };

  const handleUpdate = async (slot: Slot) => {
    try {
      await api.put(`/worker/availability/slot/${slot.id}`, {
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring,
      });
      await fetchSlots();
      setEditing(null);
    } catch (err) {
      setError("Failed to update");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this slot?")) {
      try {
        await api.delete(`/worker/availability/slot/${id}`);
        await fetchSlots();
      } catch (err) {
        setError("Failed to delete");
      }
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Availability Slots</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded mb-6 flex flex-wrap gap-4">
          <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })} className="border p-2 rounded">
            <option value="0">Sun</option><option value="1">Mon</option><option value="2">Tue</option><option value="3">Wed</option>
            <option value="4">Thu</option><option value="5">Fri</option><option value="6">Sat</option>
          </select>
          <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="border p-2 rounded" />
          <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="border p-2 rounded" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} /> Recurring</label>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Slot</button>
        </form>

        <div className="space-y-2">
          {slots.map((slot) => (
            <div key={slot.id} className="border p-3 rounded flex justify-between items-center">
              {editing?.id === slot.id ? (
                <div className="flex gap-2">
                  <select value={editing.dayOfWeek} onChange={(e) => setEditing({ ...editing, dayOfWeek: Number(e.target.value) })} className="border p-1">
                    <option value="0">Sun</option><option value="1">Mon</option><option value="2">Tue</option><option value="3">Wed</option>
                    <option value="4">Thu</option><option value="5">Fri</option><option value="6">Sat</option>
                  </select>
                  <input type="time" value={editing.startTime} onChange={(e) => setEditing({ ...editing, startTime: e.target.value })} className="border p-1" />
                  <input type="time" value={editing.endTime} onChange={(e) => setEditing({ ...editing, endTime: e.target.value })} className="border p-1" />
                  <button onClick={() => handleUpdate(editing)} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
                  <button onClick={() => setEditing(null)} className="bg-gray-400 px-2 py-1 rounded">Cancel</button>
                </div>
              ) : (
                <>
                  <div>Day {slot.dayOfWeek} | {slot.startTime} - {slot.endTime} {slot.isRecurring ? "(recurring)" : ""}</div>
                  <div>
                    <button onClick={() => setEditing(slot)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(slot.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}