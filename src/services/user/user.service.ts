import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";

const getAllUsers = async () => {
  const users = await prisma.user.findMany(
    {where: { isDeleted: false },
  omit: {
  password: true,}
}
  );

  return users;
};

const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
 const user = await prisma.user.create({
  data: {
    name: data.name,
    email: data.email,
    password: hashedPassword,
  },
  omit: {
    password: true,
  },
});
return user;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id ,
             isDeleted: false
    },
    omit: {
  password: true,
}
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
                omit: {
                    password: true,
                },
              });
            return user;
        };

const deleteUser = async (id: string) => {
  const user = await prisma.user.update({
    where: { id: id },
    data: { isDeleted: true },
    omit: {
      password: true,
    },  
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
