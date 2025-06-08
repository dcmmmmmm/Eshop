import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const brandCategory = await prisma.brandCategory.findUnique({
      where: { id: params.id },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!brandCategory) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục thương hiệu" },
        { status: 404 }
      );
    }

    return NextResponse.json(brandCategory);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, brandId, categoryId } = body;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const updatedBrandCategory = await prisma.brandCategory.update({
      where: { id: params.id },
      data: {
        name,
        description,
        slug,
        brandId,
        categoryId,
      },
    });

    return NextResponse.json(updatedBrandCategory);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật danh mục thương hiệu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.brandCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Xóa danh mục thương hiệu thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Lỗi khi xóa danh mục thương hiệu" },
      { status: 500 }
    );
  }
}