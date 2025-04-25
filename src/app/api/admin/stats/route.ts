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

    // Get statistics
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    
    // Calculate total revenue
    const orders = await prisma.order.findMany();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}