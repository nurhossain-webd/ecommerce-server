import prisma from "../../lib/prisma.js";

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
  totalPrice: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}) => {
  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      totalPrice: data.totalPrice,

      orderItems: {
        create: data.items,
      },
    },

   include: {
  orderItems: {
    include: {
      product: true,
    },
  },
}
  });

  return order;
};

const updateOrder = async (
  id: string,
  userId: string,
  data: {
    status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalPrice?: number;
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
    data,
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
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
