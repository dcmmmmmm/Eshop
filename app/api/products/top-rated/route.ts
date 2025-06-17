import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function GET() {
  try {
    // Lấy tất cả sản phẩm có đánh giá và tính trung bình rating
    const productsWithAvgRating = await prisma.product.findMany({
      where: {
        status: "AVAILABLE",
        reviews: {
          some: {} // Chỉ lấy sản phẩm có đánh giá
        }
      },
      include: {
        reviews: {
          select: {
            rating: true
          }
        },
        brand: {
          select: {
            name: true,
            slug: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    // Tính trung bình rating và sắp xếp sản phẩm
    const sortedProducts = productsWithAvgRating
      .map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        brand: product.brand,
        category: product.category,
        avgRating: product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      }))
      .sort((a, b) => b.avgRating - a.avgRating) // Sắp xếp giảm dần theo rating
      .slice(0, 10); // Lấy 10 sản phẩm đầu tiên

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm đánh giá cao:', error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}