import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách tất cả sản phẩm
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
      },
    });

    // Check xem có sản phẩm nào không
    if (products.length === 0) {
      return NextResponse.json(
        { error: "Không có sản phẩm nào" },
        { status: 404 }
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, image, description,technicalSpecifications, stock, status, price, categoryId, brandId } = body;
    // Kiểm tra dữ liệu đầu vào
    if (!name || !slug || !image || !description || !stock || !status || !price) {
      return NextResponse.json(
        { error: "Tất cả các trường đều là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra slug đã tồn tại chưa
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo sản phẩm mới
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        image,
        description,
        stock : parseInt(stock),
        status,
        price : parseFloat(price),
        categoryId,
        brandId,
        technicalSpecifications
      },
    });
    console.log(product);
    return NextResponse.json("Thành công");
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo sản phẩm" },
      { status: 500 }
    );
  }

}