"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import toast from 'react-hot-toast';
import getStripe from '@/lib/stripe';

interface ShippingInfo {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = React.useState(false);
  const [selectedShipping, setSelectedShipping] = React.useState<string>('');
  const [selectedPayment, setSelectedPayment] = React.useState<string>('');
  
  const [shippingInfo, setShippingInfo] = React.useState<ShippingInfo>({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  });

  const shippingMethods: ShippingMethod[] = [
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', price: 0 },
    { id: 'express', name: 'Giao hàng nhanh', price: 50000 }
  ];

  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'stripe', 
      name: 'Thanh toán qua thẻ', 
      description: 'Thanh toán an toàn qua Stripe',
      icon: '/icons/credit-card.png'
    },
    { 
      id: 'cod', 
      name: 'Thanh toán khi nhận hàng', 
      description: 'Thanh toán tiền mặt khi nhận hàng',
      icon: '/icons/cash.png'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleStripeCheckout = async () => {
    try {
      // Kiểm tra giỏ hàng
      if (!items || items.length === 0) {
        toast.error('Giỏ hàng trống');
        return;
      }

      // Kiểm tra và xử lý giá sản phẩm
      const validatedItems = items.map(item => {
        if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
          throw new Error(`Giá không hợp lệ cho sản phẩm: ${item.name}`);
        }
        return {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: item.name || 'Sản phẩm không tên',
              images: item.image ? [item.image] : []
            },
            unit_amount: Math.round(item.price) // Đảm bảo giá là số nguyên
          },
          quantity: item.quantity > 0 ? item.quantity : 1
        };
      });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: validatedItems,
          shipping_fee: selectedShipping === 'express' ? 50000 : 0,
          shipping_info: shippingInfo
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Lỗi khi tạo phiên thanh toán');
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Không thể kết nối với Stripe');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping info
    for (const [key, value] of Object.entries(shippingInfo)) {
      if (!value.trim()) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }
    }

    if (!selectedShipping) {
      toast.error('Vui lòng chọn phương thức vận chuyển');
      return;
    }

    if (!selectedPayment) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setLoading(true);

    try {
      if (selectedPayment === 'stripe') {
        await handleStripeCheckout();
        return;
      }

      // Handle COD payment
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingInfo,
          items,
          shippingMethod: selectedShipping,
          paymentMethod: selectedPayment,
          total: getTotal() + (selectedShipping === 'express' ? 50000 : 0)
        })
      });

      if (!response.ok) {
        throw new Error('Đặt hàng thất bại');
      }

      const data = await response.json();
      clearCart(); // Clear cart after successful order
      toast.success('Đặt hàng thành công');
      router.push(`/order-confirm?orderId=${data.orderId}`);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Customer Info */}
            <div className="lg:w-2/3 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Thông tin nhận hàng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
                      <input
                        type="text"
                        name="district"
                        value={shippingInfo.district}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                      <input
                        type="text"
                        name="ward"
                        value={shippingInfo.ward}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Phương thức vận chuyển</h2>
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <label key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">
                          {method.price === 0 ? 'Miễn phí' : `${method.price.toLocaleString()}đ`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="flex-1 flex items-center">
                        {method.icon && (
                          <div className="w-8 h-8 mr-3">
                            <Image
                              src={method.icon}
                              alt={method.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium line-clamp-2">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.quantity} x {item.price.toLocaleString()}đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{getTotal().toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>
                      {selectedShipping === 'express' ? '50,000đ' : 'Miễn phí'}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span>
                      {(getTotal() + (selectedShipping === 'express' ? 50000 : 0)).toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : `Thanh toán ${selectedPayment === 'stripe' ? 'qua thẻ' : 'khi nhận hàng'}`}
                </Button>

                {/* Secure Payment Notice */}
                {selectedPayment === 'stripe' && (
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Image
                        src="/icons/secure.png"
                        alt="Secure"
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      Thanh toán an toàn qua Stripe
                    </div>
                    <div className="flex justify-center space-x-2">
                      <Image src="/icons/visa.png" alt="Visa" width={32} height={20} />
                      <Image src="/icons/mastercard.png" alt="Mastercard" width={32} height={20} />
                      <Image src="/icons/amex.png" alt="American Express" width={32} height={20} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}