import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllTeams = async (req: Request, res: Response) => {
   console.log("ALL TEAMS HIT");

   try {
      const teams = await prismadb.team.findMany({});
      res.json(teams);
   } catch (error) {
      console.error("Error getting all teams:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getTeamId = async (req: Request, res: Response) => {
   console.log("TEAMID HIT");
   try {
      const { teamId } = req.params;

      if (!teamId) {
         return res.status(400).json({ message: "Team Id is required" });
      }
      const team = await prismadb.team.findUnique({
         where: {
            id: teamId,
         },
      });
      res.json(team);
   } catch (error) {
      console.error("Error getting team with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createTeam = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE TEAM]");
      const { name } = req.body;
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }

      const team = await prismadb.team.create({
         data: {
            name: name,
         },
      });
      res.json(team);
   } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchTeam = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE TEAM]");
      const { name } = req.body;
      const { teamId } = req.params;
      if (!teamId) {
         return res.status(400).json({ message: "TeamId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      const teamByUserId = await prismadb.team.findFirst({
         where: {
            id: teamId,
         },
      });

      if (!teamByUserId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const team = await prismadb.team.updateMany({
         where: {
            id: teamId,
         },
         data: {
            name,
         },
      });
      res.json(team);
   } catch (error) {
      console.error("Error updating team:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteTeam = async (req: Request, res: Response) => {
   try {
      const { teamId } = req.params;
      if (!teamId) {
         return res.status(400).json({ message: "Team Id is required" });
      }
      const storeByUserId = await prismadb.team.findFirst({
         where: {
            id: teamId,
         },
      });
      if (!storeByUserId) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      const team = await prismadb.team.deleteMany({
         where: {
            id: teamId,
         },
      });

      // console.log("TEAM", teamId, "DELETEDDDDDDDDDDDD");
      res.json(team);
   } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
