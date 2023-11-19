import express from 'express';
const router = express.Router();
import { getAllStores, createStore, getStoreId, getUserStoreId, patchStoreId, deleteStoreId} from '../controllers/storeController.js';
import { POST } from '../controllers/checkoutController.js';
import { checkAuthorization } from '../middleware.js';


router.post("/:storeId/checkout",POST)

router.get('/', getAllStores);
router.get('/:storeId', getStoreId);
router.get('/user/:userId', getUserStoreId);
router.post('/create', createStore);
router.patch('/update/:storeId',checkAuthorization, patchStoreId);
router.delete('/delete/:storeId',checkAuthorization, deleteStoreId);





export default router;
