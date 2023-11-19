import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";
import { URL } from "url";
import { productSchema } from "../lib/schemas.js";
import { z } from "zod";

export const getAllProducts = async (req: Request, res: Response) => {
   console.log("ALL PRODUCTS HIT");
   try {
      const { storeId } = req.params;
      console.log(storeId);
      const { searchParams } = new URL("http://localhost:3000/api/" + req.url);
      const categoryId = searchParams.get("categoryId") || undefined;
      const sizeId = searchParams.get("sizeId") || undefined;
      const page = parseInt(searchParams.get("page") || "1");
      const pageSize = parseInt(searchParams.get("pageSize") || "10");
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }
      const skip = (page - 1) * pageSize;
      const startTime = Date.now();
      const products = await prismadb.product.findMany({
         where: {
            storeId: storeId,
            categoryId,
            sizeId,
         },
         include: {
            // id: true,
            // name: true,
            // description: true,
            // status: true,
            // price: true,
            // stock: true,
            tags: {
               select: {
                  id: true,
                  name: true,
               },
            },
            category: {
               select: {
                  id: true,
                  name: true,
               },
            },
            brand: {
               select: {
                  id: true,
                  name: true,
               },
            },
            size: {
               select: {
                  id: true,
                  name: true,
               },
            },
            images: {
               select: {
                  id: true,
                  url: true,
               },
            },
            attributes: {
               select: {
                  id: true,
                  name: true,
                  value: true,
               },
            },
         },

         skip,
         take: pageSize,
      });
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      console.log("Time from db", elapsedTime);
      res.json(products);
   } catch (error) {
      console.error("Error getting all products:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getAllStockProducts = async (req: Request, res: Response) => {
   console.log("ALL STOCK PRODUCTS HIT");
   try {
      const { storeId } = req.params;
      const { searchParams } = new URL("http://localhost:3000/api/" + req.url);
      console.log(searchParams);
      const categoryId = searchParams.get("categoryId") || undefined;
      const sizeId = searchParams.get("sizeId") || undefined;
      const stockQueryParam = searchParams.get("stock");
      if (!storeId) {
         return res.status(400).json({ message: "StoreId is required" });
      }

      const stockCondition = stockQueryParam === "true" ? { gt: 0 } : undefined;
      const startTime = Date.now();

      const products = await prismadb.product.findMany({
         where: {
            storeId: storeId,
            categoryId,
            sizeId,
            stock: stockCondition,
         },
         include: {
            tags: true,
            category: true,
            size: true,
            images: true,
            attributes: true,
         },
      });
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      console.log("Time from db", elapsedTime);
      res.json(products);
   } catch (error) {
      console.error("Error getting all products:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getProductIdStock = async (req: Request, res: Response) => {
   console.log("productIDStock HIT");
   try {
      const { productId } = req.params;

      if (!productId) {
         return res.status(400).json({ message: "product Id is required" });
      }
      console.time("Time from DB");
      const product = await prismadb.product.findUnique({
         where: {
            id: productId,
         },
         select: {
            id: true,
            stock: true,
         },
      });
      console.timeEnd("Time from DB");

      res.json(product);
   } catch (error) {
      console.error("Error getting product with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getProductId = async (req: Request, res: Response) => {
   console.log("productID HIT");
   try {
      const { productId } = req.params;

      if (!productId) {
         return res.status(400).json({ message: "product Id is required" });
      }

      const product = await prismadb.product.findUnique({
         where: {
            id: productId,
         },
         select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            brand: {
               select: {
                  id: true,
                  name: true,
               },
            },
            tags: {
               select: {
                  id: true,
                  name: true,
               },
            },
            category: {
               select: {
                  id: true,
                  name: true,
               },
            },
            size: {
               select: {
                  id: true,
                  name: true,
                  value: true,
               },
            },
            images: {
               select: {
                  id: true,
                  url: true,
               },
            },
            attributes: {
               select: {
                  id: true,
                  name: true,
                  value: true,
               },
            },
         },
      });
      res.json(product);
   } catch (error) {
      console.error("Error getting product with that id:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const createProduct = async (req: Request, res: Response) => {
   try {
      console.log("[CREATE product]");
      const { storeId } = req.params;
      const requestBody = productSchema.parse(req.body);
      const {
         categoryId,
         sizeId,
         brandId,
         name,
         description,
         status,
         price,
         stock,
         images,
         tags,
         attributes,
         userId,
      } = requestBody;
      const existingAttributesPromises = attributes.map((attribute) => {
         return prismadb.attribute.findMany({
            where: {
               name: attribute.name,
               value: attribute.value,
            },
         });
      });

      const existingAttributes = await Promise.all(existingAttributesPromises);
      console.log(existingAttributes)

      const product = await prismadb.product.create({
         data: {
            storeId: storeId,
            userId: userId,
            categoryId: categoryId,
            sizeId: sizeId,
            brandId: brandId,
            name: name,
            description: description,
            price: price,
            status: status,
            stock: stock,
            tags: {
               connect: tags.map((tagId: string) => ({ id: tagId })),
            },
            attributes: {
               //@ts-ignore
               connectOrCreate: existingAttributes.map((attribute) => ({
                  //@ts-ignore
                  where: { id: attribute.id },
                  create: attribute,
               })),
            },
            images: {
               createMany: {
                  data: [...images.map((image: { url: string }) => image)],
               },
            },
         },
      });

      res.status(200).json(product);
   } catch (error) {
      if (error instanceof z.ZodError) {
         const fieldErrors: any = {};

         for (const issue of error.issues) {
            // Create custom error messages based on issue types
            switch (issue.code) {
               case "invalid_arguments":
                  fieldErrors[issue.path[0]] = `is required`;
                  break;
               case "invalid_type":
                  fieldErrors[
                     issue.path[0]
                  ] = `should be of type ${issue.expected}`;
                  break;
               case "invalid_enum_value":
                  fieldErrors[
                     issue.path[0]
                  ] = `should be one of [${issue.options.join(", ")}]`;
                  break;
               default:
                  fieldErrors[issue.path[0]] = `is invalid`;
            }
         }

         return res.status(400).json({ error: fieldErrors });
      }

      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const patchProduct = async (req: Request, res: Response) => {
   try {
      console.log("[Update product]");
      const { productId, storeId } = req.params;
      const result = productSchema.parse(req.body);

      const {
         categoryId,
         sizeId,
         brandId,
         name,
         description,
         status,
         price,
         stock,
         images,
         tags,
         attributes,
         userId,
      } = req.body;

      const existingProduct = await prismadb.product.findUnique({
         where: { id: productId },
         select: { attributes: true },
      });

      if (!existingProduct) {
         return res.status(404).json({ message: "Product not found" });
      }

      const existingAttributeIds = existingProduct.attributes.map(
         (attr) => attr.id
      );
      const attributesToAdd = attributes.filter(
         (attr: { id: string; name: string; value: string }) =>
            !existingAttributeIds.includes(attr.id)
      );
      console.log(attributesToAdd);
      const attributesToUpdate = attributes.filter(
         (attr: { id: string; name: string; value: string }) =>
            existingAttributeIds.includes(attr.id)
      );
      // const attributesToRemove = existingProduct.attributes.filter((attr) => !attributes.map((a:{id:string, name:string,value:string}) => a.id).includes(attr.id)
      // );

      await prismadb.product.update({
         where: {
            id: productId,
         },
         data: {
            name,
            description,
            status,
            price,
            stock,
            categoryId,
            brandId,
            sizeId,
            images: {
               deleteMany: {},
            },
            tags: {
               connect: tags.map((tagId: string) => ({ id: tagId })),
            },
            // tags:{
            //   deleteMany:{}
            // },
            // attributes:{
            //   deleteMany:{}
            // },
         },
      });

      const product = await prismadb.product.update({
         where: {
            id: productId,
         },
         data: {
            // tags: {
            //   connect: tags.map((tagId: string) => ({ id: tagId })),
            // },
            attributes: {
               updateMany: attributesToUpdate.map((attr: { id: string }) => ({
                  where: { id: attr.id },
                  data: {
                     /* Update attribute fields here */
                  },
               })),
               // createMany: attributesToAdd.map((attr:{name:string,value:string}) => attr),
               // deleteMany: attributesToRemove.map((attr) => ({ id: attr.id })),
            },
            images: {
               createMany: {
                  data: [...images.map((image: { url: string }) => image)],
               },
            },
         },
      });
      res.json(product);
   } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteProduct = async (req: Request, res: Response) => {
   try {
      const { productId } = req.params;
      console.log("[Deleting product]  product:", productId);
      if (!productId) {
         return res.status(400).json({ message: "ProductId is required" });
      }

      const existingProduct = await prismadb.product.findUnique({
         where: { id: productId },
      });
      if (!existingProduct) {
         return res.status(404).json({ message: "Product not found" });
      }
      await prismadb.product.delete({
         where: {
            id: productId,
         },
      });

      res.status(204).end();
   } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
export const deleteProducts = async (req: Request, res: Response) => {
   try {
      const { productIds } = req.body;
      const {storeId}= req.params
      console.log("[Deleting product]  product:", productIds);
      // if (!productIds) {
      //    return res.status(400).json({ message: "ProductId is required" });
      // }

      // const existingProduct = await prismadb.product.findUnique({
      //    where: { id: productIds },
      // });
      // if (!existingProduct) {
      //    return res.status(404).json({ message: "Product not found" });
      // }
      await prismadb.product.deleteMany({
         where: {
            storeId:storeId,
         //    id: {
         //       in: productIds,
         //    },
         },
      });

      res.status(204).end();
   } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};
