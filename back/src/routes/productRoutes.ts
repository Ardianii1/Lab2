import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductId, patchProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/:storeId/all", getAllProducts);
router.get("/:productId", getProductId);
router.post("/:storeId/create", createProduct);
router.patch("/:storeId/update/:productId", patchProduct);
router.delete("/:storeId/delete/:productId", deleteProduct);
export default router;
