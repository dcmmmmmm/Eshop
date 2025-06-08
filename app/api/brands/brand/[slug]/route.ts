import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        products:true
      }
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