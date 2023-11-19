import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";
import { checkForAssociatedRecords, findUserWithEmail, isAdmin, isAdminOrManager } from "../auth/authorization.js";

export const getAllStores = async (req: Request, res: Response) => {
   console.log("ALL STORES BEIGN HIT");
   try {
      const stores = await prismadb.store.findMany({
         select: {
            id: true,
            name: true,
         },
      });
      res.status(200).json(stores);
   } catch (error) {
      console.error("Error retrieving stores:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getStoreId = async (req: Request, res: Response) => {
   console.log("getStoreId hit");

   try {
      const { storeId } = req.params;

      const store = await prismadb.store.findFirst({
         where: {
            id: storeId,
            // userId: userId
         },
         select: {
            id: true,
            name: true,
         },
      });

      if (!store) {
         return res.status(404).json({ message: "Store not found" });
      }
      return res.status(200).json(store);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

export const getUserStoreId = async (req: Request, res: Response) => {
   console.log("Get User StoreId Hit");
   console.log(req.params);
   try {
      const { userId } = req.params;
      if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await findUserWithEmail(userId);

      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      console.log("USER BEFORE HIT");
      const store = await prismadb.store.findFirst({
         where: {
            userId: userId,
         },
      });
      console.log("USER AFTER HIT");

      if (!store) {
         console.log("Store not found");
         return res.status(404).json({ message: "Store not found" });
      }
      return res.status(200).json(store);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

export const createStore = async (req: Request, res: Response) => {
   try {
      const { name, userId } = req.body;
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      if (!userId) {
         console.log("No userId here : Unauthorized");
         return res.status(400).json({ message: "UserId is required" });
      }
      const user = await findUserWithEmail(userId);
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      if (!isAdminOrManager(user.role)) {
         return res.status(403).json({ error: "Unauthorized" });
      }
      const store = await prismadb.store.create({
         data: {
            name,
            userId,
         },
      });
      res.status(201).json(store);
   } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchStoreId = async (req: Request, res: Response) => {
   try {
      const { storeId } = req.params;
      const { name } = req.body;
      console.log("Update Store hit, ID: ", storeId);

      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      const store = await prismadb.store.update({
         where: {
            id: storeId,
            // userId:userId,
         },
         data: {
            name,
         },
      });
      console.log("STORE UPDATED SUCCESSFULY");
      res.status(200).json(store);
   } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteStoreId = async (req: Request, res: Response) => {
   try {
      const { storeId } = req.params;
      console.log("Delete StoreId Hit, ID: ", storeId);
      const userid = req.body?.userId;
      if (!userid) {
         console.log("No userId here : Unauthorized");
         return res.status(400).json({ message: "UserId is required" });
      }
      const user = await findUserWithEmail(userid);
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      if (!isAdmin(user.role)) {
         return res.status(403).json({ error: "You are not authorized to perform this action." });

      }
      const hasAssociatedRecords = await checkForAssociatedRecords(storeId);

      if (hasAssociatedRecords) {
         const associatedRecordsMessage = await checkForAssociatedRecords(storeId);
         return res.status(400).json({ error: `Cannot delete store due to associated records: ${associatedRecordsMessage}` });
      }

      await prismadb.store.delete({
         where: {
            id: storeId,
         },
      });
      res.status(200).json({ message: "Store deleted successfully" });
   } catch (error) {
      console.log("Error deleting store", error);
      res.status(500).json({ error: "Failed to delete the store" });
   }
};
