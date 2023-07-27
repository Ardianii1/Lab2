import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";


// Retrieve all billboards
// export const getAllBillboards = async (req:Request, res:Response) => {
//   console.log("ALL BILLBOARDS BEIGN HIT")
//   try {
//     const {  userId } = req.query;
//     console.log(userId)
//     const userIdRegex = /^user_(?=(?:[a-zA-Z]*\d){3})(?=\D*\d\D*)(?!.*\d{2})[a-zA-Z0-9]{26}$/;
//     if (!userId ) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
//     const billboards = await prismadb.billboard.findMany();
//     res.json(billboards);
//   } catch (error) {
//     console.error('Error retrieving billboards:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// export const getBillboardId = async (req:Request, res:Response) => {
//   console.log("getBillboardId hit")

//   try {
//     const { billboardId } = req.params
//     const { userId } = req.query
//     // console.log("BILLBOARD ID",billboardId)
//     // console.log("USER ID",userId)
//     if (!userId || typeof userId !== "string") {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     const billboard = await prismadb.billboard.findFirst({
//       where:{
//         id: billboardId,
//         // userId: userId
//       }
//     })

//     if (!billboard) {
//       console.log("SORRYYYYyyyy")
//       return res.status(404).json({ message: 'Billboard not found' });
//     }
//     return res.status(200).json(billboard);
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

// export const getUserBillboardId = async (req:Request, res:Response) =>{
//   console.log("getUserBillboardId hit")
//   console.log(req.params)
//   try {
//     const { userId } = req.params;
//     if (!userId) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
//     console.log("USER BEFORE HIT")
//     const billboard = await prismadb.billboard.findFirst({
//       where:{
//         userId: userId
//       }
//     })
//     console.log("USER AFTER HIT")

//     if (!billboard) {
//       console.log("Billboard not found")
//       return res.status(404).json({ message: 'Billboard not found' });
//     }
//     return res.status(200).json(billboard);
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

// Create a new billboard
export const createBillboard = async (req:Request, res:Response) => {
  try {
    console.log(req.body)
    const { label, userId, imageUrl, storeId } = req.body;
    console.log(req.body)
    if (!userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }
    if (!label) {
      return res.status(400).json({ message: 'Label is required' });
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
};

// export const patchBillboardId = async (req:Request, res:Response) => {
//   console.log("UPDATEEEEEE ")
//   console.log(req.body)
//   try {
//     const { billboardId } = req.params
//     console.log(billboardId)
//     const { name, userId } = req.body;
//     console.log(userId)
//     if (!userId || typeof userId !== "string") {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
//     if (!billboardId) {
//       console.log("Billboard not found")
//       return res.status(404).json({ message: 'Billboard not found' });
//     }
//     if (!name) {
//       return res.status(400).json({ message: 'Name is required' });
//     }

//     const billboard = await prismadb.billboard.update({
//       where:{
//         id: billboardId,
//         userId:userId,
//       },
//       data:{
//         name
//       }
//     })
//     console.log("BILLBOARD UPDATED SUCCESSFULY")
//     res.json(billboard);

//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
    
//   }
// }


// export const deleteBillboardId = async (req:Request, res:Response) => {
//   console.log("DELETE")
//   try {
//     const { billboardId } = req.params
//   console.log("DELETE billboard:", billboardId)

//     const { name, userId } = req.body;
//     if (!userId || typeof userId !== "string") {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
//     if (!billboardId) {
//       console.log("Billboard not found")
//       return res.status(404).json({ message: 'Billboard not found' });
//     }
//     if (!name) {
//       return res.status(400).json({ message: 'Name is required' });
//     }

//     const billboard = await prismadb.billboard.delete({
//       where:{
//         id: billboardId,
//         userId:userId,
//       },
//     })
//     res.json(billboard);

//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
