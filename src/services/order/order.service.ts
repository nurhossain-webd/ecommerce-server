import prisma from "../../lib/prisma.js";

const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};

const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
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
  data: {
    status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalPrice?: number;
  }
) => {
  const order = await prisma.order.update({
    where: {
      id,
    },
    data,
  });

  return order;
};

const deleteOrder = async (id: string) => {
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
