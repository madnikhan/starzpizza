import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/menu-data";
import Header from "@/components/Header";

// Category images mapping
const categoryImages: Record<string, string> = {
  "smash-burgers": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop&q=80",
  "chicken-burgers": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=400&fit=crop&q=80",
  "pizzas": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&q=80",
  "loaded-fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop&q=80",
  "shakes": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop&q=80",
  "sides": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop&q=80",
  "dips": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop&q=80",
  "tenders": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop&q=80",
  "desserts": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop&q=80",
  "special-boxes": "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=400&fit=crop&q=80",
};

export default function MenuPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Menu</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const imageUrl = categoryImages[category.id] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80";
              return (
                <Link
                  key={category.id}
                  href={`/menu/${category.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                        {category.name}
                      </h2>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

