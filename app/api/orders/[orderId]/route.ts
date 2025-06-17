import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Kiểm tra quyền admin
    const admin = await prisma.user.findUnique({
      where: { 
        id: session?.user?.id,
        role: 'ADMIN'
      }
    });

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    const { orderId } = params;

    // Kiểm tra đơn hàng tồn tại
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        items: {
          include: {
            product: true
          }
        } 
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Đơn hàng không tồn tại" }, { status: 404 });
    }

    // Cập nhật số lượng sản phẩm khi đơn hàng chuyển sang đang giao hoặc đã giao
    if ((status === "SHIPPING" || status === "DELIVERED") && 
        existingOrder.status !== "SHIPPING" && 
        existingOrder.status !== "DELIVERED") {
      // Cập nhật số lượng sản phẩm trong kho
      for (const item of existingOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật đơn hàng" },
      { status: 500 }
    );
  }
}