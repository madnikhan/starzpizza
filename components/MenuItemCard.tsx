"use client";

import { MenuItem, CartItem } from "@/types/menu";
import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { getFoodImage } from "@/lib/menu-images";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCartStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
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
    const cartItem: CartItem = {
      ...item,
      quantity: 1,
      selectedOptions,
    };
    addItem(cartItem);
    setShowModal(false);
    setSelectedOptions({});
  };

  const imageUrl = item.image || getFoodImage(item.id, item.category);
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
              onError={() => setImageError(true)}
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
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
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
                      <span>{choice.label}</span>
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
            <div className="flex gap-3">
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
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

