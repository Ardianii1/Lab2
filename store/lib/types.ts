import { StringLiteral } from "typescript";

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
}
export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string;
  brand: {
    id:string,
    name:string
  };
  price: string;
  stock: number;
  size: Size;
  tags: Tag[];
  images: Image[];
  attributes: Attribute[];
}
export interface Image {
  id: string;
  url: string;
}
export interface Size {
  id: string;
  name: string;
  value: string;
}
export interface Tag {
  id: string;
  name: string;
}

export interface Attribute {
  id: string;
  name: string;
  value: string;
 }
