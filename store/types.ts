import { StringLiteral } from "typescript";

export interface Billboard {
    id: string;
    label:string;
    imageUrl:string;

};

export interface Category {
    id: string;
    name:string;
    billboard: Billboard;
}
export interface Product {
    id:string;
    category:Category;
    name:string;
    price:string;
    size:Size;
    tags:Tag[]
    images:Image[];
};
export interface Image{
    id:string;
    url:string;
}
export interface Size {
    id:string;
    name:string;
    value:string;
}
export interface Tag {
    id:string;
    name:string;
}