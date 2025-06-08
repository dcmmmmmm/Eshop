import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = params.orderId;

    // Kiểm tra đơn hàng tồn tại và thuộc về người dùng
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: "PENDING"
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại hoặc không thể hủy" },
        { status: 404 }
      );
    }

    // Cập nhật trạng thái đơn hàng thành đã hủy
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi hủy đơn hàng" },
      { status: 500 }
    );
  }
}