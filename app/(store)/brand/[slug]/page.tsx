"use client"
import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import ProductCard from '@/components/store/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  brandId: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export default function BrandDetailPage({ params }: { params: { slug: string } }) {
  const [brand, setBrand] = React.useState<Brand | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBrandAndProducts = async () => {
      try {
        // Fetch brand details
        const brandResponse = await fetch(`/api/brands/brand/${params.slug}`);
        const brandData = await brandResponse.json();
        setBrand(brandData);

        // Fetch products of this brand
        const productsResponse = await fetch(`/api/brands/brand/${params.slug}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBrandAndProducts();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy thương hiệu</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
      
      {/* Brand Hero Section */}
      <section className="relative h-[400px]">
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{brand.name}</h1>
            <p className="text-white text-lg max-w-2xl">{brand.description}</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Sản phẩm của {brand.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} name={product.name} slug={product.slug} image={product.image} price={product.price} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}