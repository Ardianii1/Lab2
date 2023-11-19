import express from "express";
import { createBrand, deleteBrand, getAllBrands, getBrandId, patchBrand } from "../controllers/brandController.js";
import { checkAuthorization } from "../middleware.js";
const router = express.Router();


router.get("/:storeId/all",getAllBrands)
router.get("/:brandId",getBrandId)
router.post("/:storeId/create",checkAuthorization,createBrand)
router.patch("/:storeId/update/:brandId",checkAuthorization,patchBrand)
router.delete("/:storeId/delete/:brandId",checkAuthorization,deleteBrand)
export default router;
