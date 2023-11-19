import { Category } from "@/lib/types";

const URL = `http://localhost:3001/api/categories/0e473b04-a06e-4624-a439-02d4f6245b2a/all`;

const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(URL);
  console.log(res.url);
  return res.json();
};

export default getCategories;
