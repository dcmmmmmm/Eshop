"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Đăng ký thành công!
          </h2>
          <div className="mt-4 text-gray-600">
            <p className="mb-2">
              Chúng tôi đã gửi một email xác thực đến địa chỉ email của bạn.
            </p>
            <p className="mb-4">
              Vui lòng kiểm tra hộp thư (bao gồm cả thư rác) và nhấp vào liên kết xác thực để hoàn tất quá trình đăng ký.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-700 text-sm">
                Lưu ý: Nếu bạn không nhận được email trong vòng vài phút, vui lòng kiểm tra thư mục spam hoặc liên hệ với chúng tôi để được hỗ trợ.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
            >
              Đến trang đăng nhập
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}