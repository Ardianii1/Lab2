import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllOrders = async (req: Request, res: Response) => {
   console.log("ALL ORDERS HIT");

   try {
      const { storeId } = req.params;
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }

      const orders = await prismadb.order.findMany({
         where: {
            storeId: storeId,
         },
         include: {
            orderItems: {
               include: {
                  product: true,
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      });
      res.json(orders);
   } catch (error) {
      console.error("Error getting all orders:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getOrderId = async (req: Request, res: Response) => {
   console.log("ORDERID HIT");
   try {
      const { orderId } = req.params;

      if (!orderId) {
         return res.status(400).json({ message: "Order Id is required" });
      }
      // return res.status(200).json({message: "hi"})
      const order = await prismadb.order.findUnique({
         where: {
            id: orderId,
         },
      });
      res.json(order);
   } catch (error) {
      console.error("Error getting order with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createOrder = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE ORDEr]");
      const { name, userId, value } = req.body;
      const { storeId } = req.params;
      if (!userId) {
         console.log("No userId here : Unauthorized");
         return res.status(401).json({ message: "Unauthorized" });
      }
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "name is required" });
      }
      const storeByUserId = await prismadb.store.findFirst({
         where: {
            id: storeId,
            userId,
         },
      });

      if (!storeByUserId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const order = await prismadb.order.create({
         data: {
            // name:name,
            //value: value,
            storeId: storeId,
         },
      });
      res.json(order);
   } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchOrder = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE ORDEr]");
      const { name, userId, value } = req.body;
      const { orderId, storeId } = req.params;
      if (!userId) {
         console.log("No userId here : Unauthorized");
         return res.status(401).json({ message: "Unauthorized" });
      }
      if (!orderId) {
         return res.status(400).json({ message: "StoreId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "name is required" });
      }
      const storeByUserId = await prismadb.store.findFirst({
         where: {
            id: storeId,
            userId,
         },
      });

      if (!storeByUserId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const order = await prismadb.order.updateMany({
         where: {
            id: orderId,
         },
         data: {
            //name,
            // value
         },
      });
      res.json(order);
   } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteOrder = async (req: Request, res: Response) => {
   try {
      const { userId } = req.body;
      const { orderId, storeId } = req.params;
      console.log("[Deleting ORDEr]  user:", userId);
      if (!userId) {
         console.log("No userId here : Unauthorized");
         return res.status(401).json({ message: "Unauthorized" });
      }
      if (!orderId) {
         return res.status(400).json({ message: "Order Id is required" });
      }
      if (!storeId) {
         return res.status(400).json({ message: "Store Id is required" });
      }
      const storeByUserId = await prismadb.store.findFirst({
         where: {
            id: storeId,
            userId,
         },
      });
      if (!storeByUserId) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      const order = await prismadb.order.deleteMany({
         where: {
            id: orderId,
         },
      });

      console.log("ORDEr", orderId, "DELETEDDDDDDDDDDDD");
      res.json(order);
   } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
