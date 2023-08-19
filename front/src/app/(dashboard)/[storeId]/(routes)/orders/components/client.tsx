"use client"
import { Button } from "@/components/ui/button"
import { Heading } from "../../settings/components/heading"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { OrderColumn, columns } from "./columns"
import { format } from "date-fns"
import { DataTable } from "@/components/ui/data-table"

interface Order {
  id:string
  phone: number;
  address: string;
  totalPrice: number;
  createdAt: Date
}

const OrderClient = () => {
  const [ordersData, setOrdersData] = useState<Order[] | []>([]); 


  useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/stores/${params.storeId}/orders/`);
          console.log(response)
  
          if (!response) {
              setOrdersData([])
              return null;
          }
              // console.log(response.data)
          setOrdersData(response.data);
        } catch (error) {
          console.error('Error fetching store:', error);
        }
      };
  
      fetchOrders();
    }, []);

    const router = useRouter()
    const params = useParams()


    const formattedOrders: OrderColumn[] = ordersData.map((item)=>({
      id: item.id,
      phone: item.phone,
      address:item.address,
      totalPrice: item.totalPrice,
      createdAt: item.createdAt //format(item.createdAt, "dd MM yyyy")
    }))


  return (
    <>
        <div className="flex items-center justify-between">
            <Heading
                title={`Orders (${ordersData.length})`}
                description="Manage orders for your store"
            />
            <Button onClick={() => router.push(`http://localhost:3000/${params.storeId}/orders/new`)} >
                <Plus className="mr-2 h-4 w-4" />
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable columns={columns} data={formattedOrders} searchKey="order" />
        
        
        
        {/* <div>
            { ordersData.map((order) => (
                <div key={order.label}>
                    <p>label: {order.label}</p>
                    <p>id: {order.id}</p>
                </div>
            ))}
        </div> */}
    </>
  )
}

export default OrderClient