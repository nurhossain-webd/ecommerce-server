import prisma from "../../lib/prisma.js";

const getAllUsers = async () => {
  const users = await prisma.user.findMany(
    {where: { isDeleted: false }}
  );

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
    where: { id: id ,
             isDeleted: false
    },
  });
  return user;
};

const updateUser = async (id: string, data:
        { 
         name?: string;
         email?: string;
         }) => {
            const user = await prisma.user.update({
                where: { id: id },
                data: data,
            });
            return user;
        };

const deleteUser = async (id: string) => {
  const user = await prisma.user.update({
    where: { id: id },
    data: { isDeleted: true },
  });
  return user;
};        

export const userService = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
