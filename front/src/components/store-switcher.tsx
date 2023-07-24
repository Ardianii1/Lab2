"use client"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { useStoreModal  } from "@/hooks/use-store-modal";
import axios from "axios";
import { useState, useEffect } from 'react';
import { useParams,useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { auth, useAuth } from "@clerk/nextjs";

type PopoverTriggerProps=React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface Store {
    id: string;
    name: string;
  }
interface StoreSwitcherProps extends PopoverTriggerProps {
}

export default function StoreSwitcher({
    className,
}:StoreSwitcherProps){
    const [stores, setStores] = useState<Store[]>([]);


    const { userId } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/stores', {
              params: {
                userId: userId,
              },
            });
            setStores(response.data); // Assuming the response data is an array of store objects
          } catch (error) {
            console.error('Error fetching stores:', error);
          }
        };
    
        fetchData();
      }, []);

    const storeModal=useStoreModal();
    const params=useParams();
    const router= useRouter();
    const [open, setOpen] = useState(false)
    
    const formattedItems=stores.map((store)=> ({
            label: store.name,
            value: store.id
    }));
    const currentStore = formattedItems.find((item) => item.value === params.storeId );
    const onStoreSelect = (store: {value: string, label: string})=>{
        setOpen(true)
        router.push(`${store.value}`)
    }
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a store" className={cn("2-[200px] justify-between", className )}>
                    <StoreIcon className="mr-2 h-4 w-4"/>
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..."/>
                        <CommandEmpty>No store found</CommandEmpty>
                        <CommandGroup heading="Stores">
                            
                            {formattedItems.map((store) =>(
                                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className="text-sm">
                                    <StoreIcon className="mr-2 h-4 w-4"/>
                                    {store.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(false)
                                storeModal.onOpen()
                            }} className="cursor-pointer">
                                <PlusCircle className="mr-2 h5 w-5"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};