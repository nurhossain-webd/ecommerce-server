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

router.post("/", async (req, res) => {
    const data = req.body;
    const review = await reviewService.createReview(data);
    res.json({
        success: true,
        message: "Review created successfully",
        data: review
    });
});

export default router;