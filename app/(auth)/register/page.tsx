"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UploadDropzone } from '@/utils/uploadthing';
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [imageUrl, setImageUrl] = useState('')
  const [role, setRole] = useState('USER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  // Logic funtion
  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 8;

    if (!hasLetter || !hasNumber || !isValidLength) {
      setPasswordError('Mật khẩu phải chứa ít nhất 1 chữ cái, 1 số và có ít nhất 8 ký tự.');
    } else {
      setPasswordError('');
    }
  };
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
  
      // Validate các trường bắt buộc
      if (!name || !email || !password || !confirmPassword || !phone) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
  
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Email không hợp lệ");
        return;
      }
  
      // Validate password match
      if (password !== confirmPassword) {
        setConfirmPasswordError('Mật khẩu không khớp');
        return;
      }
      setConfirmPasswordError('');
  
      // Validate password strength
      if (passwordError) {
        toast.error("Mật khẩu không đủ mạnh");
        return;
      }
  
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          image: imageUrl || undefined,
          role: role.toUpperCase(),
          gender: gender.toUpperCase(),
          phone
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Đã có lỗi xảy ra");
      }
  
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
      router.push("/register-success")
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setImageUrl('');
      setRole('USER');
      setGender('male');
      setPhone('');

    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
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
            <h2 className="mt-6 text-3xl font-bold">ĐĂNG KÝ TÀI KHOẢN</h2>
            <p className="mt-2 text-gray-600">Điền thông tin của bạn dưới đây.</p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-4">
            <div className="hidden">
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                  Vai trò
                </label>
                <input
                  id="role"
                  name="role"
                  type='hidden'
                  onChange={(e) => setRole(e.target.value)} 
                  value={role}
                  className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-[#ff025b] placeholder-gray-400"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="địa chỉ email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    required
                  placeholder="mật khẩu"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                {passwordError && <p className="text-red-900 text-sm mt-1">{passwordError}</p>}
              </div>
              {/* confirm password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="nhập lại mật khẩu"
                  value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError('');
                    }}
                    required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {confirmPasswordError && <p className="text-red-900 text-sm mt-1">{confirmPasswordError}</p>}
            </div>
            <div className="flex items-center space-x-6">
                <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2">Nam</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2">Nữ</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={gender === 'other'}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2">Khác</span>
                  </label>
                </div>
              </div>
              {/* Số điện thoại */}
              <div>
                <input
                  type="tel"
                  placeholder="số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            {/* Upload Image Button */}
            <div className="grid grid-cols-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-500 tracking-wide">
                    Dán ảnh
                  </label>
                  {imageUrl && (
                    <Button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="py-1 px-3 focus:outline-none hover:bg-gray-200"
                    >
                      + Chỉnh sửa
                    </Button>
                  )}
                </div>
                {imageUrl ? (
                  <div className="col-span-6 sm:col-span-4 shadow">
                    <Image
                      src={imageUrl}
                      alt="animeImage"
                      width="1000"
                      height="100"
                      className="object-cover w-full h-[250px]"
                      />
                  </div>
                  ) : (
                    <UploadDropzone
                      endpoint={"imageUploader"}
                      onClientUploadComplete={(url: any) => {
                        console.log("files", url);
                        setImageUrl(url?.[0].url);
                        toast.success("Tải ảnh thành công");
                      }}
                      onUploadError={(error) => {
                        console.log(error)
                        toast.error(`Tải ảnh thất bại`);
                      }}
                    />
                )}
              </div>
            
            <Button
              type="submit"
              onClick={handleSubmit}
              // disabled={loading}
              className="w-full bg-[#FF7A3D] text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Đăng ký
            </Button>

            <p className="text-center text-gray-600">
             Đã có tài khoản?{" "}
              <Link href="/login" className="text-orange-500 hover:underline">
                Đăng nhập
              </Link>
            </p>
            <p className="text-center text-gray-600">
             Bạn muốn trở thành quản trị viên?{" "}
              <Link href="/register-admin" className="text-orange-500 hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
