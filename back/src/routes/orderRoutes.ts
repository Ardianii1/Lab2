import express from "express";
import { deleteOrder, getAllOrders, getOrderId, patchOrder } from "../controllers/orderController.js";
const router = express.Router();


router.get("/:storeId/all",getAllOrders)
// router.get("/:orderId",getOrderId)
// router.patch("/:orderId",patchOrder)
// router.delete("/:orderId",deleteOrder)

export default router;
