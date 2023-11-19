import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.email;
  console.log(userId);
  if (!userId) {
    redirect("/signin");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      // userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar user={session.user} />
      {children}
    </>
  );
}
