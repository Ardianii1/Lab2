import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllCateogries = async (req: Request, res: Response) => {
   console.log("ALL CATEGORIES HIT");

   try {
      const { storeId } = req.params;
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }

      const categories = await prismadb.category.findMany({
         where: {
            storeId: storeId,
         },
         include: {
            billboard: true,
         },
         // orderBy: {
         //   createdAt: 'desc'
         // }
      });
      res.json(categories);
   } catch (error) {
      console.error("Error getting all categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getCategoryId = async (req: Request, res: Response) => {
   console.log("CATEGORYID HIT");
   try {
      const { categoryId } = req.params;

      if (!categoryId) {
         return res.status(400).json({ message: "Category Id is required" });
      }
      // return res.status(200).json({message: "hi"})
      const category = await prismadb.category.findUnique({
         where: {
            id: categoryId,
         },
         include: {
            billboard: true,
         },
      });
      res.json(category);
   } catch (error) {
      console.error("Error getting billboard with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createCategory = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE CATEGORY]");
      const { name, billboardId } = req.body;
      const { storeId } = req.params;

      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      if (!billboardId) {
         return res.status(400).json({ message: "BillboardId is required" });
      }
      const category = await prismadb.category.create({
         data: {
            name: name,
            billboardId: billboardId,
            storeId: storeId,
         },
      });
      res.status(200).json(category);
   } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchCategory = async (req: Request, res: Response) => {
   try {
      console.log("[Update CATEGORY]");
      const { name, billboardId } = req.body;
      const { categoryId } = req.params;
      if (!categoryId) {
         return res.status(400).json({ message: "CategoryId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      if (!billboardId) {
         return res.status(400).json({ message: "BillboardId is required" });
      }
      const categoryIdd = await prismadb.category.findUnique({
         where: {
            id: categoryId,
         },
      });
      if (!categoryIdd) {
         return res.status(404).json({ message: "Category not found" });
      }
      const category = await prismadb.category.update({
         where: {
            id: categoryId,
         },
         data: {
            name,
            billboardId,
         },
      });
      res.status(200).json(category);
   } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteCategory = async (req: Request, res: Response) => {
   try {
      const { categoryId } = req.params;
      console.log("[Deleting CATEGORY]  category:", categoryId);
      if (!categoryId) {
         return res.status(400).json({ message: "CategoryId is required" });
      }
      const categoryIdd = await prismadb.category.findUnique({
         where: {
            id: categoryId,
         },
      });
      if (!categoryIdd) {
         return res.status(404).json({ message: "Category not found" });
      }
      await prismadb.category.delete({
         where: {
            id: categoryId,
         },
      });

      res.status(200).json({ message: "Category deleted successfuly" });
   } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
