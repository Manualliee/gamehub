import { useState, useEffect } from "react";
import Image from "next/image";

interface BackgroundWithBlurProps {
  imageUrls: string[];
}

export default function BackgroundImage({
  imageUrls,
}: BackgroundWithBlurProps) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imageUrls.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [imageUrls]);

  return (
    <div className="relative w-full h-[90vh]">
      {imageUrls.map((url, index) => (
        <Image
          key={index}
          src={url}
          alt={`Background ${index}`}
          fill
          quality={95}
          priority={index === 0} // Ensures the image is loaded as a priority resource
          className={`absolute object-cover mask-t-from-70% mask-b-from-70% mask-l-from-70% mask-r-from-70% ${
            index === currentImage ? "opacity-100" : "opacity-0"
          } transition-opacity duration-1000`}
        />
      ))}
    </div>
  );
}
