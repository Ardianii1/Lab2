import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";
import { URL } from "url";

export const getAllProducts = async (req: Request, res: Response) => {
  console.log("ALL PRODUCTS HIT");
  try {
    const { storeId } = req.params;
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
        tags: true,
        category: true,
        brand:true,
        size: true,
        images: true,
        attributes: true,
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

export const getAllStockProducts = async (req:Request, res:Response)=>{
  console.log("ALL STOCK PRODUCTS HIT");
  try {
    const { storeId } = req.params;
    const { searchParams } = new URL("http://localhost:3000/api/" + req.url);
    console.log(searchParams)
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
}

export const getProductIdStock = async (req: Request, res: Response) => {
  console.log("productIDStock HIT");
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "product Id is required" });
    }
    const startTime = Date.now();

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      select:{
        id:true,
        stock:true,
      }
    });
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.log("Time from db", elapsedTime);
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
      include: {
        category:true,
        images: true,
        size:true,
        tags:true,
        attributes: true,
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
    console.log("body", JSON.stringify(req.body));
    const { storeId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!storeId) {
      return res.status(400).json({ message: "StoreId is required" });
    }
    if (!categoryId) {
      return res.status(400).json({ message: "CategoryId is required" });
    }
    if (!brandId) {
      return res.status(400).json({ message: "BrandId is required" });
    }
    if (!sizeId) {
      return res.status(400).json({ message: "SizeId is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }
    if (!stock) {
      return res.status(400).json({ message: "Stock is required" });
    }
    if (!images) {
      return res.status(400).json({ message: "Image is required" });
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
          connect: tags.map((tagId : string) => ({ id: tagId })),
        },
        attributes: {
          createMany: {
            data: attributes,
          },
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
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const patchProduct = async (req: Request, res: Response) => {
  try {
    console.log("[Update product]");
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
    const { productId, storeId } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId)return res.status(400).json({ message: "StoreId is required" });
    if (!storeId)return res.status(400).json({ message: "StoreId is required" });
    if (!categoryId)return res.status(400).json({ message: "CategoryId is required" });
    if (!brandId)return res.status(400).json({ message: "BrandId is required" });
    if (!sizeId)return res.status(400).json({ message: "SizeId is required" });
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }
    if (!stock) {
      return res.status(400).json({ message: "Stock is required" });
    }
    if (!images) {
      return res.status(400).json({ message: "Image is required" });
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

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        stock,
        categoryId,
        brandId,
        sizeId,
        images: {
          deleteMany: {},
        },
        tags:{
          deleteMany:{}
        },
        attributes:{
          deleteMany:{}
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        tags: {
          connect: tags.map((tagId: string) => ({ id: tagId })),
        },
        attributes: {
          createMany: {
            data: attributes,
          },
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
    const { userId } = req.body;
    const { productId, storeId } = req.params;
    console.log("[Deleting product]  user:", userId);
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!productId) {
      return res.status(400).json({ message: "product Id is required" });
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
    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });

    // console.log("product", productId, "DELETEDDDDDDDDDDDD");
    res.json(product);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
