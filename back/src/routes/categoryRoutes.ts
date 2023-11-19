import express from 'express';
import { createCategory, deleteCategory, getAllCateogries, getCategoryId, patchCategory } from '../controllers/categoryController.js';
import { checkAuthorization } from '../middleware.js';
const router = express.Router();

router.get("/:storeId/all",getAllCateogries)
router.get("/:categoryId",getCategoryId)
router.post("/:storeId/create",checkAuthorization, createCategory)
router.patch("/:storeId/update/:categoryId",checkAuthorization, patchCategory)
router.delete("/:storeId/delete/:categoryId",checkAuthorization,deleteCategory)

export default router;
