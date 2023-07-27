import express from 'express';
import { createCategory, deleteCategory, getAllCateogries, getCategoryId, patchCategory } from '../controllers/categoryController.js';
const router = express.Router();

router.get("/:storeId/all",getAllCateogries)
router.get("/:categoryId",getCategoryId)
router.post("/create", createCategory)
router.patch(":storeId/update/:categoryId", patchCategory)
router.delete("/:storeId/delete/:categoryId",deleteCategory)

export default router;
