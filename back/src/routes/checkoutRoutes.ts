import express from "express";
import { POST } from "../controllers/checkoutController.js";


const router = express.Router();

router.post("/",POST)


export default router;
