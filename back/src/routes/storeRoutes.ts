import express from 'express';
const router = express.Router();
import { getAllStores, createStore, getStoreId, getUserStoreId, patchStoreId, deleteStoreId} from '../controllers/storeController.js';



router.post('/create', createStore);
router.get('/', getAllStores);
router.get('/:storeId', getStoreId);
router.patch('/update/:storeId', patchStoreId);
router.delete('/delete/:storeId', deleteStoreId);
router.get('/user/:userId', getUserStoreId);



//Billboard routes >>



export default router;
