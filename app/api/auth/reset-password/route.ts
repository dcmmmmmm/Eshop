import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    // Tìm user với token reset và kiểm tra thời hạn
    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email,
        resetToken: token,
        resetTokenExp: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cập nhật mật khẩu và xóa token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null
      }
    });

    return NextResponse.json({
      message: "Đặt lại mật khẩu thành công"
    });

  } catch (error) {
    console.error("Lỗi reset password:", error);
    return NextResponse.json(
      { error: "Token không hợp lệ hoặc đã hết hạn" },
      { status: 400 }
    );
  }
}