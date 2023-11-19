import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { useRouter, useParams, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route";

// export { default } from "next-auth/middleware";
export default withAuth(
   function middleware(req) {
      // const session = getServerSession(authOptions)
      // console.log("session-middleware",session)
      const params = useParams();
      const { storeId } = params;
      console.log(storeId)
      if (req.nextUrl.pathname==="/${storeId}/settings" && req.nextauth?.token?.role !== "ADMIN") {
         return redirect(`/user}`)
      }
  },
  {
   callbacks:{
      authorized:(params) =>{
         let {token} = params
         return !!token?.role 
      }
   }
  }   
)
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
// export default authMiddleware({ publicRoutes: ["/api/:path*"] });

export const config = {
   matcher: ["/app/:storeId/:path*", "/app/:storeId/settings", "/app/players"],
};
