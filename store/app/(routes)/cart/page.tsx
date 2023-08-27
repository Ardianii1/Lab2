"use client";

import Container from "@/app/components/ui/container";
import useCart from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import Cartitem from "./components/cart-item";
import Summary from "./components/summary";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams?.get("success");
  const cart = useCart();
  const session = useSession();
  const userId = session.data?.user?.email;
  useEffect(() => {
    const onSuccesRemoveAll = () => {
      if (search === "1") {
        cart.removeAllAfterSuccess(true, userId);
      }
    };
    onSuccesRemoveAll();
  }, [userId]);

  useEffect(() => {
    cart.getItems(userId);
  }, [userId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="gb-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="">Shopping cart</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">No items added to cart</p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <Cartitem key={item.id} data={item} />
                ))}
              </ul>
            </div>
            <Summary />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
