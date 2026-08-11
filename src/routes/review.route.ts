import { Router } from "express";
import { reviewService } from "../services/review/review.service.js";

const router = Router();

router.get("/", async (req, res) => {
    const reviews = await reviewService.getAllReviews(); 
  res.json({
    success: true,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
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

router.post("/", async (req, res) => {
    const data = req.body;
    const review = await reviewService.createReview(data);
    res.json({
        success: true,
        message: "Review created successfully",
        data: review
    });
});

router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const review = await reviewService.updateReview(id, data);

    res.json({
        success: true,
        message: "Review updated successfully",
        data: review
    });
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const review = await reviewService.deleteReview(id);

    res.json({
        success: true,
        message: "Review deleted successfully",
        data: review
    });
});
export default router;