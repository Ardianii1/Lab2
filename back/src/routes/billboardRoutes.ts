import express from 'express';
// import { getAllBillboards } from '../controllers/billboardController.js';
const router = express.Router();
import { 
    // getAllBillboards, 
    createBillboard, 
    // getBillboardId, getUserBillboardId, patchBillboardId, deleteBillboardId 
} from '../controllers/billboardController.js';


// GET /api/billboards
// router.get('/', getAllBillboards);
// router.get('/:billboardId', getBillboardId);
// router.patch('/update/:billboardId', patchBillboardId);
// router.delete('/delete/:billboardId', deleteBillboardId);
// router.get('/user/:userId', getUserBillboardId);

// POST /api/billboards
router.post('/create', createBillboard);
export default router;
