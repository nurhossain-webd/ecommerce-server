import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
      isDeleted: false,
    },
  });

  if (!user) {
    return null;
  }

  const isPasswordMatched = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordMatched) {
    return null;
  }
    const token = jwt.sign({ id: user.id,role: user.role, }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

  return { user:{
     id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, token };
};

export const authService = {
  loginUser,
};
