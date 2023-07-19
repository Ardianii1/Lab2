import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";


// Retrieve all stores
export const getAllStores = async (req:Request, res:Response) => {
  try {
    const {  userId } = req.body;
    if (!userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const stores = await prismadb.store.findMany();
    res.json(stores);
  } catch (error) {
    console.error('Error retrieving stores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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
