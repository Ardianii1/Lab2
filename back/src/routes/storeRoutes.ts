import express from 'express';
const router = express.Router();
import { getAllStores, createStore, getStoreId, getUserStoreId, patchStoreId, deleteStoreId } from '../controllers/storeController.js';


// GET /api/stores
router.get('/', getAllStores);
router.get('/:storeId', getStoreId);
router.patch('/update/:storeId', patchStoreId);
router.delete('/:storeId', deleteStoreId);
router.get('/user/:userId', getUserStoreId);

// POST /api/stores
router.post('/create', createStore);
export default router;
