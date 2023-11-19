import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllSizes = async (req: Request, res: Response) => {
   console.log("ALL SIZES HIT");
   try {
      const { storeId } = req.params;
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }

      const sizes = await prismadb.size.findMany({
         where: {
            storeId: storeId,
         },
         // include: {
         //     products: true,
         // },
         // orderBy: {
         //   createdAt: 'desc'
         // }
      });
      res.status(200).json(sizes);
   } catch (error) {
      console.error("Error getting all sizes:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getSizeId = async (req: Request, res: Response) => {
   console.log("SIZEID HIT");
   try {
      const { sizeId } = req.params;

      if (!sizeId) {
         return res.status(400).json({ message: "Size Id is required" });
      }
      const size = await prismadb.size.findUnique({
         where: {
            id: sizeId,
         },
      });
      res.status(200).json(size);
   } catch (error) {
      console.error("Error getting size with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createSize = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE SIZE]");
      const { name, value } = req.body;
      const { storeId } = req.params;
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      if (!value) {
         return res.status(400).json({ message: "Value is required" });
      }
      const size = await prismadb.size.create({
         data: {
            name: name,
            value: value,
            storeId: storeId,
         },
      });
      res.status(200).json(size);
   } catch (error) {
      console.error("Error creating size:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchSize = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE SIZE]");
      const { name, value } = req.body;
      const { sizeId } = req.params;
      if (!sizeId) {
         return res.status(400).json({ message: "SizeId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      if (!value) {
         return res.status(400).json({ message: "Value is required" });
      }

      const existingSize = await prismadb.size.findUnique({
         where: {
            id: sizeId,
         },
      });
      if (!existingSize) {
         return res.status(404).json({ message: "Size not found" });
      }
      const size = await prismadb.size.update({
         where: {
            id: sizeId,
         },
         data: {
            name,
            value,
         },
      });
      res.status(200).json(size);
   } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteSize = async (req: Request, res: Response) => {
   try {
      const { sizeId } = req.params;
      console.log("[Deleting SIZE]  size:", sizeId);
      if (!sizeId) {
         return res.status(400).json({ message: "Size Id is required" });
      }
      const existingSize = await prismadb.size.findUnique({
         where: {
            id: sizeId,
         },
      });
      if (!existingSize) {
         return res.status(404).json({ message: "Size not found" });
      }
      await prismadb.size.deleteMany({
         where: {
            id: sizeId,
         },
      });

      console.log("SIZE", sizeId, "DELETED");
      res.status(200).json({ message: "Size deleted Successfuly" });
   } catch (error) {
      console.error("Error deleting size:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
