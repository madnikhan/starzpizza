"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "https://flipdish-web.imgix.net/br3159/49a514dc476eb48cfd45838455707356.jpeg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Delicious Burgers",
    subtitle: "Handmade with Love",
  },
  {
    id: 2,
    image: "https://flipdish-web.imgix.net/br3159/f206973bc7f7cdbe41da71f288c5f28a.jpeg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Fresh Pizzas",
    subtitle: "Made to Order",
  },
  {
    id: 3,
    image: "https://flipdish-web.imgix.net/br3159/b3b18a068405401671f96e12c1188181.jpeg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Creamy Shakes",
    subtitle: "13 Amazing Flavors",
  },
  {
    id: 4,
    image: "https://flipdish-web.imgix.net/br3159/20ba1696c6be30f56bd1dad3b66e6af9.jpeg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Decadent Desserts",
    subtitle: "Sweet Treats for You",
  },
  {
    id: 5,
    image: "https://flipdish.imgix.net/oXbXKcz8bY3HM97sqKwr7zZcHY.jpg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Starz Special",
    subtitle: "Premium Quality",
  },
  {
    id: 6,
    image: "https://flipdish.imgix.net/AIORsHa1pn4aE9SCBAgoIbN5Qrk.jpg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Loaded Fries",
    subtitle: "Irresistible Flavors",
  },
  {
    id: 7,
    image: "https://flipdish.imgix.net/QzZeFRJau6eOGIN8pj5Wf9bDOk.jpg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Chicken Burgers",
    subtitle: "Crispy & Juicy",
  },
  {
    id: 8,
    image: "https://flipdish.imgix.net/bwlqetwkzx7RJ3jz9M2E8GHLU.jpg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Smash Burgers",
    subtitle: "Perfectly Smashed",
  },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl mb-12">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-start pl-8 md:pl-16">
            <div className="text-white max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-yellow-200 drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition backdrop-blur-sm z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition backdrop-blur-sm z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-yellow-400"
                : "w-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

