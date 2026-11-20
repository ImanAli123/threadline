"use client";

import { useState } from "react";
import Image from "next/image";

// Optimised photo (resized and converted by Next.js). If it fails to load, the parent's background shows.
export default function RemoteImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 60vw",
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={70}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
