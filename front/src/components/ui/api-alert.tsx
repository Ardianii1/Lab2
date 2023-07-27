import { Server } from "lucide-react"
import { Alert, AlertTitle } from "./alert"

interface ApiAlertProps {
    title:string 
    description: string
    variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> ={
    public: "Public",
    admin: "admin"
}
const variantMap: Record<ApiAlertProps["variant"], string> ={
    public: "secondary",
    admin: "destructive"
}



export const ApiAlert: React.FC<ApiAlertProps> = ({
    title, description, variant
}) =>{
    return(
        <Alert>
            <Server className="h-4 w-4"/>
            <AlertTitle className="flex i">
                {title}
            </AlertTitle>
        </Alert>
    )

}