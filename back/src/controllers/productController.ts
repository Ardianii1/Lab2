import { Request, Response } from "express";
import prismadb from "../lib/prismadb.js";

export const getAllProducts = async (req: Request, res: Response) => {
  console.log("ALL PRODUCTS HIT");

  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: "StoreId is required" });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
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
        images: true,
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
      userId,
    } = req.body;
    console.log(images)
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
        images: {
          createMany:{
            data:[
              ...images.map((image:{url:string})=> image)
            ]
          }
        }
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
      userId,
    } = req.body;
    const { productId, storeId } = req.params;
    if (!userId) {
      console.log("No userId here : Unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!productId) {
      return res.status(400).json({ message: "StoreId is required" });
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

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        brandId,
        sizeId,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
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
