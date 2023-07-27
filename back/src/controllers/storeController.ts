import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";


// Retrieve all stores
export const getAllStores = async (req:Request, res:Response) => {
  console.log("ALL STORES BEIGN HIT")
  try {
    const {  userId } = req.query;
    console.log(userId)
    const userIdRegex = /^user_(?=(?:[a-zA-Z]*\d){3})(?=\D*\d\D*)(?!.*\d{2})[a-zA-Z0-9]{26}$/;
    if (!userId ) {
      return res.status(401).json({ message: 'Unauthorized' });
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
    // console.log("STORE ID",storeId)
    // console.log("USER ID",userId)
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const store = await prismadb.store.findFirst({
      where:{
        id: storeId,
        // userId: userId
      }
    })

    if (!store) {
      console.log("SORRYYYYyyyy")
      return res.status(404).json({ message: 'Store not found' });
    }
    return res.status(200).json(store);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getUserStoreId = async (req:Request, res:Response) =>{
  console.log("getUserStoreId hit")
  console.log(req.params)
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("USER BEFORE HIT")
    const store = await prismadb.store.findFirst({
      where:{
        userId: userId
      }
    })
    console.log("USER AFTER HIT")

    if (!store) {
      console.log("Store not found")
      return res.status(404).json({ message: 'Store not found' });
    }
    return res.status(200).json(store);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const createStore = async (req:Request, res:Response) => {
  try {
    console.log(req.body)
    const { name, userId } = req.body;
    console.log(req.body)
    if (!userId) {
      console.log("No userId here : Unauthorized")
      return res.status(401).json({ message: 'Unauthorized' });
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

export const patchStoreId = async (req:Request, res:Response) => {
  console.log("UPDATEEEEEE ")
  console.log(req.body)
  try {
    const { storeId } = req.params
    console.log(storeId)
    const { name, userId } = req.body;
    console.log(userId)
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!storeId) {
      console.log("Store not found")
      return res.status(404).json({ message: 'Store not found' });
    }
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const store = await prismadb.store.update({
      where:{
        id: storeId,
        userId:userId,
      },
      data:{
        name
      }
    })
    console.log("STORE UPDATED SUCCESSFULY")
    res.json(store);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    
  }
}

export const deleteStoreId = async (req:Request, res:Response) => {
  console.log("DELETE")
  try {
    const { storeId,  } = req.params
    const { userId } = req.body
  console.log("DELETE store:", storeId, "user:",userId)

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!storeId) {
      console.log("Store not found")
      return res.status(404).json({ message: 'Store not found' });
    }

    const store = await prismadb.store.delete({
      where:{
        id: storeId,
        userId:userId,
      },
    })
    console.log("STORE DELETED")
    res.json(store);

  } catch (error) {
    console.log("Error deleting store", error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}





//BILLBOARDS 

export const getAllBillboards = async (req:Request, res:Response) => {
  try {
    const { storeId } = req.params
    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }

    const billboards = await prismadb.billboard.findMany({
      where:{
        storeId: storeId
      }
    });
    res.json(billboards);
  } catch (error) {
    console.error('Error getting all billboards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getBillboardId = async (req:Request, res:Response) => {
  try {
    const { billboardId } = req.params

    if (!billboardId) {
      return res.status(400).json({ message: 'Billboard Id is required' });
    }
    const billboard = await prismadb.billboard.findUnique({
      where:{
        id: billboardId
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error('Error getting billboard with that id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const createBillboard = async (req:Request, res:Response) => {
  try {
    console.log("[CREATE BILLBOARD]")
    const { label, imageUrl, userId } = req.body;
    const { storeId } = req.params
    if (!userId) {
      console.log("No userId here : Unauthorized")
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }
    if (!label) {
      return res.status(400).json({ message: 'Label is required' });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: 'ImageUrl is required' });
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error('Error creating billboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const patchBillboard = async (req:Request, res:Response) => {
  try {
    console.log("[CREATE BILLBOARD]")
    const { label, imageUrl, userId } = req.body;
    const { billboardId, storeId } = req.params
    if (!userId) {
      console.log("No userId here : Unauthorized")
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!billboardId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }
    if (!label) {
      return res.status(400).json({ message: 'Label is required' });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: 'ImageUrl is required' });
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

    const billboard = await prismadb.billboard.updateMany({
      where:{
        id: billboardId
      },
      data: {
        label,
        imageUrl,
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error('Error updating billboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteBillboard = async (req:Request, res:Response) => {
  try {
    const { userId } = req.body;
    const { billboardId, storeId } = req.params
    console.log("[Deleting BILLBOARD]  user:", userId )
    if (!userId) {
      console.log("No userId here : Unauthorized")
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!billboardId) {
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
    const billboard = await prismadb.billboard.delete({
      where:{
        id: billboardId
      },
    });
    res.json(billboard);
  } catch (error) {
    console.error('Error deleting billboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
