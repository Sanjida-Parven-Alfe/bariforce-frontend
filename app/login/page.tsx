"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import Image from "next/image";
import Layout from "@/components/Layout/Layout";   // ← Import Layout
import { setToken, setWorkerId, setWorkerName } from "@/lib/auth";

const loginSchema = z.object({
  usernameOrEmail: z.string().trim().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginData, string>>;

const initialLoginData: LoginData = {
  usernameOrEmail: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginData>(initialLoginData);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const field = e.target.name as keyof LoginData;
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
    setMessage("");
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();

  const result = loginSchema.safeParse(formData);
  if (!result.success) {
    const fieldErrors: LoginErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof LoginData;
      if (field) fieldErrors[field] = issue.message;
    });
    setErrors(fieldErrors);
    setMessage("");
    return;
  }

  const loginPayload = {
    usernameOrEmail: result.data.usernameOrEmail,
    password: result.data.password,
  };

  try {
    setLoading(true);
    setErrors({});
    setMessage("");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      loginPayload
    );

    const token = response.data?.data?.token;
    const workerId = response.data?.data?.workerId;
    const workerName = response.data?.data?.name;

    if (!token) {
      setMessage("Login failed. Token not found in server response.");
      return;
    }

    setToken(token);
    setWorkerName(workerName || "Worker");
    if (workerId) setWorkerId(workerId);

    setFormData(initialLoginData);
    router.push("/dashboard/dashboard");
  } catch (error)  {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        if (Array.isArray(backendMessage)) {
          setMessage(backendMessage.join(", "));
        } else if (typeof backendMessage === "string") {
          setMessage(backendMessage);
        } else {
          setMessage("Invalid email/username or password");
        }
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
          {/* Logo/Title Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/logo.jpg" alt="Bariforce Logo" width={100} height={200} className="rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome to Bariforce</h1>
            <p className="text-gray-600 mt-1">Please login to continue</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Enter your email or username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {errors.usernameOrEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.usernameOrEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {message && (
              <p className="text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/Register/member2" className="text-blue-600 hover:text-blue-700 font-semibold">
              Create account
            </Link>
          </p>

          {/* Footer Text */}
          <p className="mt-6 text-center text-xs text-gray-500">
            One stop for hiring all home services
          </p>
        </div>
      </div>
    </Layout>
  );
}