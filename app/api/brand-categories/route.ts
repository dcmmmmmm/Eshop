import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
// GET: Lấy tất cả brand-categories
export async function GET() {
  try {
    const brandCategories = await prisma.brandCategory.findMany({
      include: {
        brand: true,
        category: true,
      },
    })
    return NextResponse.json(brandCategories)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách brand-categories:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách' },
      { status: 500 }
    )
  }
}

// POST: Tạo mới brand-category
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, slug, brandId, categoryId } = body

    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !brandId || !categoryId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Kiểm tra brand và category có tồn tại
    const [brand, category] = await Promise.all([
      prisma.brand.findUnique({ where: { id: brandId } }),
      prisma.category.findUnique({ where: { id: categoryId } })
    ])

    if (!brand || !category) {
      return NextResponse.json(
        { error: 'Brand hoặc Category không tồn tại' },
        { status: 404 }
      )
    }

    // Tạo mới brand-category
    const brandCategory = await prisma.brandCategory.create({
      data: {
        name,
        description,
        slug,
        brandId,
        categoryId
      },
      include: {
        brand: true,
        category: true
      }
    })

    return NextResponse.json(brandCategory)
  } catch (error) {
    console.error('Lỗi khi tạo brand-category:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo brand-category' },
      { status: 500 }
    )
  }
}

// PUT: Cập nhật brand-category
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, description, slug, brandId, categoryId } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID brand-category' },
        { status: 400 }
      )
    }

    // Kiểm tra brand-category có tồn tại
    const existingBrandCategory = await prisma.brandCategory.findUnique({
      where: { id }
    })

    if (!existingBrandCategory) {
      return NextResponse.json(
        { error: 'Brand-category không tồn tại' },
        { status: 404 }
      )
    }

    // Cập nhật brand-category
    const updatedBrandCategory = await prisma.brandCategory.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        brandId,
        categoryId
      },
      include: {
        brand: true,
        category: true
      }
    })

    return NextResponse.json(updatedBrandCategory)
  } catch (error) {
    console.error('Lỗi khi cập nhật brand-category:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật brand-category' },
      { status: 500 }
    )
  }
}

// DELETE: Xóa brand-category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID brand-category' },
        { status: 400 }
      )
    }

    // Kiểm tra brand-category có tồn tại
    const existingBrandCategory = await prisma.brandCategory.findUnique({
      where: { id }
    })

    if (!existingBrandCategory) {
      return NextResponse.json(
        { error: 'Brand-category không tồn tại' },
        { status: 404 }
      )
    }

    // Xóa brand-category
    await prisma.brandCategory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Xóa thành công' })
  } catch (error) {
    console.error('Lỗi khi xóa brand-category:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa brand-category' },
      { status: 500 }
    )
  }
}