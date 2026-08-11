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

const getReviewById = async (id: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id: id,
            isDeleted: false
        },
        include: {
            product: true,
            user: true,
        }
    });
    return review;
};

const updateReview = async (
    id: string,
    data: {rating?: number;
    comment?: string;
}) => {
    const review = await prisma.review.update({
        where: {id},
        data, });
    return review;
};

const deleteReview = async (id: string) => {
    const review = await prisma.review.update({
        where: {id},
        data: {isDeleted: true},
    });
    return review;
};

export const reviewService = {
    getAllReviews,
    createReview,
    getReviewById,
    updateReview,
    deleteReview
}
