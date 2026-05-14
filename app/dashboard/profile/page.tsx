"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId, removeToken } from "@/lib/auth";
import api from "@/lib/axios";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile data
  const [username, setUsername] = useState("");
  const [workertype, setWorkertype] = useState("");
  const [phone, setPhone] = useState("");

  // Phone update
  const [newPhone, setNewPhone] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      const res = await api.get(`/worker/profile/${workerId}`);
      const data = res.data;
      setUsername(data.username);
      setWorkertype(data.workertype);
      setPhone(data.phone);
      setNewPhone(data.phone);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    setError("");
    setSuccess("");
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      await api.put(`/worker/update-phone/${workerId}`, { phone: newPhone });
      setPhone(newPhone);
      setSuccess("Phone number updated successfully");
    } catch (err) {
      setError("Failed to update phone");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      await api.post(`/worker/change-password-secure/${workerId}`, {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setPasswordError(msg === "Invalid current password" ? "Current password is incorrect" : "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div>Loading profile...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>

        {/* Profile Overview */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Worker Type:</strong> {workertype}</p>
            <p><strong>Phone:</strong> {phone}</p>
          </div>
        </div>

        {/* Update Phone Form */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Update Phone Number</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}
          <form onSubmit={handleUpdatePhone} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={phoneLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {phoneLoading ? "Updating..." : "Update Phone"}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          {passwordError && <p className="text-red-600 mb-2">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-600 mb-2">{passwordSuccess}</p>}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}