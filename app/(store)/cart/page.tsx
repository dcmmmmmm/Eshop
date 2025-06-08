"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/store/Footer';
import Navbar from '@/components/store/Navbar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';

export default function CartPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <Image
                  src="/empty-cart.png"
                  alt="Empty Cart"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
              <p className="text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 relative flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-red-600 font-semibold">
                            {item.price.toLocaleString()}₫
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Tổng giỏ hàng</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{getTotal().toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Tổng cộng:</span>
                        <span className="text-red-600">{getTotal().toLocaleString()}₫</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => router.push('/checkout')}
                    className="w-full mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Tiến hành đặt hàng
                  </Button>
                  <Link 
                    href="/"
                    className="w-full mt-4 px-6 py-3 border border-gray-300 text-center rounded-lg hover:bg-gray-50 block"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer/>
    </div>
  );
}

