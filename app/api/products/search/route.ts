import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        status: 'AVAILABLE',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        price: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    return NextResponse.json({ error: 'Lỗi khi tìm kiếm sản phẩm' }, { status: 500 });
  }
}