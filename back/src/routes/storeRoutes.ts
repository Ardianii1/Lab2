import express from 'express';
const router = express.Router();
import { getAllStores, createStore } from '../controllers/storeController.js';


// GET /api/stores
router.get('/', getAllStores);

// POST /api/stores
router.post('/create', createStore);
export default router;
