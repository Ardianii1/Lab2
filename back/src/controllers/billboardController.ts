import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";


export const getAllBillboards = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: "StoreId is required" });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: storeId,
      },
    });
    res.json(billboards);
  } catch (error) {
    console.error("Error getting all billboards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBillboardId = async (req: Request, res: Response) => {
  try {
    const { billboardId } = req.params;

    if (!billboardId) {
      return res.status(400).json({ message: "Billboard Id is required" });
    }
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error("Error getting billboard with that id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createBillboard = async (req: Request, res: Response) => {
  try {
    console.log("[CREATE BILLBOARD]");
    const { label, imageUrl, userId } = req.body;
    const { storeId } = req.params;
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!storeId) {
      return res.status(400).json({ message: "StoreId is required" });
    }
    if (!label) {
      return res.status(400).json({ message: "Label is required" });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: "ImageUrl is required" });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error("Error creating billboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const patchBillboard = async (req: Request, res: Response) => {
  try {
    console.log("[CREATE BILLBOARD]");
    const { label, imageUrl, userId } = req.body;
    const { billboardId, storeId } = req.params;
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!billboardId) {
      return res.status(400).json({ message: "StoreId is required" });
    }
    if (!label) {
      return res.status(400).json({ message: "Label is required" });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: "ImageUrl is required" });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error("Error updating billboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBillboard = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { billboardId, storeId } = req.params;
    console.log("[Deleting BILLBOARD]  user:", userId);
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!billboardId) {
      return res.status(400).json({ message: "Billboard Id is required" });
    }
    if (!storeId) {
      return res.status(400).json({ message: "Store Id is required" });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const billboard = await prismadb.billboard.delete({
      where: {
        id: billboardId,
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error("Error deleting billboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
