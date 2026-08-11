
import prisma from "../../lib/prisma.js";

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        where: {
            isDeleted: false
        }
    });
    return categories;
};

const createCategory = async (data: {name: string}) => {
    const category = await prisma.category.create({
        data: data,
    });
    return category;
};

const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: id,
            isDeleted: false
        },
    });
    return category;
};

const updateCategory = async (
    id: string,
    data:{name?: string;
        status?: "ACTIVE" | "INACTIVE"
    }) => {
    const existingCategory = await prisma.category.findFirst({
        where: { id, isDeleted: false },
    });

    if (!existingCategory) {
        return null;
    }

    const category = await prisma.category.update({
        where: {id},
        data, });
    return category;
};  

const deleteCategory = async (id: string) => {
    const existingCategory = await prisma.category.findFirst({
        where: { id, isDeleted: false },
    });

    if (!existingCategory) {
        return null;
    }

    const category = await prisma.category.update({
        where: {id},
        data: {isDeleted: true},
    });
    return category;
};              
export const categoryService = {
    getAllCategories,
    createCategory, 
    getCategoryById,
    updateCategory,
    deleteCategory,
     
}
