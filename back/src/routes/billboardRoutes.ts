import express from 'express';
import { createBillboard, deleteBillboard, getAllBillboards, getBillboardId, patchBillboard } from '../controllers/billboardController.js';
const router = express.Router();



router.get("/:storeId/all", getAllBillboards);
router.get("/:billboardId", getBillboardId);
router.post("/:storeId/create", createBillboard);
router.patch("/:storeId/update/:billboardId", patchBillboard);
router.delete("/:storeId/delete/:billboardId", deleteBillboard);
export default router;
