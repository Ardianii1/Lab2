import express from 'express';
import { createSize, deleteSize, getAllSizes, getSizeId, patchSize } from '../controllers/sizeController.js';
import { checkAuthorization } from '../middleware.js';
const router = express.Router();

router.get("/:storeId/all", getAllSizes)
router.get("/:sizeId", getSizeId)
router.post("/:storeId/create", checkAuthorization,createSize)
router.patch("/:storeId/update/:sizeId", checkAuthorization,patchSize)
router.delete("/:storeId/delete/:sizeId", checkAuthorization,deleteSize)

export default router;
