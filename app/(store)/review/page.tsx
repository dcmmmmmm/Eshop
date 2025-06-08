"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/store/Footer';
import Navbar from '@/components/store/Navbar';

const reviews = [
  {
    id: 1,
    title: 'iPHONE 15 PRO MAX: KHUI HỘP TRẢI NGHIỆM VÀ CHIA SẺ CHI TIẾT',
    thumbnail: '/images/reviews/review1.jpg',
    videoUrl: '#',
    duration: '10:25'
  },
  {
    id: 2,
    title: 'Mở hộp iPhone 15 Pro Max',
    thumbnail: '/images/reviews/review2.jpg',
    videoUrl: '#',
    duration: '8:15'
  },
  {
    id: 3,
    title: 'Review iPhone 15 Pro Max: thay đổi nhỏ (hay lớn)?',
    thumbnail: '/images/reviews/review3.jpg',
    videoUrl: '#',
    duration: '15:30'
  },
  {
    id: 4,
    title: 'SO SÁNH iPHONE 15 PRO MAX VS iPHONE 14 PRO MAX: CÓ ĐÁNG NÂNG CẤP?',
    thumbnail: '/images/reviews/review4.jpg',
    videoUrl: '#',
    duration: '12:45'
  }
];

export default function ReviewPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>

      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-blue-600 mr-3"></span>
            REVIEW SẢN PHẨM
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg overflow-hidden shadow-lg group">
                <div className="relative">
                  <Link href={review.videoUrl}>
                    <div className="relative pt-[56.25%]">
                      <Image
                        src={review.thumbnail}
                        alt={review.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                      {review.duration}
                    </div>
                  </Link>
                </div>
                <div className="p-4">
                  <Link href={review.videoUrl}>
                    <h2 className="text-lg font-medium line-clamp-2 group-hover:text-blue-600 transition">
                      {review.title}
                    </h2>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}