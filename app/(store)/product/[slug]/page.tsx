"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Share2, Star, Minus, Plus, ChevronRight, FileText, Settings2, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';
import Reviews from './reviews';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  technicalSpecifications: string;
  price: number;
  stock: number;
  image: string;
  status: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const router = useRouter();

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/product/${params.slug}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy sản phẩm');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < (product?.stock || 0)) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Trang chủ</span>
            <ChevronRight className="w-4 h-4" />
            <span>{product.category.name}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {product.brand.name}
                </span>
                {/* Thêm badge trạng thái sản phẩm */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'OUT_OF_STOCK'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.status === 'AVAILABLE'
                    ? 'Còn hàng'
                    : product.status === 'OUT_OF_STOCK'
                    ? 'Hết hàng'
                    : 'Ngừng kinh doanh'}
                </span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(150 đánh giá)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            </div>

            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(product.price)}
              </div>
              <div className="text-sm text-gray-500">
                Giá đã bao gồm thuế VAT
              </div>
            </div>

            {/* Số lượng và nút mua */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity >= (product?.stock || 0)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1 h-12"
                  disabled={product.status !== 'AVAILABLE'}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chính sách */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Image src="/icons/shipping.svg" alt="Shipping" width={24} height={24} />
                <div>
                  <h3 className="font-medium">Miễn phí vận chuyển</h3>
                  <p className="text-sm text-gray-600">Cho đơn hàng từ 2 triệu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Image src="/icons/warranty.svg" alt="Warranty" width={24} height={24} />
                <div>
                  <h3 className="font-medium">Bảo hành chính hãng</h3>
                  <p className="text-sm text-gray-600">12 tháng tại trung tâm bảo hành</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Mô tả
              </TabsTrigger>
              <TabsTrigger value="specifications" className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Thông số kỹ thuật
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Đánh giá
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <div className="prose prose-lg max-w-none bg-white p-6 rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </TabsContent>

            <TabsContent value="specifications">
              <div className="prose prose-lg max-w-none bg-white p-6 rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{ __html: product.technicalSpecifications }}
              />
            </TabsContent>

            <TabsContent value="reviews">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Reviews productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}