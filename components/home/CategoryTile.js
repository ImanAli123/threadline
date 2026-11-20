"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GarmentArt from "@/components/ui/GarmentArt";

export default function CategoryTile({ name, href, image, kind, bg, garment, stitch }) {
  const [failed, setFailed] = useState(false);
  const hasPhoto = image && !failed;

  return (
    <Link
      href={href}
      className={`group relative flex h-80 items-end overflow-hidden rounded-sm p-6 text-alabaster sm:h-[30rem] ${bg}`}
    >
      {hasPhoto ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={75}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/10 to-transparent" />
        </>
      ) : (
        <div className="absolute right-0 top-2 h-[78%] w-4/5 p-4 transition-transform duration-500 group-hover:-rotate-3">
          <GarmentArt kind={kind} color={garment} stitch={stitch} />
        </div>
      )}

      <span className="relative z-10">
        <span className="block font-serif text-4xl tracking-[-0.01em] sm:text-5xl">{name}</span>
        <span className="mt-2 block text-xs font-medium uppercase tracking-[0.18em] opacity-90 underline-offset-4 group-hover:underline">
          Shop now
        </span>
      </span>
    </Link>
  );
}