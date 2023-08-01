import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllBrands = async (req: Request, res: Response) => {
  console.log("ALL BRANDS HIT");

  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: "StoreId is required" });
    }

    const brands = await prismadb.brand.findMany({
      where: {
        storeId: storeId,
      },
      // include: {
      //     billboard: true,
      // },
      // orderBy: {
      //   createdAt: 'desc'
      // }
    });
    res.json(brands);
  } catch (error) {
    console.error("Error getting all brands:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBrandId = async (req: Request, res: Response) => {
  console.log("BRANDID HIT");
  try {
    const { brandId } = req.params;

    if (!brandId) {
      return res.status(400).json({ message: "Brand Id is required" });
    }
    // return res.status(200).json({message: "hi"})
    const brand = await prismadb.brand.findUnique({
      where: {
        id: brandId,
      },
    });
    res.json(brand);
  } catch (error) {
    console.error("Error getting brand with that id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    console.log("[CREATE BRAND]");
    const { name, userId } = req.body;
    const { storeId } = req.params;
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!storeId) {
      return res.status(400).json({ message: "StoreId is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "name is required" });
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

    const brand = await prismadb.brand.create({
      data: {
        name: name,
        storeId: storeId,
      },
    });
    res.json(brand);
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const patchBrand = async (req: Request, res: Response) => {
  try {
    console.log("[CREATE BRAND]");
    const { name, userId} = req.body;
    const { brandId, storeId } = req.params;
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!brandId) {
      return res.status(400).json({ message: "StoreId is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "name is required" });
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

    const brand = await prismadb.brand.updateMany({
      where: {
        id: brandId,
      },
      data: {
        name,
      },
    });
    res.json(brand);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { brandId, storeId } = req.params;
    console.log("[Deleting BRAND]  user:", userId);
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!brandId) {
      return res.status(400).json({ message: "Brand Id is required" });
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
    const brand = await prismadb.brand.deleteMany({
      where: {
        id: brandId,
      },
    });

    // console.log("BRAND", brandId, "DELETEDDDDDDDDDDDD");
    res.json(brand);
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
