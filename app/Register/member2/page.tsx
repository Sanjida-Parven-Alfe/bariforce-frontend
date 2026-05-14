"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import Image from "next/image";
import Layout from "@/components/Layout/Layout";
import { workerRegisterSchema, WorkerRegisterForm } from "@/lib/validations/worker-register";
const extendedSchema = workerRegisterSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ExtendedForm = WorkerRegisterForm & { confirmPassword: string };

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<ExtendedForm>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    workertype: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ExtendedForm, string>>>({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ExtendedForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = extendedSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ExtendedForm, string>> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ExtendedForm;
        if (path) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register-worker`,
        {
          fullname: form.fullname,
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone,
          workertype: form.workertype,
          gender: form.gender || undefined,
        }
      );
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setGeneralError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-transparent px-4 py-10 text-slate-900">
        <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Side – Branding */}
            <div className="hidden bg-white p-10 text-slate-900 lg:flex lg:flex-col lg:justify-center lg:items-center text-center">
  
             {/* Centered Image */}
            <div className="flex justify-center mb-8">
              <Image
                   src="/register.gif"    
                   alt="Registration illustration"
                   width={300}
                   height={300}
                   className="rounded-full border-4 border-slate-200 shadow-md"
               />
          </div>

           {/* Tagline (uppercase) */}
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                  Bariforce Worker Portal
             </p>

           {/* Main Heading */}
            <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight text-slate-900">
              Create a worker account and start earning.
            </h1>
          </div>

          {/* Right Side – Form */}
          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                  Create account
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Worker Signup</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Fill in the information below to create your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.fullname && <p className="mt-2 text-sm text-red-600">{errors.fullname}</p>}
                </div>

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone (11 digits)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Worker Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Worker Type
                  </label>
                  <select
                    name="workertype"
                    value={form.workertype}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select type</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                    <option value="cook">Cook</option>
                    <option value="maid">Maid</option>
                    <option value="driver">Driver</option>
                    <option value="security">Security Guard</option>
                  </select>
                  {errors.workertype && <p className="mt-2 text-sm text-red-600">{errors.workertype}</p>}
                </div>

                {/* Gender (Optional) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gender (optional)
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {generalError && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {generalError}
                  </div>
                )}
                {success && (
                  <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}