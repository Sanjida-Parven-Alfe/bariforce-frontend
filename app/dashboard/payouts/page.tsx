"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId } from "@/lib/auth";
import api from "@/lib/axios";
import Image from "next/image";

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: "bkash", name: "Bkash", image: "/bkash1.png" },
  { id: "nagad", name: "Nagad", image: "/nagad.png" },
  { id: "rocket", name: "Rocket", image: "/rocket.webp" },
  { id: "opay", name: "Opay", image: "/upay.png" },
];


export default function PayoutsPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      const res = await api.get(`/worker/earnings/${workerId}`);
      setBalance(res.data.totalEarnings || 0);
    } catch (err) {
      setError("Failed to load balance");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (amountNum > balance) {
      setError("Sorry, you do not have enough balance to withdraw");
      return;
    }
    if (!accountNumber.trim()) {
      setError("Account number is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required to confirm withdrawal");
      return;
    }

    setLoading(true);
    const workerId = getWorkerId();
    if (!workerId) {
      setError("Worker not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      // Call new backend endpoint to deduct amount and verify password
      const res = await api.post(`/worker/payouts/withdraw`, {
     workerId,
     amount: amountNum,
     password,
     paymentMethod: selectedMethod.name,
     accountNumber: accountNumber.trim(),
    });
 
      setMessage(res.data.message || "Withdrawal successful!");
      setBalance(Number(res.data.balance || 0));

      setAmount("");
      setPassword("");
      setAccountNumber("");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === "Invalid password") {
        setError("Invalid password. Withdrawal cancelled.");
      } else {
        setError(msg || "Withdrawal failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Request Payout</h1>

        {/* Balance Display */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">Your Balance</p>
          <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Payment Method - Radio Buttons with Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Payment Method</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition ${
                    selectedMethod === method
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method}
                    onChange={(e) => setSelectedMethod(paymentMethods.find((m) => m.id === e.target.value) || paymentMethods[0])}
                    className="hidden"
                  />
                  <Image
                    src={method.image}
                    alt={method.name}
                    width={50}
                    height={50}
                    className="mb-2"
                  />
                  <span className="text-sm font-medium">{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount to Withdraw</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border rounded px-3 py-2"
              required
            />
            {balance > 0 && amount && parseFloat(amount) > balance && (
              <p className="text-red-500 text-sm mt-1">
                Insufficient balance. Maximum withdrawable: ${balance.toFixed(2)}
              </p>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm withdrawal"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Withdraw Funds"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}