import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllPlayers = async (req: Request, res: Response) => {
   console.log("ALL PLAYERS HIT");

   try {
      const players = await prismadb.player.findMany({
         include: { team: true },
      });
      res.json(players);
   } catch (error) {
      console.error("Error getting all players:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getPlayerId = async (req: Request, res: Response) => {
   console.log("PLAYERID HIT");
   try {
      const { playerId } = req.params;

      if (!playerId) {
         return res.status(400).json({ message: "Player Id is required" });
      }
      const player = await prismadb.player.findUnique({
         where: {
            id: playerId,
         },
         include: {
            team: true,
         },
      });
      res.json(player);
   } catch (error) {
      console.error("Error getting player with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createPlayer = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE PLAYER]");
      const { name, number, teamId } = req.body;
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }

      const player = await prismadb.player.create({
         data: {
            name: name,
            number: number,
            teamId: teamId,
         },
      });
      res.json(player);
   } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchPlayer = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE PLAYER]");
      const { name, number, teamId } = req.body;
      const { playerId } = req.params;
      if (!playerId) {
         return res.status(400).json({ message: "PlayerId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      const playerByUserId = await prismadb.player.findFirst({
         where: {
            id: playerId,
         },
      });

      if (!playerByUserId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const player = await prismadb.player.updateMany({
         where: {
            id: playerId,
         },
         data: {
            name,
            number,
            teamId,
         },
      });
      res.json(player);
   } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deletePlayer = async (req: Request, res: Response) => {
   try {
      const { playerId } = req.params;
      if (!playerId) {
         return res.status(400).json({ message: "Player Id is required" });
      }
      const storeByUserId = await prismadb.player.findFirst({
         where: {
            id: playerId,
         },
      });
      if (!storeByUserId) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      const player = await prismadb.player.deleteMany({
         where: {
            id: playerId,
         },
      });

      // console.log("PLAYER", playerId, "DELETEDDDDDDDDDDDD");
      res.json(player);
   } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
