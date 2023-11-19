import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllReviews = async (req: Request, res: Response) => {
   console.log("ALL REVIEWS HIT");

   try {
      const { storeId } = req.params;
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }

      const reviews = await prismadb.review.findMany({
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
      res.json(reviews);
   } catch (error) {
      console.error("Error getting all reviews:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getReviewId = async (req: Request, res: Response) => {
   console.log("reviewID HIT");
   try {
      const { reviewId } = req.params;

      if (!reviewId) {
         return res.status(400).json({ message: "review Id is required" });
      }

      const review = await prismadb.review.findUnique({
         where: {
            id: reviewId,
         },
      });
      res.json(review);
   } catch (error) {
      console.error("Error getting review with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createReview = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE review]");
      const { title, content, rating, userId } = req.body;
      const { storeId } = req.params;
      if (!userId) {
         console.log("No userId here : Unauthorized");
         return res.status(401).json({ message: "Unauthorized" });
      }
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }
      if (!title) {
         return res.status(400).json({ message: "Title is required" });
      }
      if (!content) {
         return res.status(400).json({ message: "Content is required" });
      }
      if (!rating) {
         return res.status(400).json({ message: "Rating is required" });
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

      const review = await prismadb.review.create({
         data: {
            title: title,
            content: content,
            rating: rating,
            userId: userId,
            storeId: storeId,
         },
      });
      res.json(review);
   } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchreview = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE review]");
      const { title, content, rating, userId } = req.body;
      const { reviewId, storeId } = req.params;
      if (!userId) {
         console.log("No userId here : Unauthorized");
         return res.status(401).json({ message: "Unauthorized" });
      }
      if (!reviewId) {
         return res.status(400).json({ message: "StoreId is required" });
      }
      if (!title) {
         return res.status(400).json({ message: "name is required" });
      }
      if (!content) {
         return res.status(400).json({ message: "name is required" });
      }
      if (!rating) {
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

      const review = await prismadb.review.updateMany({
         where: {
            id: reviewId,
         },
         data: {
            title,
            content,
            rating,
         },
      });
      res.json(review);
   } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteReview = async (req: Request, res: Response) => {
   try {
      const { userId } = req.body;
      const { reviewId, storeId } = req.params;
      console.log("[Deleting review]  user:", userId);
      if (!userId) {
         console.log("No userId here : Unauthorized");
         return res.status(401).json({ message: "Unauthorized" });
      }
      if (!reviewId) {
         return res.status(400).json({ message: "review Id is required" });
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
      const review = await prismadb.review.deleteMany({
         where: {
            id: reviewId,
         },
      });

      // console.log("review", reviewId, "DELETEDDDDDDDDDDDD");
      res.json(review);
   } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
