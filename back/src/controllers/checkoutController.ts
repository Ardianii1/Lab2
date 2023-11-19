import Stripe from "stripe";
import { Request, Response } from "express";
import { stripe } from "../lib/stripe.js";
import prismadb from "../lib/prismadb.js";

const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
   "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
   const response = new Response(JSON.stringify({}), { headers: corsHeaders });
   return response;
}

export async function POST(req: Request, res: Response) {
   res.set(corsHeaders);
   console.log("REQ.BODY", JSON.stringify(req.body));
   const { storeId } = req.params;
   const { productIds } = req.body;
   console.log("PRODUCTS IDS", productIds);
   if (!productIds || productIds.length === 0) {
      return res.status(400).json({ error: "Product ids are required" });
   }

   try {
      const products = await prismadb.product.findMany({
         where: {
            id: {
               in: productIds,
            },
         },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      products.forEach((product) => {
         line_items.push({
            quantity: 1,
            price_data: {
               currency: "USD",
               product_data: {
                  name: product.name,
               },
               unit_amount: Number(product.price) * 100,
            },
         });
      });

      const order = await prismadb.order.create({
         data: {
            storeId: storeId,
            isPaid: false,
            orderItems: {
               create: productIds.map((productId: string) => ({
                  product: {
                     connect: {
                        id: productId,
                     },
                  },
               })),
            },
         },
      });

      const session = await stripe.checkout.sessions.create({
         line_items,
         mode: "payment",
         billing_address_collection: "required",
         payment_method_types: ["card"],
         success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
         cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
         metadata: {
            orderId: order.id,
         },
      });

      return res.json({ url: session.url });
   } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "An error occurred" });
   }
}
