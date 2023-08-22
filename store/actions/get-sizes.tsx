import { Size } from "@/types";

const URL = `http://localhost:3001/api/sizes/c6fb75eb-9c87-4e21-b25f-f0ef0dbb212d/all`;

const getSizes= async (): Promise<Size[]> => {
    const res= await fetch(URL);
    console.log(res.url)
    return res.json();
};

export default getSizes;