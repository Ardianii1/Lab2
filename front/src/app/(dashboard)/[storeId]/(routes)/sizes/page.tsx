import SizeClient from './components/client'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const metadata = {
  title: "Sizes",
  description: "Sizes for the store",
};
const SizePage = async() => {
   const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return (
    <div className='flex-col px-4'>
        <div className='flex-1 space-y-4p-8 pt-6'>
            <SizeClient 
            //@ts-ignore
            user={session.user}
            />
        </div>
    </div>
  )
}

export default SizePage