import express from "express";
import { createBrand, deleteBrand, getAllBrands, getBrandId, patchBrand } from "../controllers/brandController.js";
const router = express.Router();


router.get("/:storeId/all",getAllBrands)
router.get("/:brandId",getBrandId)
router.post("/:storeId/create",createBrand)
router.patch("/:storeId/update/:brandId",patchBrand)
router.delete("/:storeId/delete/:brandId",deleteBrand)
export default router;
