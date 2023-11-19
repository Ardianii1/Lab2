import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";
import { billboardSchema } from "../lib/schemas.js";
import { z } from "zod";

export const getAllBillboards = async (req: Request, res: Response) => {
   try {
      const { storeId } = req.params;
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }

      const billboards = await prismadb.billboard.findMany({
         where: {
            storeId: storeId,
         },
      });
      res.json(billboards);
   } catch (error) {
      console.error("Error getting all billboards:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getBillboardId = async (req: Request, res: Response) => {
   try {
      const { billboardId } = req.params;

      if (!billboardId) {
         return res.status(400).json({ message: "Billboard Id is required" });
      }
      const billboard = await prismadb.billboard.findUnique({
         where: {
            id: billboardId,
         },
      });
      res.json(billboard);
   } catch (error) {
      console.error("Error getting billboard with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createBillboard = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE BILLBOARD]");
      const { storeId } = req.params;
      console.log(storeId)
      
      // const result = billboardSchema.parse(req.body);
      const { label, imageUrl } = req.body;
      if (!label) {
         return res.status(400).json({ message: "Label is required" });
      }
      if (!imageUrl) {
         return res.status(400).json({ message: "ImageUrl is required" });
      }

      const billboard = await prismadb.billboard.create({
         data: {
            label,
            imageUrl,
            storeId,
         },
      });
      return res.status(200).json(billboard);
   } catch (error) {
      if (error instanceof z.ZodError) {
         const fieldErrors: any = {};

         for (const issue of error.issues) {
            switch (issue.code) {
               case "invalid_arguments":
                  fieldErrors[issue.path[0]] = `is required`;
                  break;
               case "invalid_type":
                  fieldErrors[issue.path[0]] = `should be of type ${issue.expected}`;
                  break;
               case "invalid_enum_value":
                  fieldErrors[issue.path[0]] = `should be one of [${issue.options.join(", ")}]`;
                  break;
               default:
                  fieldErrors[issue.path[0]] = `is invalid`;
            }
         }

         return res.status(400).json({ error: fieldErrors });
      }
      console.error("Error creating billboard:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchBillboard = async (req: Request, res: Response) => {
   try {
      console.log("[Update BILLBOARD]");
      const { label, imageUrl } = req.body;
      const { billboardId } = req.params;

      if (!billboardId) {
         return res.status(400).json({ message: "BillboardId is required" });
      }
      if (!label) {
         return res.status(400).json({ message: "Label is required" });
      }
      if (!imageUrl) {
         return res.status(400).json({ message: "ImageUrl is required" });
      }

      const billboardIdd = await prismadb.billboard.findUnique({
         where: {
            id: billboardId,
         },
      });
      if (!billboardIdd) {
         return res.status(404).json({ message: "Billboard not found" });
      }
      const billboard = await prismadb.billboard.update({
         where: {
            id: billboardId,
         },
         data: {
            label,
            imageUrl,
         },
      });
      res.status(200).json(billboard);
   } catch (error) {
      console.error("Error updating billboard:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteBillboard = async (req: Request, res: Response) => {
   try {
      const { billboardId, storeId } = req.params;
      console.log("[Deleting BILLBOARD]  billboard:", billboardId);
      if (!billboardId) {
         return res.status(400).json({ message: "BillboardId is required" });
      }
         await prismadb.billboard.delete({
            where: {
               id: billboardId,
               storeId: storeId,
            },
         });
         res.status(200).json({ message: "Billboard deleted successfully" });
   } catch (error) {
      console.error("Error deleting billboard:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
