import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function GET( 
  request: Request,
  { params }: { params: { id: string }}) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        brand: true,
      },
    });

    // Check xem có sản phẩm nào không
    if (!product) {
      return NextResponse.json(
        { error: "Không có sản phẩm nào" },
        { status: 404 }
      )
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Xóa Sản phẩm Thành công" });
  } catch (error) {
    return NextResponse.json(
      { message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, params: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id: params.params.id },
      data: {
        name: body.name,
        slug: body.slug,
        price: body.price,
        stock: parseInt(body.stock),
        description: body.description,
        image: body.image,
        status: body.status,
        categoryId: body.categoryId,
        brandId: body.brandId,
      },
    });
    return NextResponse.json(updatedProduct);
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    )
  }
}