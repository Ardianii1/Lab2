import express from 'express';
import { createSize, deleteSize, getAllSizes, getSizeId, patchSize } from '../controllers/sizeController.js';
const router = express.Router();

router.get("/:storeId/all", getAllSizes)
router.get("/:sizeId", getSizeId)
router.post("/:storeId/create", createSize)
router.patch("/:storeId/update/:sizeId", patchSize)
router.delete("/:storeId/delete/:sizeId", deleteSize)

export default router;
