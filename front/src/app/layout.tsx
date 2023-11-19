// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../providers/theme-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import NextJsTopLoader from "nextjs-toploader";
import { SesionProvider } from "@/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
   title: "Admin Dashboard",
   description: "Admin dashboard for e-comerce stores",
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <SesionProvider>
               <ToastProvider />
               <NextJsTopLoader />
               <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
               >
                  <ModalProvider />
                  {children}
               </ThemeProvider>
            </SesionProvider>
         </body>
      </html>
   );
}
