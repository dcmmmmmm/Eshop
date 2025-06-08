/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// GET: Lấy danh sách tất cả danh mục
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
        brands: {
          include: {
            brand: true,
          }
        },
      },
    });
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description,
      brands: category.brands.map(b => b.brand.name),
      products: category.products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        slug: product.slug,
      })),
    }));
    return NextResponse.json(formattedCategories);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách thương hiệu" },
      { status: 500 }
    );
  }
}

// POST: Tạo danh mục mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image, slug } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Tên và slug là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra slug đã tồn tại chưa
    const existingBrand = await prisma.category.findFirst({
      where: { slug },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      );
    }

    
    const brand = await prisma.category.create({
      data: {
        name,
        description,
        image,
        slug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Lỗi khi tạo thương hiệu:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo thương hiệu" },
      { status: 500 }
    );
  }
}
