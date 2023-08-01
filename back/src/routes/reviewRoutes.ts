import express from "express";
import { createReview, deleteReview, getAllReviews, getReviewId, patchreview } from "../controllers/reviewController.js";

const router = express.Router();


router.get("/:storeId/all",getAllReviews)
router.get("/:reviewId",getReviewId)
router.post("/:storeId/create",createReview)
router.patch("/:storeId/update/:reviewId",patchreview)
router.delete("/:storeId/delete/:reviewId",deleteReview)
export default router;