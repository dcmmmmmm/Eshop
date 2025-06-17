import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token xác thực không được cung cấp" },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    // Tìm user với token xác thực
    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email,
        verifyToken: token,
        isActive: false // Chỉ xác thực cho tài khoản chưa kích hoạt
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true, // Kích hoạt tài khoản
        emailVerified: new Date(), // Cập nhật thời gian xác thực email
        verifyToken: null // Xóa token sau khi xác thực thành công
      }
    });

    return NextResponse.json({
      message: "Xác thực email thành công. Tài khoản của bạn đã được kích hoạt."
    });
  } catch (error) {
    console.error("Lỗi xác thực email:", error);
    return NextResponse.json(
      { error: "Token không hợp lệ hoặc đã hết hạn" },
      { status: 400 }
    );
  }
}