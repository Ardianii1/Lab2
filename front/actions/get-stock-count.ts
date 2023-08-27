import prismadb from "@/lib/prismadb";

interface Product {
  stock: number; // Add other relevant fields
}

export const getStockCount = async (storeId: string): Promise<number> => {
  const products = await prismadb.product.findMany({
    where: {
      storeId,
      stock: {
        gt: 0,
      },
    },
  });

  const totalStockCount = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  return totalStockCount;
};
