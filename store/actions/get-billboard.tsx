import { Billboard } from "@/lib/types";

const URL = `http://localhost:3001/api/billboards`;

const getBillboards = async (id: string): Promise<Billboard> => {
  const res = await fetch(`${URL}/${id}`);

  return res.json();
};

export default getBillboards;
