import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Kiểm tra quyền admin
    const admin = await prisma.user.findUnique({
      where: { 
        id: session.user.id,
        role: 'ADMIN'
      }
    });

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Lấy tổng số user
    const totalUsers = await prisma.user.count({
      where: { role: 'USER' }
    });

    // Lấy tổng số đơn hàng
    const totalOrders = await prisma.order.count();

    // Tính tổng doanh thu
    const totalSales = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        status: {
          in: ['DELIVERED', 'SHIPPING']
        }
      }
    });

    // Lấy doanh thu theo tháng
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await Promise.all(
      Array.from({ length: 12 }, async (_, month) => {
        const startDate = new Date(currentYear, month, 1);
        const endDate = new Date(currentYear, month + 1, 0);

        const result = await prisma.order.aggregate({
          _sum: {
            total: true
          },
          where: {
            status: {
              in: ['DELIVERED', 'SHIPPING']
            },
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });

        return result._sum.total || 0;
      })
    );

    // Lấy top sản phẩm bán chạy
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });
        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          soldQuantity: item._sum.quantity || 0
        };
      })
    );

    // Lấy người dùng hoạt động gần đây
    const recentUsers = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { total: true }
        }
      },
      orderBy: {
        orders: {
          _count: 'desc'
        }
      },
      take: 5
    });

    const formattedRecentUsers = recentUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      lastOrderAmount: user.orders[0]?.total || 0
    }));

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalSales: totalSales._sum.total || 0,
      monthlyRevenue,
      topProducts: productsWithDetails,
      recentUsers: formattedRecentUsers
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy thống kê" },
      { status: 500 }
    );
  }
}