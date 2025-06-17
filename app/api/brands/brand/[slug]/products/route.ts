import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Không tìm thấy thương hiệu" },
        { status: 404 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        brandId: brand.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}