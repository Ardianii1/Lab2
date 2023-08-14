import express from 'express';
import { createTag, deleteTag, getAllTags, getTagId, patchTag } from '../controllers/tagController.js';
const router = express.Router();

router.get("/:storeId/all", getAllTags)
router.get("/:tagId", getTagId)
router.post("/:storeId/create", createTag)
router.patch("/:storeId/update/:tagId", patchTag)
router.delete("/:storeId/delete/:tagId", deleteTag)

export default router;