import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";



export const getAllTags = async (req:Request, res:Response) => {
  console.log("ALL TAGS HIT")

  try {
      const { storeId } = req.params
      if (!storeId) {
        return res.status(400).json({ message: 'StoreId is required' });
      }
  
      const tags = await prismadb.tag.findMany({
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
      res.json(tags);
  } catch (error) {
    console.error('Error getting all tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  
export const getTagId = async (req:Request, res:Response) => {
    console.log("TAGID HIT")
    try {
      const { tagId } = req.params
  
      if (!tagId) {
        return res.status(400).json({ message: 'Tag Id is required' });
      }
      // return res.status(200).json({message: "hi"})
      const tag = await prismadb.tag.findUnique({
        where:{
          id: tagId
        },
      });
      res.json(tag);
    } catch (error) {
      console.error('Error getting tag with that id:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const createTag = async (req:Request, res:Response) => {
    try {
      console.log("[CREATE TAG]")
      const { name, userId } = req.body;
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
  
      const tag = await prismadb.tag.create({
        data: {
            name:name,
        storeId: storeId,
        

          
          
          
        },
      });
      res.json(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const patchTag = async (req:Request, res:Response) => {
    try {
      console.log("[CREATE TAG]")
      const { name, userId } = req.body;
      const { tagId, storeId } = req.params
      if (!userId) {
        console.log("No userId here : Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!tagId) {
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
  
      const tag = await prismadb.tag.updateMany({
        where:{
          id: tagId
        },
        data: {
          name,
          
        },
      });
      res.json(tag);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
export const deleteTag = async (req:Request, res:Response) => {
    try {
      const { userId } = req.body;
      const { tagId, storeId } = req.params
      console.log("[Deleting TAG]  user:", userId )
      if (!userId) {
        console.log("No userId here : Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!tagId) {
        return res.status(400).json({ message: 'Tag Id is required' });
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
      const tag = await prismadb.tag.deleteMany({
        where:{
          id: tagId
        },
      });

      console.log("TAG",tagId,"DELETEDDDDDDDDDDDD")
      res.json(tag);
    } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  