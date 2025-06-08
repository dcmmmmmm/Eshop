import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ProductCardProps {
  name: string;
  slug: string;
  image: string;
  price: number;
}
export default function ProductCard({ name, slug, image, price }: ProductCardProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
      <Image 
        src={image} 
        alt={name} 
        width={300} 
        height={300} 
        className="object-cover" 
      />
        <div className="p-4">
          <Link href={`/product/${slug}`} className="text-lg font-medium mb-2 line-clamp-1">{name}</Link>
           <p className="text-red-600 font-semibold mb-2">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">Thích</button>
            <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Thêm vào giỏ</button>
          </div>
        </div>
    </div>
  )
}

