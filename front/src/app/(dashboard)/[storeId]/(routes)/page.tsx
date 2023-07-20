import { auth } from "@clerk/nextjs";
import axios from "axios";

interface DashboardPageProps{
    params:{ storeId:string }
}
const DashboardPage: React.FC<DashboardPageProps>  = async ({params}) =>{
    const { userId } = auth()
    const store = await axios.get(`http://localhost:3001/api/stores/${params.storeId}`, {
    params: {
      userId: userId,
    },
  } )
    return(
        <div>Dashboard
            {store?.data.name}
        </div>
    )
}

export default DashboardPage;