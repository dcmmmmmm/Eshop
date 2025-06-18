import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email không tồn tại trong hệ thống" },
        { status: 404 }
      );
    }

    // Tạo reset token
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Lưu reset token vào database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExp: new Date(Date.now() + 3600000) // 1 hour
      }
    });

    // Gửi email reset password
    await sendResetPasswordEmail(email, resetToken);

    return NextResponse.json({
      message: "Email đặt lại mật khẩu đã được gửi"
    });

  } catch (error) {
    console.error("Lỗi forgot password:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}