"use client";

import Image from "next/image";
import { useState } from "react";

interface LiteYouTubeEmbedProps {
  videoId: string;
  title: string;
  start?: number;
}

export default function LiteYouTubeEmbed({
  videoId,
  title,
  start,
}: LiteYouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${
    start ? `&start=${start}` : ""
  }`;

  return (
    <div className="relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-lg">
      {isPlaying ? (
        <iframe
          src={videoUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative h-full w-full text-left"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            priority={false}
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 opacity-60 transition group-hover:opacity-80" />
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition group-hover:scale-105">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}

