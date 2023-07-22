import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";


// Retrieve all stores
export const getAllStores = async (req:Request, res:Response) => {
  console.log("ALL STORES BEIGN HIT")
  try {
    const {  userId } = req.query;
    console.log(userId)
    const userIdRegex = /^user_(?=(?:[a-zA-Z]*\d){3})(?=\D*\d\D*)(?!.*\d{2})[a-zA-Z0-9]{26}$/;
                        

    // Validate the userId against the regex pattern
    if (!userId ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const stores = await prismadb.store.findMany();
    res.json(stores);
  } catch (error) {
    console.error('Error retrieving stores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStoreId = async (req:Request, res:Response) => {
  console.log("getStoreId hit")

  try {
    const { storeId } = req.params
    const { userId } = req.query
    console.log("STORE ID",storeId)
    console.log("USER ID",userId)
    if (!userId || typeof userId !== "string") {
      return res.status(403).json({ message: 'ardian' });
    }
    const store = await prismadb.store.findFirst({
      where:{
        id: storeId,
        userId: userId
      }
    })
    if (!store) {
      console.log("SORRYYYYyyyy")
      return res.status(404).json({ message: 'Store not found' });
    }
    return res.status(200).json(store);
  } catch (error) {
    console.log(error)
  }
}

export const getUserStoreId = async (req:Request, res:Response) =>{
  console.log("getUserStoreId hit")
  console.log(req.params)
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const store = await prismadb.store.findFirst({
      where:{
        userId: userId
      }
    })
    if (!store) {
      console.log("Store not found")
      return res.status(404).json({ message: 'Store not found' });
    }
    return res.status(200).json(store);
  } catch (error) {
    console.log(error)
  }
}

// Create a new store
export const createStore = async (req:Request, res:Response) => {
  try {
    console.log(req.body)
    const { name, userId } = req.body;
    console.log(req.body)
    if (!userId) {
      console.log("No userId here : Unauthorized")

      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    res.json(store);
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
