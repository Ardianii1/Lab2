import { Category } from "@/types";

const URL = `http://localhost:3001/api/categories/c6fb75eb-9c87-4e21-b25f-f0ef0dbb212d/all`;

const getCategories= async (): Promise<Category[]> => {
    const res= await fetch(URL);
    console.log(res.url)
    return res.json();
};

export default getCategories;