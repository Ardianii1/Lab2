import { Category } from "@/lib/types";

const URL = `http://localhost:3001/api/categories`;

const getCategory = async (id: string): Promise<Category> => {
  const res = await fetch(`${URL}/${id}`);
  console.log(res.url);
  return res.json();
};

export default getCategory;
