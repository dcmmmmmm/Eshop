import Link from 'next/link';
import Image from 'next/image';

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl p-8 text-center">
        <div className="mb-8">
          <Image
            src="/404.jpg"
            alt="404 Illustration"
            width={300}
            height={300}
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-6xl font-bold text-[#FF7A3D] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! Trang không tồn tại
        </h2>
        <p className="text-gray-600 mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-[#FF7A3D] text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
}