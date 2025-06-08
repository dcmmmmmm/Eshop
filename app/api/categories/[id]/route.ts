import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const brand = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!brand) {
      return NextResponse.json(
        { message: "Không tìm thấy thương hiệu" },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      { message: "Có lỗi xảy ra" },
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
    const brand = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      { message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Xóa Thương Hiệu Thành công" });
  } catch (error) {
    return NextResponse.json(
      { message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}
