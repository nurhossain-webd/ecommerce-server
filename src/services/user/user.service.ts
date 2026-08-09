import prisma from "../../lib/prisma.js";

const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};

const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const user = await prisma.user.create({
 data: data,
  });
return user;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  return user;
};

export const userService = {
  getAllUsers,
  createUser,
  getUserById,
};
