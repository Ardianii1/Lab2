import { getServerSession } from "next-auth";
import { SettingsForm } from "./components/SettingForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const metadata = {
  title: "Settings",
  description: "Settings for the store",
};
export default async function  SettingsPage() {
    const session = (await getServerSession(authOptions)) || { user: { email: '', id: '', name: '', role: '' } };
   //  console.log('settings page:',session?.user?.role)
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm 
                // @ts-ignore
                user={session.user} />
            </div>
        </div>
    )
}
