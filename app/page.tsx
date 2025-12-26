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
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to STAR'Z
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Fresh, Handmade Burgers, Pizzas & Shakes
          </p>
        </div>

        {/* Location Section */}
        <div className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Google Maps Embed */}
            <div className="w-full h-[400px] lg:h-[500px]">
              <iframe
                src="https://www.google.com/maps?q=27+Castle+Foregate+Shrewsbury+SY1+2EE&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="STAR'Z Location Map"
              />
            </div>

            {/* Location Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">Visit Us</h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                    <p className="text-gray-600">
                      27 Castle Foregate<br />
                      Shrewsbury SY1 2EE
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone size={24} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                    <a 
                      href="tel:01743362362" 
                      className="text-gray-600 hover:text-primary transition"
                    >
                      01743 362 362
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Opening Hours</h4>
                    <p className="text-gray-600">
                      Sun-Thu: 4PM-1AM<br />
                      Fri-Sat: 4PM-3AM
                    </p>
                  </div>
                </div>

                {/* Directions Button */}
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=27+Castle+Foregate+Shrewsbury+SY1+2EE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition text-center"
                >
                  Get Directions
                </a>
              </div>
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
              style={{ width: 'auto', height: 'auto' }}
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

