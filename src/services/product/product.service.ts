import prisma from "../../lib/prisma.js";

const getAllProducts = async () => {
    const products = await prisma.product.findMany({
        where: {
            isDeleted: false,
        },
         include: {
            category: true,
        }
    });
    return products;
};

const createProduct = async (data: {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: string;
}) => { const product = await prisma.product.create(
        { data });
    return product;
};

const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: id,
            isDeleted: false
        },
        include: {
            category: true,
        }
    });
    return product;
};

const updateProduct = async (
    id: string,
    data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    status?: "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";
    categoryId?: string; }) => {
    const product = await prisma.product.update({
        where: {id},
        data, });
    return product;
};

const deleteProduct = async (id: string) => {
    const product = await prisma.product.update({
        where: {id},
        data: {isDeleted: true},
    });
    return product;
};
   
export const productService = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
}