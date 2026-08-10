import prisma from "../../lib/prisma.js"

const getAllReviews = async () => {
    const reviews = await prisma.review.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            product: true,
            user: true,
        }
    });
    return reviews;
};

const createReview = async (data: {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;}) => { 
    const review = await prisma.review.create(
        { data });
    return review;
}

export const reviewService = {
    getAllReviews,
    createReview,
}
