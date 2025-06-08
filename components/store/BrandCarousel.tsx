import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface BrandCarouselProps {
  name: string;
  slug: string;
  image: string;
}

export default function BrandCarousel({ name, slug, image }: BrandCarouselProps) {
  return (
    <div>
      <Link href={`/brand/${slug}`} className="block group">
        <div className="relative h-64 rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center p-6">
              <div className="text-center transform transition-all duration-300 group-hover:translate-y-[-8px]">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {name}
                </h3>
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Xem sản phẩm
                </span>
              </div>
            </div>
          </div>
      </Link>
    </div>
  )
}
