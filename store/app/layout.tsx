import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import SessionProvider from "./providers/SessionProvider";
import Navbar from "./components/navbar";
import Footer from './components/footer';
import ModalProvider from "./providers/modal-provider";
import ToastProvider from "./providers/toast-provider";
import NextJsTopLoader from "nextjs-toploader";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <NextJsTopLoader />
        <SessionProvider>
          <ToastProvider />
          <ModalProvider />
          <Navbar />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
