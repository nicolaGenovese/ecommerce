import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error("[ADMIN_CHECK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}