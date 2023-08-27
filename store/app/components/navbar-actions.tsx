"use client";
import { useEffect, useState } from "react";
import Button from "./ui/button";
import { ShoppingBag } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCart();
  const userId = session?.user?.email;
  useEffect(() => {
    session ? cart.getItems(userId) : "";
  }, [userId]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  const handleSignOut = () => {
    signOut();
    cart.removeAll();
    router.push("/");
  };

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>
      {session ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={() => router.push("/api/auth/signin")}>Sign in</button>
      )}
    </div>
  );
};

export default NavbarActions;
