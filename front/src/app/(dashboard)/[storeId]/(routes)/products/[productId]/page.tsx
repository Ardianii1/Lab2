import { ProductForm } from "./components/product-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ProductPage = async () => {
   const session = await getServerSession(authOptions);

  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
        //@ts-ignore
        user={session?.user}
        />
      </div>
    </div>
  );
};

export default ProductPage;
