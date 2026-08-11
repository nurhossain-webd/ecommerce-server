import prisma from "../../lib/prisma.js";

export class OrderCreationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "OrderCreationError";
  }
}

const getAllOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
      userId: userId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};

const getAllOrdersForAdmin = async () => {
  return prisma.order.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

const updateOrderStatusForAdmin = async (
  id: string,
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) => {
  const existingOrder = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    select: { id: true },
  });

  if (!existingOrder) {
    return null;
  }

  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

const getOrderById = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
      isDeleted: false,
      userId: userId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
};

const createOrder = async (data: {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}) => {
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new OrderCreationError("Order must contain at least one item");
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const productIds = new Set<string>();

  for (const item of data.items) {
    if (!item || !uuidPattern.test(item.productId)) {
      throw new OrderCreationError("Each item must have a valid productId");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new OrderCreationError("Each item quantity must be a positive integer");
    }

    if (productIds.has(item.productId)) {
      throw new OrderCreationError("An order cannot contain duplicate products");
    }

    productIds.add(item.productId);
  }

  const order = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: { in: [...productIds] },
      },
      select: {
        id: true,
        price: true,
        stock: true,
        status: true,
        isDeleted: true,
      },
    });

    const productsById = new Map(
      products.map((product) => [product.id, product])
    );

    const orderItems = data.items.map((item) => {
      const product = productsById.get(item.productId);

      if (!product || product.isDeleted) {
        throw new OrderCreationError("Product not found", 404);
      }

      if (product.status !== "ACTIVE") {
        throw new OrderCreationError("Product is not available");
      }

      if (item.quantity > product.stock) {
        throw new OrderCreationError("Insufficient product stock", 409);
      }

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    for (const item of orderItems) {
      const stockUpdate = await tx.product.updateMany({
        where: {
          id: item.productId,
          isDeleted: false,
          status: "ACTIVE",
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (stockUpdate.count !== 1) {
        throw new OrderCreationError("Insufficient product stock", 409);
      }
    }

    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return tx.order.create({
      data: {
        userId: data.userId,
        totalPrice,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  return order;
};

const updateOrder = async (
  id: string,
  userId: string,
  data: {
    status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  }
) => {
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
  });

  if (!existingOrder) {
    return null;
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: data.status,
    },
  });

  return order;
};

const deleteOrder = async (id: string, userId: string) => {
    const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
  });

  if (!existingOrder) {
    return null;
  } 
 const order = await prisma.order.update({
  where: {
    id,
  },
  data: {
    isDeleted: true,
  },
});

  return order;
};

export const orderService = {
  getAllOrders,
  getAllOrdersForAdmin,
  updateOrderStatusForAdmin,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
