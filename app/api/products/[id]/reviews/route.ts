import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Lấy tất cả đánh giá của một sản phẩm
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: params.productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách đánh giá" },
      { status: 500 }
    );
  }
}

// POST: Tạo đánh giá mới
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để đánh giá" },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    // Tạo đánh giá mới
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: session.user.id,
        productId: params.id,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bạn đã đánh giá sản phẩm này rồi" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Lỗi khi tạo đánh giá" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật đánh giá
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để chỉnh sửa đánh giá" },
        { status: 401 }
      );
    }

    const { rating, comment, reviewId } = await request.json();

    // Kiểm tra quyền chỉnh sửa
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Không tìm thấy đánh giá" },
        { status: 404 }
      );
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa đánh giá này" },
        { status: 403 }
      );
    }

    // Cập nhật đánh giá
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật đánh giá" },
      { status: 500 }
    );
  }
}

// DELETE: Xóa đánh giá
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để xóa đánh giá" },
        { status: 401 }
      );
    }

    const { reviewId } = await request.json();

    // Kiểm tra quyền xóa
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Không tìm thấy đánh giá" },
        { status: 404 }
      );
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa đánh giá này" },
        { status: 403 }
      );
    }

    // Xóa đánh giá
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Đã xóa đánh giá thành công" });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi xóa đánh giá" },
      { status: 500 }
    );
  }
}