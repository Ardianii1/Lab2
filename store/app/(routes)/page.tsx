// "use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/ui/container";
import getBillboard from "@/actions/get-billboard";
import Billboard from "../components/billboard";
import getProducts from "@/actions/get-products";
import ProductList from "../components/product-list";

export const revalidate = 0;


const HomePage = async () => {
  const products = await getProducts({
    categoryId: "261336e3-c98d-4aba-b569-9e011fe62cd1",
  });
  const billboard = await getBillboard("5af49dfa-872b-43aa-ad29-6c19c86ec49d");
  return (
    <Container>
      <div className="sapce-y-10 pb-10">
        <Billboard data ={billboard}/>
      
      <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
        <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  );
}

export default HomePage;
