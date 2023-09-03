import express from "express";
import { createProduct, deleteProduct, getAllProducts, getAllStockProducts, getProductId, getProductIdStock, patchProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/:storeId/all", getAllProducts);
router.get("/:storeId/allStock", getAllStockProducts);
router.get("/:productId/stock", getProductIdStock);
router.get("/:productId", getProductId);
router.post("/:storeId/create", createProduct);
router.patch("/:storeId/update/:productId", patchProduct);
router.delete("/:storeId/delete/:productId", deleteProduct);
export default router;
