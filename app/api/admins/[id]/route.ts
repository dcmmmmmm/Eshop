import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
        role: "ADMIN"
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}

// Update user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate input data
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Dữ liệu cập nhật không hợp lệ" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
        role: "ADMIN" // Đảm bảo chỉ cập nhật admin
      },
      data: body,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}

// Delete user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: params.id,
        role: "ADMIN" // Đảm bảo chỉ xóa admin
      },
    });

    return NextResponse.json({
      message: "Xóa người dùng thành công",
      user: deletedUser
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}
