import { NextResponse } from "next/server";

import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
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