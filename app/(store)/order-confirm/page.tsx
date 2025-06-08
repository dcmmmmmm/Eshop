"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/store/Footer';
import Navbar from '@/components/store/Navbar';
import { Button } from '@/components/ui/button';

export default function OrderConfirmPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Đặt hàng thành công!
            </h1>

            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là: <span className="font-semibold">{orderId}</span>
            </p>

            <p className="text-gray-600 mb-8">
              Chúng tôi sẽ gửi email xác nhận đơn hàng và thông tin chi tiết đến địa chỉ email của bạn.
            </p>

            <div className="max-w-md mx-auto space-y-4">
              <Link href="/order" className="block">
                <Button
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xem đơn hàng của tôi
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}