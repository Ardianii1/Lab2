import express from 'express';
const router = express.Router();
import { getAllStores, createStore, getStoreId, getUserStoreId } from '../controllers/storeController.js';


// GET /api/stores
router.get('/', getAllStores);
router.get('/:storeId', getStoreId);
router.get('/user/:userId', getUserStoreId);

// POST /api/stores
router.post('/create', createStore);
export default router;
