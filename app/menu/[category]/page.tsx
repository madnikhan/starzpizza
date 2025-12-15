import { getMenuItemsByCategory, categories } from "@/lib/menu-data";
import MenuItemCard from "@/components/MenuItemCard";
import Header from "@/components/Header";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const items = getMenuItemsByCategory(params.category);
  const category = categories.find((c) => c.id === params.category);

  if (!category || items.length === 0) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">{category.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

