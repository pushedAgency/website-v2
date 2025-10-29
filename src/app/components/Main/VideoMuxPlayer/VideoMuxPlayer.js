"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function VideoMuxPlayer({ id, fallbackImage }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const playbackId = id ? String(id).trim() : null;

  // Evitar render SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simular loader corto antes de mostrar iframe
  useEffect(() => {
    if (isClient && playbackId) {
      const timer = setTimeout(() => setIsLoading(false), 800); // 0.8s loader
      return () => clearTimeout(timer);
    }
  }, [isClient, playbackId]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-48">
        <Image
          src={fallbackImage || "/images/loading.gif"}
          alt="Cargando video..."
          width={30}
          height={30}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="w-2/3 h-full">
        {/* Loader */}
        {isLoading && (
          <div className="flex items-center justify-center h-48 animate-pulse">
            <Image
              src={fallbackImage || "/images/loading.gif"}
              alt="Cargando video..."
              width={30}
              height={30}
              unoptimized
            />
          </div>
        )}

        {/* Iframe Mux */}
        {!isLoading && playbackId && (
          <div className="mt-5 rounded-lg shadow-lg overflow-hidden">
            <iframe
              src={`https://player.mux.com/${playbackId}?autoplay=false&muted=false&controls=true&accent-color=%2317e6da`}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              style={{
                width: "100%",
                border: "none",
                aspectRatio: "16/9",
              }}
              title="Video Mux"
            />
          </div>
        )}
      </div>
    </div>
  );
}
