import express from 'express';
const router = express.Router();
import { getAllStores, createStore, getStoreId, getUserStoreId, patchStoreId, deleteStoreId, createBillboard, patchBillboard, getAllBillboards, getBillboardId, deleteBillboard } from '../controllers/storeController.js';



router.post('/create', createStore);
router.get('/', getAllStores);
router.get('/:storeId', getStoreId);
router.patch('/update/:storeId', patchStoreId);
router.delete('/delete/:storeId', deleteStoreId);
router.get('/user/:userId', getUserStoreId);



//Billboard routes >>
router.get('/:storeId/billboards', getAllBillboards)
router.get('/billboards/:billboardId', getBillboardId)
router.post('/:storeId/billboards/create', createBillboard)
router.patch('/:storeId/billboards/:billboardId', patchBillboard)
router.delete('/:storeId/billboards/:billboardId', deleteBillboard)


export default router;
