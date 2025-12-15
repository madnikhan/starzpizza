export type OrderType = "takeaway" | "collection" | "delivery";
export type PaymentMethod = "card" | "cash";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  options?: MenuOption[];
  available?: boolean;
}

export interface MenuOption {
  name: string;
  choices: {
    label: string;
    price?: number;
  }[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface Order {
  id: string;
  items: CartItem[];
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  subtotal: number;
  deliveryFee?: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: Date;
  estimatedTime?: number; // in minutes
}

