"use client"
import React from 'react';
import Footer from '@/components/store/Footer';
import Navbar from '@/components/store/Navbar';


export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  return (
    <div className="min-h-screen flex flex-col">
    {/* Navbar */}
    <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>

    {/* Main content */}
    <main className="flex-grow">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Giới thiệu</h2>
          <p className="text-gray-700">
            Chào mừng bạn đến với trang web của chúng tôi! Chúng tôi là một trang web về điện thoại di động, cung cấp thông tin về các sản phẩm điện thoại, các mẫu điện thoại mới nhất, các ưu đãi đặc biệt và nhiều hơn nữa.
          </p>
          <p className="text-gray-700 mt-4">
            Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm điện thoại tuyệt vời nhất. Với đội ngũ nhân viên chuyên nghiệp và hàng hóa chất lượng, chúng tôi mong muốn bạn sẽ tìm được sản phẩm điện thoại phù hợp với nhu cầu của mình.
          </p>
        </div>
      </section>
    </main>
    {/* Footer */}
    <Footer/>
  </div>
  );
}
