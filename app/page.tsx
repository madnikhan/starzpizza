import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="STAR'Z Logo"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to STAR'Z
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Fresh, Handmade Burgers, Pizzas & Shakes
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              <span>01743 362 362</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <span>27 Castle Foregate, Shrewsbury SY1 2EE</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              <span>Sun-Thu: 4PM-1AM | Fri-Sat: 4PM-3AM</span>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/menu/smash-burgers"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop&q=80"
                alt="Burgers"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Burgers</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Smash Burgers, Chicken Burgers & More
              </p>
            </div>
          </Link>

          <Link
            href="/menu/pizzas"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&q=80"
                alt="Pizzas"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Pizzas</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">9", 12", 15" - All Your Favorites</p>
            </div>
          </Link>

          <Link
            href="/menu/shakes"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop&q=80"
                alt="Shakes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Shakes</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">13 Delicious Flavors</p>
            </div>
          </Link>

          <Link
            href="/menu/loaded-fries"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop&q=80"
                alt="Loaded Fries"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Loaded Fries</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Vaca, Doner, Chica Fritas</p>
            </div>
          </Link>

          <Link
            href="/menu/sides"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop&q=80"
                alt="Sides"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Sides</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Fries, Wedges, Nuggets & More</p>
            </div>
          </Link>

          <Link
            href="/menu/desserts"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop&q=80"
                alt="Desserts"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Desserts</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Brownies & Cheesecakes</p>
            </div>
          </Link>
        </div>

        {/* Special Offers */}
        <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Order Online & Get 20% Off!</h3>
          <p className="text-lg mb-6">Available on Just Eat, Deliveroo, Uber Eats & Food Hub</p>
          <Link
            href="/menu"
            className="inline-block bg-secondary text-primary px-8 py-3 rounded-lg font-bold text-lg hover:bg-secondary-light transition"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="STAR'Z Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <p className="text-lg font-semibold mb-2">STAR'Z Burger/Pizza & Shakes</p>
          <p className="text-gray-400">27 Castle Foregate, Shrewsbury SY1 2EE</p>
          <p className="text-gray-400 mt-2">Phone: 01743 362 362</p>
          <p className="text-gray-400 mt-4">
            Open 7 Days a Week | Sun-Thu: 4PM-1AM | Fri-Sat: 4PM-3AM
          </p>
        </div>
      </footer>
    </div>
  );
}

