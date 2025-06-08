"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = React.useState<Category | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        // Fetch category details
        const categoryResponse = await fetch(`/api/categories/category/${params.slug}`);
        const categoryData = await categoryResponse.json();
        console.log('Category Data:', categoryData); // Thêm dòng này để debug
        setCategory(categoryData);

        // Fetch products of this category
        const productsResponse = await fetch(`/api/categories/category/${params.slug}/products`);
        const productsData = await productsResponse.json();
        console.log('Products Data:', productsData); // Thêm dòng này để debug
        setProducts(productsData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchCategoryAndProducts();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy Danh mục</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
      
      {/* Category Hero Section */}
      <section className="relative h-[400px]">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
            <p className="text-white text-lg max-w-2xl">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Sản phẩm của {category.name}</h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-8">
              Hiện tại không có sản phẩm nào thuộc danh mục này
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative h-64">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-red-600 font-semibold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(product.price)}
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                          Thích
                        </button>
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}