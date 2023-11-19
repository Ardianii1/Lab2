"use client";
import { Product } from "@/lib/types";
import Currency from "./ui/currency";
import Button from "./ui/button";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { MouseEventHandler } from "react";
import { useSession } from "next-auth/react";

interface InfoProps {
  data: Product;
}
const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const session = useSession();
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data, session?.data?.user?.email);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={data?.price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-4">
        <div className="flex  gap-x-4">
          <h3 className="font-semibold text-black">Description:</h3>
          <div>{data?.description}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div>{data?.size?.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Tags:</h3>
          <div>{data?.tags?.map((tag) => tag.name).join(", ")}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Brand:</h3>
          <div>{data?.brand?.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Stock:</h3>
          <div>{data?.stock}</div>
        </div>
        {data?.attributes?.length > 0 && data?.attributes[0]?.name != "" ? <div className="flex flex-col gap-x-4">
          <h3 className="font-semibold text-black">Attributes:</h3>
          <div className="">
            {data?.attributes.map((attribute) => (
              <div className=""  key={attribute.id}>
                <span className="pt-3">{attribute.name}:</span>
                <span>{attribute.value}</span>
              </div>
            ))}
          </div>
        </div> : null}

        <div className="mt-10 flex items-center gap-x-3">
          <Button onClick={onAddToCart} className="flex items-center gap-x-2">
            Add to Cart
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Info;
