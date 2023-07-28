import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";



export const getAllSizes = async (req:Request, res:Response) => {
  console.log("ALL SIZES HIT")

  try {
      const { storeId } = req.params
      if (!storeId) {
        return res.status(400).json({ message: 'StoreId is required' });
      }
  
      const sizes = await prismadb.size.findMany({
        where:{
          storeId: storeId
        },
        // include: {
        //     billboard: true,
        // },
        // orderBy: {
        //   createdAt: 'desc'
        // }
      });
      res.json(sizes);
  } catch (error) {
    console.error('Error getting all sizes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  
export const getSizeId = async (req:Request, res:Response) => {
    console.log("SIZEID HIT")
    try {
      const { sizeId } = req.params
  
      if (!sizeId) {
        return res.status(400).json({ message: 'Size Id is required' });
      }
      // return res.status(200).json({message: "hi"})
      const size = await prismadb.size.findUnique({
        where:{
          id: sizeId
        },
      });
      res.json(size);
    } catch (error) {
      console.error('Error getting size with that id:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const createSize = async (req:Request, res:Response) => {
    try {
      console.log("[CREATE SIZE]")
      const { name, userId, value } = req.body;
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
  
      const size = await prismadb.size.create({
        data: {
          name:name,
          value: value,
          storeId: storeId
          
        },
      });
      res.json(size);
    } catch (error) {
      console.error('Error creating size:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const patchSize = async (req:Request, res:Response) => {
    try {
      console.log("[CREATE SIZE]")
      const { name, userId, value } = req.body;
      const { sizeId, storeId } = req.params
      if (!userId) {
        console.log("No userId here : Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!sizeId) {
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
  
      const size = await prismadb.size.updateMany({
        where:{
          id: sizeId
        },
        data: {
          name,
          value
        },
      });
      res.json(size);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const deleteSize = async (req:Request, res:Response) => {
    try {
      const { userId } = req.body;
      const { sizeId, storeId } = req.params
      console.log("[Deleting SIZE]  user:", userId )
      if (!userId) {
        console.log("No userId here : Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!sizeId) {
        return res.status(400).json({ message: 'Size Id is required' });
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
      const size = await prismadb.size.deleteMany({
        where:{
          id: sizeId
        },
      });

      console.log("SIZE",sizeId,"DELETEDDDDDDDDDDDD")
      res.json(size);
    } catch (error) {
      console.error('Error deleting size:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  