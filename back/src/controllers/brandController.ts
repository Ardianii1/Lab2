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
      const { name } = req.body;
      const { storeId } = req.params;
      if (!name) {
         return res.status(400).json({ message: "name is required" });
      }
      const brand = await prismadb.brand.create({
         data: {
            name: name,
            storeId: storeId,
         },
      });
      res.status(200).json(brand);
   } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchBrand = async (req: Request, res: Response) => {
   try {
      console.log("[Update BRAND]");
      const { name } = req.body;
      const { brandId } = req.params;
      if (!brandId) {
         return res.status(400).json({ message: "BrandId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }

      const brandIdd = await prismadb.brand.findUnique({
         where: {
            id: brandId,
         },
      });
      if (!brandIdd) {
         return res.status(404).json({ message: "Brand not found" });
      }
      const brand = await prismadb.brand.update({
         where: {
            id: brandId,
         },
         data: {
            name,
         },
      });
      res.status(200).json(brand);
   } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteBrand = async (req: Request, res: Response) => {
   try {
      const { brandId } = req.params;
      console.log("[Deleting BRAND]  brand:", brandId);
      if (!brandId) {
         return res.status(400).json({ message: "Brand Id is required" });
      }

      const brandIdd = await prismadb.brand.findUnique({
         where: {
            id: brandId,
         },
      });
      if (!brandIdd) {
         return res.status(404).json({ message: "Brand not found" });
      }
      await prismadb.brand.deleteMany({
         where: {
            id: brandId,
         },
      });
      res.status(200).json({ message: "Brand deleted successfuly" });
   } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
