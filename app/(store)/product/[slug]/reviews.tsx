"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

interface ReviewsProps {
  productId: string;
}

export default function Reviews({ productId }: ReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      // Reset form và refresh danh sách đánh giá
      setRating(5);
      setComment("");
      fetchReviews();
      setError("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  // const handleDelete = async (reviewId: string) => {
  //   if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

  //   try {
  //     const res = await fetch(`/api/products/${productId}/reviews`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ reviewId }),
  //     });

  //     if (!res.ok) {
  //       const data = await res.json();
  //       throw new Error(data.error);
  //     }

  //     fetchReviews();
  //   } catch (error: any) {
  //     setError(error.message);
  //   }
  // };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: editingReview.id,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setEditingReview(null);
      setRating(5);
      setComment("");
      fetchReviews();
      setError("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setDeleteReviewId(reviewId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteReviewId) return;

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: deleteReviewId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      fetchReviews();
      setDeleteReviewId(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form đánh giá */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">
          {editingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
        </h3>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={editingReview ? handleUpdate : handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Đánh giá của bạn:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`text-2xl ${value <= rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2">Nhận xét của bạn:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              required
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingReview ? "Cập nhật" : "Gửi đánh giá"}
            </button>
            {editingReview && (
              <button
                type="button"
                onClick={() => {
                  setEditingReview(null);
                  setRating(5);
                  setComment("");
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Đánh giá từ khách hàng</h3>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${index < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {session?.user?.id === review.user.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteReviewId !== null} onOpenChange={() => setDeleteReviewId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa đánh giá</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteReviewId(null)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}