"use client";

import { useState } from "react";
import Image from "next/image";
import GarmentArt from "@/components/ui/GarmentArt";

// Parent element must be `relative` with a fixed aspect ratio.
// Shows the photo when it exists; if the file is missing it draws the garment instead.
export default function ProductImage({
  src,
  alt,
  color = "#141414",
  priority = false,
  className = "",
  hideOnError = false,
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = failedSrc === src;

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 400px"
        className={`object-cover ${className}`}
        onError={() => setFailedSrc(src)}
      />
    );
  }
  if (hideOnError) return null;

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`absolute inset-0 ${className}`}
      style={{ background: `color-mix(in srgb, ${color} 12%, #eae6df)` }}
    >
      <div className="absolute inset-0 p-[12%]">
        <GarmentArt title={alt} color={color} stitch="#9a9288" />
      </div>
    </div>
  );
}
