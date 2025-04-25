import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Update cart item quantity
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (quantity === undefined || quantity < 1) {
      return NextResponse.json(
        { error: "Valid quantity is required" },
        { status: 400 }
      );
    }

    // Get the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: params.id,
      },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Check if the cart belongs to the user
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if there's enough stock
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 400 }
      );
    }

    // Update the cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: params.id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Error updating cart item" },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: params.id,
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Check if the cart belongs to the user
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Error removing cart item" },
      { status: 500 }
    );
  }
}