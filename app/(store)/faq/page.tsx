"use client"
import React from 'react';
import Footer from '@/components/store/Footer';
import Navbar from '@/components/store/Navbar';

const faqs = [
  {
    category: 'Thông tin chung',
    questions: [
      {
        q: 'Dola Phone là gì?',
        a: 'Dola Phone là hệ thống bán lẻ điện thoại, máy tính bảng và các phụ kiện công nghệ chính hãng tại Việt Nam. Chúng tôi cam kết mang đến những sản phẩm chất lượng với giá cả cạnh tranh nhất.'
      },
      {
        q: 'Làm thế nào để mua hàng tại Dola Phone?',
        a: 'Bạn có thể mua hàng qua website, gọi hotline 1900 6750 hoặc đến trực tiếp cửa hàng. Chúng tôi hỗ trợ thanh toán đa dạng và giao hàng toàn quốc.'
      }
    ]
  },
  {
    category: 'Sản phẩm & Bảo hành',
    questions: [
      {
        q: 'Sản phẩm có được bảo hành chính hãng không?',
        a: 'Tất cả sản phẩm bán tại Dola Phone đều là hàng chính hãng 100% và được bảo hành theo chính sách của nhà sản xuất.'
      },
      {
        q: 'Thời gian bảo hành là bao lâu?',
        a: 'Thời gian bảo hành tùy thuộc vào từng sản phẩm: iPhone (12 tháng), iPad (12 tháng), Phụ kiện (6-12 tháng).'
      }
    ]
  },
  {
    category: 'Thanh toán & Vận chuyển',
    questions: [
      {
        q: 'Có những hình thức thanh toán nào?',
        a: 'Chúng tôi chấp nhận thanh toán qua: Tiền mặt, Chuyển khoản, Thẻ tín dụng/ghi nợ, Trả góp 0%, COD.'
      },
      {
        q: 'Phí vận chuyển như thế nào?',
        a: 'Miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng. Các đơn hàng khác sẽ tính phí theo khu vực giao hàng.'
      }
    ]
  },
  {
    category: 'Chính sách đổi trả',
    questions: [
      {
        q: 'Thời gian đổi trả sản phẩm là bao lâu?',
        a: 'Quý khách có 7 ngày để đổi trả sản phẩm kể từ ngày nhận hàng nếu sản phẩm còn nguyên vẹn và đầy đủ phụ kiện.'
      },
      {
        q: 'Điều kiện đổi trả như thế nào?',
        a: 'Sản phẩm phải còn nguyên vẹn, đầy đủ phụ kiện, không có dấu hiệu đã qua sử dụng và còn đầy đủ hóa đơn mua hàng.'
      }
    ]
  }
];

export default function FAQPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState(0);
  const [openQuestions, setOpenQuestions] = React.useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    if (openQuestions.includes(index)) {
      setOpenQuestions(openQuestions.filter(i => i !== index));
    } else {
      setOpenQuestions([...openQuestions, index]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>

      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Câu hỏi thường gặp (FAQ)</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Categories */}
            <div className="md:w-1/4">
              <div className="bg-gray-100 rounded-lg p-4">
                {faqs.map((category, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                      activeCategory === index ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(index)}
                  >
                    {category.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="md:w-3/4">
              <div className="space-y-4">
                {faqs[activeCategory].questions.map((faq, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                      onClick={() => toggleQuestion(index)}
                    >
                      <span className="font-medium">{faq.q}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          openQuestions.includes(index) ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openQuestions.includes(index) && (
                      <div className="p-4 bg-gray-50 border-t">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}

