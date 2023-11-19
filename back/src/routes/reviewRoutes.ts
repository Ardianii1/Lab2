import express from "express";
import { createReview, deleteReview, getAllReviews, getReviewId, patchreview } from "../controllers/reviewController.js";
import { checkAuthorization } from "../middleware.js";

const router = express.Router();


router.get("/:storeId/all",getAllReviews)
router.get("/:reviewId",getReviewId)
router.post("/:storeId/create", checkAuthorization, createReview)
router.patch("/:storeId/update/:reviewId", checkAuthorization, patchreview)
router.delete("/:storeId/delete/:reviewId", checkAuthorization, deleteReview)
export default router;