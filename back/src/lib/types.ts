enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    MANAGER = "MANAGER"}


export type User ={
    id:string
    name:string| null,
    password:string| null,
    email:string,
    role:UserRole,
    createdAt:Date,
    updatedAt:Date,
}

export type Attribute = {
    name:string,
    value:string
}

export type Image={
    url:string,
}

export type Product = {
  id: string;
  categoryId: string;
  sizeId: string;
  brandId: string;
  name: string;
  description: string;
  price: number;
  status: string;
  stock: number;
  images: Image[];
  attributes: Attribute[];
  tags: string[];
  userId: string;
};