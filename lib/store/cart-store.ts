import { create } from "zustand";
import { CartItem } from "@/types/menu";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Helper to create unique key for cart items
const getItemKey = (item: CartItem): string => {
  const optionsKey = item.selectedOptions 
    ? JSON.stringify(item.selectedOptions) 
    : '';
  return `${item.id}-${optionsKey}`;
};

export const useCartStore = create<CartStore>()((set, get) => ({
      items: [],
      addItem: (item) => {
        const itemKey = getItemKey(item);
        const existingItem = get().items.find((i) => getItemKey(i) === itemKey);
        
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              getItemKey(i) === itemKey
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (itemKey) => {
        set({ items: get().items.filter((item) => getItemKey(item) !== itemKey) });
      },
      updateQuantity: (itemKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemKey);
        } else {
          set({
            items: get().items.map((item) =>
              getItemKey(item) === itemKey ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    })
);

