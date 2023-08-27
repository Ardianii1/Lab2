import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";
import { toast } from "react-hot-toast/headless";
import { collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db} from "../app/firebase/firebase";
import { redirect } from "next/navigation";


interface CartStore {
  items: Product[];
  getItems: (userId: string | undefined | null) => void;
  addItem: (data: Product, userId: string | undefined | null) => void;
  removeItem: (id: string, userId: string | undefined | null) => void;
  removeAll: () => void;
  removeAllAfterSuccess: (success:boolean, userId: string | undefined | null) => void;
}
const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      getItems: async (userId: string | undefined | null) => {
        if (userId) {
          const userCartCollection = collection(
            db,
            "cart",
            `${userId}`,
            "products"
          );
          const cartQuerySnapshot = await getDocs(userCartCollection);
          const cartItems = cartQuerySnapshot.docs.map(
            (doc) => doc.data().productData
          );
          set({ items: cartItems });
        }
      },
      addItem: async (data: Product, userId: string | undefined | null) => {
        try {
          if (userId) {
            const userCartCollection = collection(
              db,
              "cart",
              userId,
              "products"
            );
            const cartQuery = query(
              userCartCollection,
              where("productData.id", "==", data.id)
            );
            const cartQuerySnapshot = await getDocs(cartQuery);

            if (!cartQuerySnapshot.empty) {
              alert("Product is already in cart.");
              console.log("Product is already in cart.");
              return;
            }
            await addDoc(userCartCollection, {
              productData: data,
            });
            set({ items: [...get().items, data] });
            alert("Item added to cart.");
          } else {
            redirect("/signin");
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong, try again!");
        }
      },
      removeItem: async (id: string, userId: string | null | undefined) => {
        try {
          if (!userId) {
            return redirect("/signin");
          }

          const userCartCollection = collection(db, "cart", userId, "products");
          const cartQuery = query(
            userCartCollection,
            where("productData.id", "==", id)
          );
          const cartQuerySnapshot = await getDocs(cartQuery);

          if (!cartQuerySnapshot.empty) {
            const docRef = cartQuerySnapshot.docs[0].ref;
            await deleteDoc(docRef);
            alert("Item removed from cart.");
            set({
              items: get().items.filter((item) => item.id !== id),
            });
          } else {
            toast("Product not found in cart.");
          }
        } catch (error) {
          console.error("Error removing item from cart:", error);
          toast.error("Something went wrong, try again!");
        }
      },
      removeAll: () => set({ items: [] }),
      removeAllAfterSuccess: async (
        success: boolean,
        userId: string | undefined | null
      ) => {
        if (success&&userId) {
          try {
            const userCartCollection = collection(db,"cart",userId,"products");
            const cartQuery = query(userCartCollection);

            const cartQuerySnapshot = await getDocs(cartQuery);

            if (!cartQuerySnapshot.empty) {
              const deletionPromises = cartQuerySnapshot.docs.map(
                async (doc) => {
                  await deleteDoc(doc.ref);
                }
              );

              await Promise.all(deletionPromises);

              set({ items: [] });
            }
          } catch (error) {
            console.error("Error removing items from cart:", error);
            toast.error("Something went wrong, try again!");
          }
        } else {
          toast("No items to remove.");
        }
      },
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
