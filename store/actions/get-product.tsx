import { Product } from "@/lib/types";

const URL = `http://localhost:3001/api/products`;

const getProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${URL}/${id}`);
  console.log(res.url);
  return res.json();
};

export default getProduct;
