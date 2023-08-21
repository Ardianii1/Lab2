"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/ui/container";
import getBillboard from "@/actions/get-billboard";
import Billboard from "../components/billboard";

export const revalidate = 0;


const HomePage = async () => {
  const billboard= await getBillboard()
  return (
    <Container>
      <div className="sapce-y-10 pb-10">
        <Billboard data ={billboard}/>
      </div>
    </Container>
  );
}

export default HomePage;
