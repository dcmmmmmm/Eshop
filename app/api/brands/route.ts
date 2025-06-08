import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// GET: Lấy danh sách tất cả brands
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        products: true,
        categories: {
          include: {
            category: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedBrands = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      image: brand.image,
      description: brand.description,
      categories: brand.categories.map(cate => cate.category.name),
      products: brand.products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        slug: product.slug,
      })),
    }));
    return NextResponse.json(formattedBrands);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách thương hiệu" },
      { status: 500 }
    );
  }
}

// POST: Tạo brand mới
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
    const existingBrand = await prisma.brand.findFirst({
      where: { slug },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo brand mới
    const brand = await prisma.brand.create({
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
