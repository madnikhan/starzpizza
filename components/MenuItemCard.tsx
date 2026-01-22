"use client";

import { MenuItem, CartItem } from "@/types/menu";
import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { getFoodImage } from "@/lib/menu-images";
import { calculateItemPrice } from "@/lib/utils/price-calculator";
import { useIsRestaurantOpen } from "@/hooks/useRestaurantStatus";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCartStore();
  const { isOpen } = useIsRestaurantOpen();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (!isOpen) {
      alert("Sorry, the restaurant is currently closed. We are not accepting orders at this time.");
      return;
    }
    
    if (item.options && item.options.length > 0) {
      setShowModal(true);
    } else {
      const cartItem: CartItem = {
        ...item,
        quantity: 1,
        selectedOptions: {},
      };
      addItem(cartItem);
    }
  };

  const handleConfirmAdd = () => {
    // Calculate the total price including selected options
    const finalPrice = calculateItemPrice(item, selectedOptions);
    
    const cartItem: CartItem = {
      ...item,
      price: finalPrice, // Override price with calculated price including options
      quantity: 1,
      selectedOptions,
    };
    addItem(cartItem);
    setShowModal(false);
    setSelectedOptions({});
  };

  const getImageUrl = () => {
    const url = item.imageUrl || item.image || getFoodImage(item.id, item.category, item.imageUrl);
    // If it's a local path (starts with /), Next.js handles it directly
    // The path should match the filename exactly, including special characters
    return url;
  };

  const imageUrl = getImageUrl();
  const fallbackUrl = `https://via.placeholder.com/400x300/DC2626/FFFFFF?text=${encodeURIComponent(item.name.substring(0, 20))}`;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                console.error('Image failed to load:', imageUrl);
                setImageError(true);
              }}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-gray-400 text-4xl">
                {item.category === "pizzas" ? "🍕" : 
                 item.category === "shakes" ? "🥤" : 
                 item.category === "desserts" ? "🍰" : 
                 item.category === "sides" ? "🍟" : "🍔"}
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">£{item.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              disabled={!isOpen}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!isOpen ? "Restaurant is currently closed" : "Add to cart"}
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      {showModal && item.options && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{item.name}</h3>
            {item.options.map((option, index) => (
              <div key={index} className="mb-6">
                <label className="block font-semibold mb-2">{option.name}</label>
                <div className="space-y-2">
                  {option.choices.map((choice, choiceIndex) => (
                    <label
                      key={choiceIndex}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={option.name}
                        value={choice.label}
                        checked={selectedOptions[option.name] === choice.label}
                        onChange={(e) =>
                          setSelectedOptions({ ...selectedOptions, [option.name]: e.target.value })
                        }
                        className="mr-3"
                      />
                      <span className="flex-1">{choice.label}</span>
                      {choice.price && (
                        <span className="ml-auto text-primary font-semibold">
                          +£{choice.price.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {/* Display total price with selected options */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Price:</span>
                <span className="text-2xl font-bold text-primary">
                  £{calculateItemPrice(item, selectedOptions).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOptions({});
                }}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdd}
                disabled={!isOpen}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isOpen ? "Restaurant Closed" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

