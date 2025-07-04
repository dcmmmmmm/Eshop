import { NextResponse } from "next/server";

import {prisma} from "@/lib/prisma";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'USER'
      },
    }
    );
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}