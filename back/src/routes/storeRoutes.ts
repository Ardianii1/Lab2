import express from 'express';
const router = express.Router();
import { getAllStores, createStore, getStoreId, getUserStoreId, patchStoreId, deleteStoreId} from '../controllers/storeController.js';
import { POST } from '../controllers/checkoutController.js';



router.post('/create', createStore);
router.get('/', getAllStores);
router.get('/:storeId', getStoreId);
router.patch('/update/:storeId', patchStoreId);
router.delete('/delete/:storeId', deleteStoreId);
router.get('/user/:userId', getUserStoreId);

router.post("/:storeId/checkout",POST)


//Billboard routes >>



export default router;
