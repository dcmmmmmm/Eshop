"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/store/Footer';
import Navbar from '@/components/store/Navbar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import ProductCard from '@/components/store/ProductCard';
import BrandCarousel from '@/components/store/BrandCarousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Brand {
  id: string;
  name: string;
  slug: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  rating?: number; // Thêm trường rating
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[]; // Thêm trường products cho từng danh mục
}

const features = [
  { icon: '/icons/shipping.png', label: 'Giao hàng nhanh' },
  { icon: '/icons/support.png', label: 'Tư vấn chuyên nghiệp' },
  { icon: '/icons/authentic.png', label: '100% chính hãng' },
  { icon: '/icons/payment.png', label: 'Thanh toán linh hoạt' },
];
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [topRatedProducts, setTopRatedProducts] = React.useState<Product[]>([]);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  // Thêm useEffect để fetch brands
  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error('Lỗi khi tải thương hiệu:', error);
      }
    }
    fetchBrands();
  },[])

  React.useEffect(() => {
    const fetchProdcts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Lỗi khi tải Sản phẩm:', error);
      }
    }
    fetchProdcts();
  },[])
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    }
    fetchCategories();
  }, []);

  // Thêm useEffect để fetch sản phẩm đánh giá cao
  React.useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch('/api/products/top-rated');
        const data = await response.json();
        setTopRatedProducts(data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm đánh giá cao:', error);
      }
    }
    fetchTopRatedProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
    {/* Navbar */}
    <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>
    
    {/* Features */}
    <section className="py-4 bg-gray-50">
      <div className="max-w-7xl mx-auto flex justify-between">
        {features.map(feat => (
          <div key={feat.label} className="flex items-center space-x-2">
            <Image src={feat.icon} alt={feat.label} width={32} height={32} />
            <span className="text-sm font-medium">{feat.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Hero Slider */}
    <section className="relative h-[500px] overflow-hidden">
      <Image src="/images/hero1.jpg" alt="Promo" fill className="object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-start px-8">
        <h1 className="text-white text-4xl font-bold mb-4">Ưu đãi khủng cho iPhone 15</h1>
        <Link href="/products" className="px-6 py-3 bg-red-500 text-white rounded-lg">Xem ngay</Link>
      </div>
    </section>
        

    {/* Brand Highlights */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Thương Hiệu Nổi Bật</h2>
        <div className="relative">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {brands.map(brand => (
                <CarouselItem key={brand.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <BrandCarousel name={brand.name} slug={brand.slug} image={brand.image} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="relative translate-y-0 mx-2 hover:bg-gray-100" />
              <CarouselNext className="relative translate-y-0 mx-2 hover:bg-gray-100" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>

    {/* New Product & Most rate product*/}
    <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="new" className="text-lg">
                Sản phẩm Mới
              </TabsTrigger>
              <TabsTrigger value="top-rated" className="text-lg">
                Đánh giá Cao Nhất
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <Carousel
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {products.map(product => (
                    <CarouselItem key={product.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <ProductCard
                        name={product.name}
                        slug={product.slug}
                        image={product.image}
                        price={product.price}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-8">
                  <CarouselPrevious className="relative translate-y-0 mx-2 hover:bg-gray-100" />
                  <CarouselNext className="relative translate-y-0 mx-2 hover:bg-gray-100" />
                </div>
              </Carousel>
            </TabsContent>

            <TabsContent value="top-rated">
              <Carousel
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {topRatedProducts.map(product => (
                    <CarouselItem key={product.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <ProductCard
                        name={product.name}
                        slug={product.slug}
                        image={product.image}
                        price={product.price}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-8">
                  <CarouselPrevious className="relative translate-y-0 mx-2 hover:bg-gray-100" />
                  <CarouselNext className="relative translate-y-0 mx-2 hover:bg-gray-100" />
                </div>
              </Carousel>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    {/* Category Section */}
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {categories
          .filter(category => category.products && category.products.length > 0)
          .map(category => (
            <div key={category.id} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <Link 
                  href={`/category/${category.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xem tất cả
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {category.products.slice(0, 5).map(product => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    slug={product.slug}
                    image={product.image}
                    price={product.price}
                  />
                ))}
              </div>
            </div>
        ))}
      </div>
    </section>
    {/* Footer */}
    <Footer/>
  </div>
  );
}
