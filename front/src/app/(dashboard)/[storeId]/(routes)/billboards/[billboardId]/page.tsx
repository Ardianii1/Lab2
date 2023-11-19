import { getServerSession } from "next-auth";
import { BillboardForm } from "./components/billboard-Form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BillboardPage = async () => {
   const session = (await getServerSession(authOptions)) || {
      user: { email: "", id: "", name: "", role: "" },
   };
   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardForm
               //@ts-ignore
               user={session.user}
            />
         </div>
      </div>
   );
};

export default BillboardPage;
