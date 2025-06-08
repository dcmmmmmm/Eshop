import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      shippingInfo,
      items,
      shippingMethod,
      paymentMethod,
      total
    } = await req.json();

    // Tạo đơn hàng mới
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        total,
        shippingMethod,
        paymentMethod,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingDistrict: shippingInfo.district,
        shippingWard: shippingInfo.ward,
        recipientName: shippingInfo.fullName,
        recipientPhone: shippingInfo.phone,
        recipientEmail: shippingInfo.email,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await prisma.cart.delete({
      where: { userId: session.user.id }
    });

    return NextResponse.json({ 
      message: "Đặt hàng thành công",
      orderId: order.id 
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tạo đơn hàng" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Lấy tất cả đơn hàng của người dùng
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
                price: true
              }
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    // Tìm các đơn hàng cần xóa
    const ordersToDelete = orders.filter(order => 
      order.status === 'CANCELLED' || order.status === 'SUCCESS'
    );

    // Xóa từng đơn hàng một để tránh lỗi cascade
    for (const order of ordersToDelete) {
      try {
        // Xóa các items của đơn hàng trước
        await prisma.orderItem.deleteMany({
          where: { orderId: order.id }
        });
        
        // Sau đó xóa đơn hàng
        await prisma.order.delete({
          where: { id: order.id }
        });
      } catch (deleteError) {
        console.error(`Error deleting order ${order.id}:`, deleteError);
        // Tiếp tục với đơn hàng tiếp theo nếu có lỗi
        continue;
      }
    }

    // Chỉ trả về các đơn hàng chưa hoàn thành hoặc hủy
    const activeOrders = orders.filter(order => 
      order.status !== 'CANCELLED' && order.status !== 'DELIVERED'
    );

    // Format dữ liệu trả về
    const formattedOrders = activeOrders.map(order => ({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingDistrict: order.shippingDistrict,
      shippingWard: order.shippingWard,
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      recipientEmail: order.recipientEmail,
      shippingMethod: order.shippingMethod,
      paymentMethod: order.paymentMethod
    }));

    return NextResponse.json(formattedOrders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách đơn hàng' },
      { status: 500 }
    );
  }
}
