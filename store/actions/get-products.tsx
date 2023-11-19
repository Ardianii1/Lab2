import { Product } from "@/lib/types";

import qs from "query-string";

const URL = `http://localhost:3001/api/products/0e473b04-a06e-4624-a439-02d4f6245b2a/allStock?stock=true`;

interface Query {
  categoryId?: string;
  sizeId?: string;
  stock?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      categoryId: query.categoryId,
      sizeId: query.sizeId,
      stock: query.stock,
    },
  });
  const res = await fetch(url);

  return res.json();
};

export default getProducts;
