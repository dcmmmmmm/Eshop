"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Validate các trường bắt buộc
      if (!email || !password) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Email không hợp lệ");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error === "CredentialsSignin" 
          ? "Email hoặc mật khẩu không chính xác"
          : result.error
        );
        return;
      }

      // Lấy session để kiểm tra role
      const response = await fetch('/api/auth/session');
      const session = await response.json();

      toast.success("Đăng nhập thành công!");

      // Lấy callbackUrl từ URL parameters
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl') || '/';

      // Kiểm tra role và chuyển hướng
      if (session?.user?.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push(callbackUrl);
      }
      router.refresh();

    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập với Google
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Đăng nhập với Google thất bại");
    }
  };

  // Xử lý đăng nhập với Github
  const handleGithubSignIn = async () => {
    try {
      await signIn("github", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Đăng nhập với Github thất bại");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Orange background with illustration */}
      <div className="bg-[#FF7A3D] p-8 md:w-1/2 flex flex-col justify-center text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simplify management with our dashboard.
          </h1>
          <p className="text-lg mb-8">
            Simplify your e-commerce management with our user-friendly admin dashboard.
          </p>
          <div className="relative h-64 md:h-96">
            <Image
              src="/auth-illustration.png"
              alt="Dashboard illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="p-8 md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="E Spurt Logo"
              width={48}
              height={48}
              className="mx-auto"
            />
            <h2 className="mt-6 text-3xl font-bold">CHÀO MỪNG TRỞ LẠI</h2>
            <p className="mt-2 text-gray-600">Đăng nhập vào tài khoản của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-orange-500 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF7A3D] text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FcGoogle className="text-2xl mr-2" />
                Google
              </button>
              <button
                type="button"
                onClick={handleGithubSignIn}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaGithub className="text-2xl mr-2" />
                Github
              </button>
            </div>

            <p className="text-center text-gray-600">
             Không có tài khoản?{" "}
              <Link href="/register" className="text-orange-500 hover:underline">
                Đăng ký
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}