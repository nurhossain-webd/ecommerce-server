import { Router } from "express";
import { reviewService } from "../services/review/review.service.js";
import { auth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { idParamsSchema } from "../validations/common.validation.js";
import {
    createReviewSchema,
    updateReviewSchema,
} from "../validations/review.validation.js";

const router = Router();

router.get("/", async (req, res) => {
    const reviews = await reviewService.getAllReviews(); 
  res.json({
    success: true,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

router.get("/:id", validateRequest({ params: idParamsSchema }), async (req, res) => {
    const id = req.params.id as string;
    const review = await reviewService.getReviewById(id);

    if (!review) {
        return res.status(404).json({
            success: false,
            message: "Review not found"
        });
    }

    res.json({
        success: true,
        message: "Review retrieved successfully",
        data: review
    });
});

router.post("/", auth, authorize("USER"), validateRequest({ body: createReviewSchema }), async (req, res) => {
    const review = await reviewService.createReview(req.user!.id, req.body);
    res.json({
        success: true,
        message: "Review created successfully",
        data: review
    });
});

router.patch("/:id", auth, validateRequest({ params: idParamsSchema, body: updateReviewSchema }), async (req, res) => {
    const id = req.params.id as string;
    const data = req.body;
    const result = await reviewService.updateReview(
        id,
        req.user!.id,
        req.user!.role,
        data
    );

    if (result.status === "notFound") {
        return res.status(404).json({
            success: false,
            message: "Review not found"
        });
    }

    if (result.status === "forbidden") {
        return res.status(403).json({
            success: false,
            message: "You cannot update this review"
        });
    }

    res.json({
        success: true,
        message: "Review updated successfully",
        data: result.data
    });
});

router.delete("/:id", auth, validateRequest({ params: idParamsSchema }), async (req, res) => {
    const id = req.params.id as string;
    const result = await reviewService.deleteReview(
        id,
        req.user!.id,
        req.user!.role
    );

    if (result.status === "notFound") {
        return res.status(404).json({
            success: false,
            message: "Review not found"
        });
    }

    if (result.status === "forbidden") {
        return res.status(403).json({
            success: false,
            message: "You cannot delete this review"
        });
    }

    res.json({
        success: true,
        message: "Review deleted successfully",
        data: result.data
    });
});
export default router;
