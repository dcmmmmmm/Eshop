import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password, name, image, role, phone, gender } = await req.json();

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        verifyToken: verificationToken,
        role,
        phone,
        gender,
        isActive: false, // Mặc định tài khoản chưa kích hoạt
        emailVerified: undefined,
        image: image || undefined
      }
    });
    console.log(user)
    // Gửi email xác thực
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản."
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}