"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { isAuthenticated, getWorkerId } from "@/lib/auth";
import api from "@/lib/axios";

interface Review {
  id: number;
  rating: number;
  comment: string;
  reply: string | null;
  createdAt: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replying, setReplying] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const workerId = getWorkerId();
    if (!workerId) return;
    try {
      const res = await api.get(`/worker/reviews/${workerId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: number) => {
    try {
      await api.post(`/worker/reviews/${reviewId}/reply`, { reply: replyText });
      setReplying(null);
      setReplyText("");
      await fetchReviews();
    } catch (err) {
      setError("Failed to reply");
    }
  };

  if (loading) return <DashboardLayout><div>Loading reviews...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Customer Reviews</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded mb-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="font-bold">Rating: {review.rating}/5</span>
              <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-2">{review.comment}</p>
            {review.reply ? (
              <p className="mt-2 text-blue-600">Your reply: {review.reply}</p>
            ) : (
              <div className="mt-2">
                {replying === review.id ? (
                  <div>
                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="border rounded w-full p-2" rows={2} placeholder="Write a reply..." />
                    <div className="mt-2 space-x-2">
                      <button onClick={() => handleReply(review.id)} className="bg-blue-600 text-white px-3 py-1 rounded">Submit Reply</button>
                      <button onClick={() => setReplying(null)} className="bg-gray-400 px-3 py-1 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReplying(review.id)} className="text-blue-600 hover:underline">Reply</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}