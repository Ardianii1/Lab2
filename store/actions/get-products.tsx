import { Product } from "@/types";

import qs from "query-string";

const URL = `http://localhost:3001/api/products/c6fb75eb-9c87-4e21-b25f-f0ef0dbb212d/allStock?stock=true`;

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
