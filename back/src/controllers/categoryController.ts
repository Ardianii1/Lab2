import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";



export const getAllCateogries = async (req:Request, res:Response) => {
  console.log("ALL CATEGORIES HIT")

  try {
      const { storeId } = req.params
      if (!storeId) {
        return res.status(400).json({ message: 'StoreId is required' });
      }
  
      const categories = await prismadb.category.findMany({
        where:{
          storeId: storeId
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
    console.error('Error getting all categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  
export const getCategoryId = async (req:Request, res:Response) => {
    console.log("CATEGORYID HIT")
    try {
      const { categoryId } = req.params
  
      if (!categoryId) {
        return res.status(400).json({ message: 'Category Id is required' });
      }
      // return res.status(200).json({message: "hi"})
      const category = await prismadb.category.findUnique({
        where:{
          id: categoryId
        },
        include:{
          billboard: true,
        }
      });
      res.json(category);
    } catch (error) {
      console.error('Error getting billboard with that id:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const createCategory = async (req:Request, res:Response) => {
    try {
      console.log("[CREATE CATEGORY]")
      const { name, userId, billboardId } = req.body;
      const { storeId } = req.params
      if (!userId) {
        console.log("No userId here : Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!storeId) {
        return res.status(400).json({ message: 'StoreId is required' });
      }
      if (!name) {
        return res.status(400).json({ message: 'name is required' });
      }
      const storeByUserId = await prismadb.store.findFirst({
        where:{
          id: storeId,
          userId
        }
      })
  
      if (!storeByUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const category = await prismadb.category.create({
        data: {
          name:name,
          billboardId: billboardId,
          storeId: storeId,
        },
      });
      res.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const patchCategory = async (req:Request, res:Response) => {
    try {
      console.log("[CREATE CATEGORY]")
      const { name, userId, billboardId } = req.body;
      const { categoryId, storeId } = req.params
      if (!userId) {
        console.log("No userId here : Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!categoryId) {
        return res.status(400).json({ message: 'StoreId is required' });
      }
      if (!name) {
        return res.status(400).json({ message: 'name is required' });
      }
      const storeByUserId = await prismadb.store.findFirst({
        where:{
          id: storeId,
          userId
        }
      })
  
      if (!storeByUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const category = await prismadb.category.updateMany({
        where:{
          id: categoryId
        },
        data: {
          name,
          billboardId
        },
      });
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const deleteCategory = async (req:Request, res:Response) => {
    try {
      const { userId } = req.body;
      const { categoryId, storeId } = req.params
      console.log("[Deleting CATEGORY]  user:", userId )
      if (!userId) {
        console.log("No userId here : Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!categoryId) {
        return res.status(400).json({ message: 'Billboard Id is required' });
      }
      if (!storeId) {
        return res.status(400).json({ message: 'Store Id is required' });
      }
      const storeByUserId = await prismadb.store.findFirst({
        where:{
          id: storeId,
          userId
        }
      })
      if (!storeByUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const productsInCategory = await prismadb.product.findFirst({
      where: {
        categoryId,
      },
    });

    if (productsInCategory) {
      return res.status(400).json({ message: 'Make sure you delete all products in this category first.' });
    }
      const category = await prismadb.category.deleteMany({
        where:{
          id: categoryId
        },
      });

      console.log("CATEGORY",categoryId,"DELETEDDDDDDDDDDDD")
      res.json(category);
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  