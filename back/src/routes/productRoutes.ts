import express from "express";
import { createProduct, deleteProduct, deleteProducts, getAllProducts, getAllStockProducts, getProductId, getProductIdStock, patchProduct } from "../controllers/productController.js";
import { checkAuthorization } from "../middleware.js";

const router = express.Router();

router.get("/:storeId/all", getAllProducts);
router.get("/:storeId/allStock", getAllStockProducts);
router.get("/:productId/stock", getProductIdStock);
router.get("/:productId", getProductId);
router.post("/:storeId/create", checkAuthorization, createProduct);
router.patch("/:storeId/update/:productId", checkAuthorization, patchProduct);
router.delete("/:storeId/delete/:productId", checkAuthorization, deleteProduct);
router.delete("/:storeId/deleteMany", deleteProducts);
export default router;
