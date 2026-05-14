"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId, removeToken } from "@/lib/auth";
import api from "@/lib/axios";

const deletionReasons = [
  "I found a job elsewhere.",
  "I am no longer looking for home-based work.",
  "The pay rates/wages are too low.",
  "I cannot find work near my location.",
  "Personal issue",
  "I am leaving this city",
];

export default function DeleteAccountPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleDelete = async () => {
    setError("");
    if (!reason) {
      setError("Please select a reason for deleting your account");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    const workerId = getWorkerId();
    if (!workerId) return;

    setLoading(true);
    try {
      await api.delete(`/worker/delete-account/${workerId}`, {
        data: { password, reason },
      });
      // Logout and redirect
      removeToken();
      localStorage.removeItem("worker_id");
      localStorage.removeItem("worker_name");
      router.push("/login?deleted=1");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === "Invalid password") {
        setError("Incorrect password. Account not deleted.");
      } else {
        setError(msg || "Failed to delete account");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h1>
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
            <p className="text-sm text-red-700">
              ⚠️ Once you delete your account, all your data will be permanently removed.
              This action cannot be undone.
            </p>
          </div>

          <div className="space-y-4">
            {/* Deletion reason dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for leaving (required)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select a reason</option>
                {deletionReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded px-3 py-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
            >
              {loading ? "Deleting..." : "Permanently Delete My Account"}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}