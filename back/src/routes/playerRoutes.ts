import express from "express";
import { createPlayer, deletePlayer, getAllPlayers, getPlayerId, patchPlayer } from "../controllers/playerController.js";
const router = express.Router();

router.get("/all", getAllPlayers);
router.get("/:playerId", getPlayerId);
router.post("/create", createPlayer);
router.patch("/update/:playerId", patchPlayer);
router.delete("/delete/:playerId", deletePlayer);
export default router;
