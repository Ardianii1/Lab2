import express from "express";
import { createTeam, deleteTeam, getAllTeams, getTeamId, patchTeam } from "../controllers/teamControler.js";
const router = express.Router();

router.get("/all", getAllTeams);
router.get("/:teamId", getTeamId);
router.post("/create", createTeam);
router.patch("/update/:teamId", patchTeam);
router.delete("/delete/:teamId", deleteTeam);
export default router;
