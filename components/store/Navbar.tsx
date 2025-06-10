"use client"
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname} from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, LogOut, PackageCheck, User } from 'lucide-react';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Product {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

// Thêm hàm helper để lấy ngẫu nhiên 5 sản phẩm
const getRandomProducts = (products: Product[] = [], count: number = 5) => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Tách phần Categories thành component riêng
const Categories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="hidden lg:group-hover:grid absolute left-0 grid-cols-1 lg:grid-cols-5 gap-4 w-full lg:w-[1000px] p-4 bg-white shadow-lg border rounded-lg">
      {categories.map((category) => (
        <div key={category.id}>
          <Link href={`/category/${category.slug}`} className="font-bold text-blue-600 mb-2">{category.name}</Link>
          <ul className="space-y-2">
            {getRandomProducts(category.products, 5).map((product) => (
              <li key={product.id}>
                <Link href={`/product/${product.slug}`} className="text-gray-600 hover:text-blue-600">
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : '';
  };
  const {data: session} = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  // Thêm useEffect để kiểm tra session
  React.useEffect(() => {
    if (session?.user) {
      console.log('Session user data:', session?.user);
    }
  }, [session]);

  // Thêm useEffect để fetch categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <header className="bg-sky-500 shadow sticky top-0 z-50">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">Dola Phone</Link>
          
          {/* Mobile menu button */}
          <Button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
            
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
            <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="w-5 h-5" />
                </button>
            </div>
          </form>

          {/* Utilities */}
          <div className="flex items-center space-x-6">
            {!session ? (
              <Link href="/login" className="flex items-center space-x-1">
                <div className='flex items-center gap-2'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Đăng nhập</span>
                </div>
              </Link>
            ) : (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                      <Image
                        src={session?.user?.image ?? '/default-avatar.png'}
                        alt={`Avatar của ${session?.user?.name || 'người dùng'}`}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        priority
                        unoptimized
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className='text-center'>{session?.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/user/${session?.user?.id}`} className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Hồ sơ
                      </Link>
                    </DropdownMenuItem>
                    {session?.user?.role === 'ADMIN' &&(
                      <DropdownMenuItem asChild>
                        <Link href={'/dashboard'} className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    ) }
                    <DropdownMenuItem asChild>
                      <Link href="/order" className="flex items-center gap-2">
                        <PackageCheck className="w-5 h-5" />
                        Đơn hàng
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorite" className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Sản phẩm yêu thích
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({callbackUrl: '/'})}>
                      <div className="flex items-center gap-2">
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
              
  
            <Link href="/cart" className="flex items-center space-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline">Giỏ hàng</span>
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className={`border-t ${mobileMenuOpen ? 'block' : 'hidden'} lg:block bg-white`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row">
              {/* Primary Nav */}
              <div className="flex flex-col lg:flex-row">
                <Link href="/" className={`px-3 py-4 hover:text-blue-600 border-b lg:border-b-0 ${isActive('/')}`}>Trang chủ</Link>
                <Link href="/about" className={`px-3 py-4 hover:text-blue-600 border-b lg:border-b-0 ${isActive('/about')}`}>Giới thiệu</Link>
                {/* Products Dropdown */}
                <div className="relative group">
                  <button className="w-full lg:w-auto px-3 py-4 hover:text-blue-600 flex items-center justify-between border-b lg:border-b-0">
                    <span>Danh Mục</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Categories categories={categories} />
                  </Suspense>
                </div>
                <Link href="/new" className={`px-3 py-4 hover:text-blue-600 border-b lg:border-b-0 ${isActive('/tin-tuc')}`}>Tin tức</Link>
                <Link href="/review" className={`px-3 py-4 hover:text-blue-600 border-b lg:border-b-0 ${isActive('/review')}`}>Review</Link>
                <Link href="/faq" className={`px-3 py-4 hover:text-blue-600 border-b lg:border-b-0 ${isActive('/faq')}`}>Câu hỏi thường gặp</Link>
                <Link href="/contact" className={`px-3 py-4 hover:text-blue-600 border-b lg:border-b-0 ${isActive('/contact')}`}>Liên hệ</Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
