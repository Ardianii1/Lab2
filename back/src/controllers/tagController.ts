import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllTags = async (req: Request, res: Response) => {
   console.log("ALL TAGS HIT");

   try {
      const { storeId } = req.params;
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }

      const tags = await prismadb.tag.findMany({
         where: {
            storeId: storeId,
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
      console.error("Error getting all tags:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getTagId = async (req: Request, res: Response) => {
   console.log("TAGID HIT");
   try {
      const { tagId } = req.params;

      if (!tagId) {
         return res.status(400).json({ message: "Tag Id is required" });
      }
      // return res.status(200).json({message: "hi"})
      const tag = await prismadb.tag.findUnique({
         where: {
            id: tagId,
         },
      });
      res.json(tag);
   } catch (error) {
      console.error("Error getting tag with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createTag = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE TAG]");
      const { name } = req.body;
      const { storeId } = req.params;
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      const tag = await prismadb.tag.create({
         data: {
            name: name,
            storeId: storeId,
         },
      });
      res.status(200).json(tag);
   } catch (error) {
      console.error("Error creating tag:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchTag = async (req: Request, res: Response) => {
   try {
      console.log("[Update TAG]");
      const { name } = req.body;
      const { tagId } = req.params;
      if (!tagId) {
         return res.status(400).json({ message: "TagId is required" });
      }
      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }

      const existingTag = await prismadb.tag.findUnique({
         where: {
            id: tagId,
         },
      });
      if (!existingTag) {
         return res.status(404).json({ message: "Tag not found" });
      }
      const tag = await prismadb.tag.update({
         where: {
            id: tagId,
         },
         data: {
            name,
         },
      });
      res.status(200).json(tag);
   } catch (error) {
      console.error("Error updating tag:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteTag = async (req: Request, res: Response) => {
   try {
      const { tagId } = req.params;
      console.log("[Deleting TAG]  tag:", tagId);
      if (!tagId) {
         return res.status(400).json({ message: "Tag Id is required" });
      }

      const existingTag = await prismadb.tag.findUnique({
         where: {
            id: tagId,
         },
      });
      if (!existingTag) {
         return res.status(404).json({ message: "Tag not found" });
      }
      await prismadb.tag.delete({
         where: {
            id: tagId,
         },
      });

      console.log("TAG", tagId, "DELETED");
      res.status(200).json({ message: "Tag Deleted Successfuly" });
   } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
