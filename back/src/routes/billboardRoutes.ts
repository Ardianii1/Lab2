import express from 'express';
import { createBillboard, deleteBillboard, getAllBillboards, getBillboardId, patchBillboard } from '../controllers/billboardController.js';
import { checkAuthorization } from '../middleware.js';
const router = express.Router();



router.get("/:storeId/all", getAllBillboards);
router.get("/:billboardId", getBillboardId);
router.post("/:storeId/create",checkAuthorization, createBillboard);
router.patch("/:storeId/update/:billboardId",checkAuthorization, patchBillboard);
router.delete("/:storeId/delete/:billboardId",checkAuthorization, deleteBillboard);
export default router;
