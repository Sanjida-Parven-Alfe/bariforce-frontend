"use client";

import Layout from "@/components/Layout/Layout";
import { useState } from "react";

export default function ContactPage() {
  // Optional: state to show a success message after form submit
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("Message sent! (Demo – no backend connected)");
    // You can add actual email sending logic here later
  };

  return (
    <Layout activePage="contact">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">📍 Visit Us</h2>
              <p className="text-gray-600">
                123, Baridhara DOHS<br />
                Dhaka, Bangladesh<br />
                Postal Code: 1206
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">📞 Call Us</h2>
              <p className="text-gray-600">
                Support: <a href="tel:+8801234567890" className="text-blue-600 hover:underline">+880 1234 567890</a><br />
                Business: <a href="tel:+8801987654321" className="text-blue-600 hover:underline">+880 1987 654321</a>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">✉️ Email Us</h2>
              <p className="text-gray-600">
                General: <a href="mailto:info@bariforce.com" className="text-blue-600 hover:underline">info@bariforce.com</a><br />
                Support: <a href="mailto:support@bariforce.com" className="text-blue-600 hover:underline">support@bariforce.com</a>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">🕘 Working Hours</h2>
              <p className="text-gray-600">
                Saturday – Wednesday: 9:00 AM – 8:00 PM<br />
                Thusday: 10:00 AM – 6:00 PM<br />
                Friday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}