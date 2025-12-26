import { MenuItem, CartItem } from "@/types/menu";

/**
 * Calculate the total price of a menu item including selected options
 */
export function calculateItemPrice(
  item: MenuItem,
  selectedOptions?: Record<string, string>
): number {
  let totalPrice = item.price;

  if (!selectedOptions || !item.options) {
    return totalPrice;
  }

  // Add prices of selected options
  item.options.forEach((option) => {
    const selectedChoice = selectedOptions[option.name];
    if (selectedChoice) {
      const choice = option.choices.find((c) => c.label === selectedChoice);
      if (choice && choice.price) {
        totalPrice += choice.price;
      }
    }
  });

  return totalPrice;
}

/**
 * Calculate the total price of a cart item (including options and quantity)
 */
export function calculateCartItemTotal(item: CartItem): number {
  const itemPrice = calculateItemPrice(item, item.selectedOptions);
  return itemPrice * item.quantity;
}

