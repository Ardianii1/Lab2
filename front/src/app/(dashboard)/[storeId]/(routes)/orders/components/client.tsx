"use client"
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator"
import { useParams} from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { formatter } from "@/lib/utils";
import { OrderColumn, columns } from "./columns"
import { format } from "date-fns"
import { DataTable } from "@/components/ui/data-table"

type OrderItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
}
}
type Order = {
  id: string;
  phone: number;
  address: string;
  orderItems: OrderItem[];
  totalPrice: number;
  isPaid:boolean;
  createdAt: Date;
};

const OrderClient = () => {
  const [ordersData, setOrdersData] = useState<Order[] | []>([]); 


  useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/orders/${params.storeId}/all`);
          console.log(response)
  
          if (!response) {
              setOrdersData([])
              return null;
          }
          setOrdersData(response.data);
        } catch (error) {
          console.error('Error fetching store:', error);
        }
      };
  
      fetchOrders();
    }, []);
    const params = useParams()
    
    const formattedOrders: OrderColumn[] = ordersData.map((item) => ({
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
      totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
          return total + Number(item.product.price);
        }, 0)
      ),
      isPaid: item.isPaid,
      createdAt: item.createdAt,//format(item.createdAt, "MMMM do, yyyy"),
    }));


  return (
    <>
        <Heading title={`Orders (${ordersData.length})`} description="Manage orders for your store"/>
        <Separator/>
        <DataTable columns={columns} data={formattedOrders} searchKey="products" />
    </>
  )
}

export default OrderClient