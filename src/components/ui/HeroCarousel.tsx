"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel } from "antd";

const HeroCarousel = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth initialization and prevent weird animations on reload
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute inset-0 z-0 transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Carousel
        autoplay={isLoaded} // Only autoplay after component is loaded
        autoplaySpeed={4000} // Slower transition for smoother experience
        dots={true}
        className="h-full"
        fade
        effect="fade"
        pauseOnHover={false}
        pauseOnFocus={false}
      >
        <div className="relative h-[75vh] md:h-[80vh]">
          <Image
            src="/esen-1.jpg"
            alt="ESEN Campus - Image 1"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative h-[75vh] md:h-[80vh]">
          <Image
            src="/esen-2.jpg"
            alt="ESEN Campus - Image 2"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative h-[75vh] md:h-[80vh]">
          <Image
            src="/carlitos.jpeg"
            alt="Carlitos Store - Image 3"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
