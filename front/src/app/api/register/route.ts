import prismadb from "@/lib/prismadb";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const {email, password,name} = await req.json();
        const existingUser = await prismadb.user.findUnique({
           where: {
              email: email,
           },
        });

        if (existingUser) {
           return new NextResponse(
              JSON.stringify({
                 error: "Email is already in use. Please use a different email.",
              }),
              {
                 status: 400, // Use 400 Bad Request status for client errors
              }
           );
        }
        const hashed = await hash(password,12)
        

        const user = await prismadb.user.create({
            data:{
                email, password:hashed,name
            }
        })
        return NextResponse.json({
            user:{
                name:user.name,
                email:user.email,
            }
        }) 
    } catch (err:any) {
        return new NextResponse(JSON.stringify({
            error:err.message
        }),{
            status:500
        })
    }
}