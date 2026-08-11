import prisma from "../../lib/prisma.js";

type UserRole = "USER" | "ADMIN";

const getAllReviews = async () => {
    const reviews = await prisma.review.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            product: {
                select: { id: true, name: true },
            },
            user: {
                select: { id: true, name: true },
            },
        }
    });
    return reviews;
};

const createReview = async (userId: string, data: {
  rating: number;
  comment?: string;
  productId: string;}) => { 
    const review = await prisma.review.create({
        data: {
            rating: data.rating,
            comment: data.comment,
            productId: data.productId,
            userId,
        },
    });
    return review;
};

const getReviewById = async (id: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id: id,
            isDeleted: false
        },
        include: {
            product: {
                select: { id: true, name: true },
            },
            user: {
                select: { id: true, name: true },
            },
        }
    });
    return review;
};

const updateReview = async (
    id: string,
    userId: string,
    role: UserRole,
    data: {rating?: number;
    comment?: string;
}) => {
    const existingReview = await prisma.review.findFirst({
        where: { id, isDeleted: false },
        select: { userId: true },
    });

    if (!existingReview) {
        return { status: "notFound" as const };
    }

    if (role !== "ADMIN" && existingReview.userId !== userId) {
        return { status: "forbidden" as const };
    }

    const review = await prisma.review.update({
        where: {id},
        data: {
            rating: data.rating,
            comment: data.comment,
        },
    });
    return { status: "success" as const, data: review };
};

const deleteReview = async (id: string, userId: string, role: UserRole) => {
    const existingReview = await prisma.review.findFirst({
        where: { id, isDeleted: false },
        select: { userId: true },
    });

    if (!existingReview) {
        return { status: "notFound" as const };
    }

    if (role !== "ADMIN" && existingReview.userId !== userId) {
        return { status: "forbidden" as const };
    }

    const review = await prisma.review.update({
        where: {id},
        data: {isDeleted: true},
    });
    return { status: "success" as const, data: review };
};

export const reviewService = {
    getAllReviews,
    createReview,
    getReviewById,
    updateReview,
    deleteReview
};
