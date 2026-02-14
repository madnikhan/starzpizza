"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Banner } from "@/types/banner";

const defaultSlides = [
  {
    id: "1",
    type: "image" as const,
    url: "https://flipdish-web.imgix.net/br3159/49a514dc476eb48cfd45838455707356.jpeg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Delicious Burgers",
    subtitle: "Handmade with Love",
  },
  {
    id: "2",
    type: "image" as const,
    url: "https://flipdish-web.imgix.net/br3159/f206973bc7f7cdbe41da71f288c5f28a.jpeg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Fresh Pizzas",
    subtitle: "Made to Order",
  },
  {
    id: "3",
    type: "image" as const,
    url: "https://flipdish.imgix.net/bwlqetwkzx7RJ3jz9M2E8GHLU.jpg?w=1200&h=600&fit=crop&auto=format&q=80",
    title: "Smash Burgers",
    subtitle: "Perfectly Smashed",
  },
];

export default function HeroSlideshow() {
  const [slides, setSlides] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          setCurrentSlide(0);
        } else {
          setSlides(
            defaultSlides.map((s) => ({
              id: s.id,
              type: s.type,
              url: s.url,
              title: s.title,
              subtitle: s.subtitle ?? "",
              order: 0,
            }))
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlides(
            defaultSlides.map((s) => ({
              id: s.id,
              type: s.type,
              url: s.url,
              title: s.title,
              subtitle: s.subtitle ?? "",
              order: 0,
            }))
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  if (loading || slides.length === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl mb-12 bg-gray-200 animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl mb-12">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.type === "video" ? (
            <video
              src={slide.url}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              aria-label={slide.title}
            />
          ) : (
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              unoptimized={slide.url.includes("firebasestorage")}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-start pl-8 md:pl-16">
            <div className="text-white max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-xl md:text-2xl text-yellow-200 drop-shadow-md">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
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
        </>
      )}
    </div>
  );
}
