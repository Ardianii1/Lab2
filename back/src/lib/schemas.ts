import { z, ZodSchema } from "zod";

export const productSchema = z.object({
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  brandId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1),
  status: z.string().min(1),
  stock: z.number().min(1),
  images: z.array(
    z.object({
      url: z.string(),
    })
  ),
  attributes: z.array(
    z.object({
      name: z.string().min(1),
      value: z.string().min(1),
    })
  ),
  tags: z.array(z.string().min(1)),
  userId: z.string().min(1),
});

export const billboardSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
  storeId: z.string().min(1),
});