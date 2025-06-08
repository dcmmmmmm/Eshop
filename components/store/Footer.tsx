import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div>
      <footer className="bg-sky-500 text-black">
        {/* Top Footer */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">CHÍNH SÁCH</h4>
              <ul className="space-y-2">
                <li><Link href="/chinh-sach-thanh-vien" className="hover:text-white">Chính sách thành viên</Link></li>
                <li><Link href="/chinh-sach-thanh-toan" className="hover:text-white">Chính sách thanh toán</Link></li>
                <li><Link href="/chinh-sach-bao-hanh" className="hover:text-white">Chính sách bảo hành và bảo trì</Link></li>
                <li><Link href="/chinh-sach-van-chuyen" className="hover:text-white">Chính sách vận chuyển và giao nhận</Link></li>
                <li><Link href="/bao-mat" className="hover:text-white">Bảo mật thông tin cá nhân</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">HỖ TRỢ</h4>
              <ul className="space-y-2">
                <li><Link href="/huong-dan-mua" className="hover:text-white">Hướng dẫn mua hàng</Link></li>
                <li><Link href="/huong-dan-thanh-toan" className="hover:text-white">Hướng dẫn thanh toán</Link></li>
                <li><Link href="/huong-dan-giao-nhan" className="hover:text-white">Hướng dẫn giao nhận</Link></li>
                <li><Link href="/dieu-khoan" className="hover:text-white">Điều khoản dịch vụ</Link></li>
                <li><Link href="/cau-hoi" className="hover:text-white">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">DANH MỤC NỔI BẬT</h4>
              <ul className="space-y-2">
                <li><Link href="/iphone" className="hover:text-white">iPhone</Link></li>
                <li><Link href="/ipad" className="hover:text-white">iPad</Link></li>
                <li><Link href="/mac" className="hover:text-white">Mac</Link></li>
                <li><Link href="/watch" className="hover:text-white">Watch</Link></li>
                <li><Link href="/airpods" className="hover:text-white">AirPods</Link></li>
                <li><Link href="/am-thanh" className="hover:text-white">Âm thanh</Link></li>
                <li><Link href="/phu-kien" className="hover:text-white">Phụ kiện</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">LIÊN KẾT SÀN</h4>
              <div className="grid grid-cols-2 gap-4">
                <Link href="https://shopee.vn" className="hover:opacity-80">
                  <Image src="/images/shopee.png" alt="Shopee" width={40} height={40} />
                </Link>
                <Link href="https://lazada.vn" className="hover:opacity-80">
                  <Image src="/images/lazada.png" alt="Lazada" width={40} height={40} />
                </Link>
                <Link href="https://tiki.vn" className="hover:opacity-80">
                  <Image src="/images/tiki.png" alt="Tiki" width={40} height={40} />
                </Link>
                <Link href="https://sendo.vn" className="hover:opacity-80">
                  <Image src="/images/sendo.png" alt="Sendo" width={40} height={40} />
                </Link>
              </div>

              <h4 className="text-white font-semibold mt-8 mb-4">HÌNH THỨC THANH TOÁN</h4>
              <div className="grid grid-cols-4 gap-2">
                <Image src="/images/payment/visa.png" alt="Visa" width={40} height={25} />
                <Image src="/images/payment/mastercard.png" alt="Mastercard" width={40} height={25} />
                <Image src="/images/payment/jcb.png" alt="JCB" width={40} height={25} />
                <Image src="/images/payment/cod.png" alt="COD" width={40} height={25} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Image src="/logo.png" alt="Dola Phone" width={150} height={50} className="mb-2" />
                <p className="text-sm">
                  Hệ thống bán lẻ smartphone, máy tính bảng, MacBook, thiết bị công nghệ chính hãng với giá tốt, có trả góp 0%, giao hàng nhanh miễn phí.
                </p>
                <div className="mt-4">
                  <p className="text-sm">Địa chỉ: 70 Lữ Gia, Phường 15, Quận 11, TP.HCM</p>
                  <p className="text-sm">Điện thoại: 1900 6750</p>
                  <p className="text-sm">Email: support@sapo.vn</p>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="flex space-x-4 mb-4">
                  <Link href="https://zalo.me" className="hover:opacity-80">
                    <Image src="https://stc-zaloprofile.zdn.vn/pc/v1/images/logo.svg" alt="Zalo" width={32} height={32} />
                  </Link>
                  <Link href="https://facebook.com" className="hover:opacity-80">
                    <Image src="/social/facebook.png" alt="Facebook" width={32} height={32} />
                  </Link>
                  <Link href="https://youtube.com" className="hover:opacity-80">
                    <Image src="/social/ytb.png" alt="Youtube" width={32} height={32} />
                  </Link>
                  <Link href="https://google.com" className="hover:opacity-80">
                    
                  </Link>
                </div>
                <div className="text-sm text-center md:text-right">
                  <p>© 2024 Dola Phone. All rights reserved.</p>
                  <p>Powered by Sapo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
