import express from 'express';
import { createTag, deleteTag, getAllTags, getTagId, patchTag } from '../controllers/tagController.js';
import { checkAuthorization } from '../middleware.js';
const router = express.Router();

router.get("/:storeId/all", getAllTags)
router.get("/:tagId", getTagId)
router.post("/:storeId/create", checkAuthorization,createTag)
router.patch("/:storeId/update/:tagId", checkAuthorization,patchTag)
router.delete("/:storeId/delete/:tagId", checkAuthorization,deleteTag)

export default router;