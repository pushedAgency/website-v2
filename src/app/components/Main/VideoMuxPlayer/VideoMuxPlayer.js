"use client";
import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import Image from "next/image";

export default function VideoMuxPlayer({ id, fallbackImage }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const playbackId = id ? String(id).trim() : null;

  // 🔹 Evitar render SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🔹 Ocultar errores molestos del navegador / Webpack
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handler = (e) => {
        if (
          e.message?.includes("PIPELINE_ERROR_DECODE") ||
          e.message?.includes("VTDecompressionOutputCallback")
        ) {
          e.stopImmediatePropagation();
        }
      };
      window.addEventListener("error", handler);
      return () => window.removeEventListener("error", handler);
    }
  }, []);

  const handleLoadedMetadata = () => setIsLoading(false);

  const handleError = (event) => {
    const mediaError = event?.detail?.playerError?.error || event?.target?.error;
    console.warn("Mux Player media error:", mediaError?.code || mediaError);

    // 🔸 Detectar el bug de decodificación de Safari
    if (
      mediaError?.code === -12909 ||
      mediaError?.message?.includes("VTDecompressionOutputCallback")
    ) {
      setError(
        "Hubo un problema al reproducir el video en este dispositivo. Probá actualizar el navegador o usar Chrome."
      );
    } else {
      setError(
        "Este video no se puede reproducir en tu dispositivo. (Reiniciá la página e intentá de nuevo)"
      );
    }

    setIsLoading(false);
  };

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
        {/* Loader mientras carga */}
        {isLoading && !error && (
          <div className="flex items-center justify-center h-48 animate-pulse">
            <Image
              src={fallbackImage || `/images/loading.gif`}
              alt="Cargando video..."
              width={30}
              height={30}
              unoptimized
            />
          </div>
        )}

        {/* Mensaje de error visible al usuario */}
        {error && (
          <div className="text-center mt-4 text-red-500">
            {error}
          </div>
        )}

        {/* Mux Player */}
        {playbackId && !error && (
          <MuxPlayer
            src={`https://stream.mux.com/${playbackId}.m3u8`}
            streamType="on-demand"
            autoPlay={false}
            muted={false}
            accent-color="#17e6da"
            className={`mt-5 rounded-lg shadow-lg ${isLoading ? "hidden" : "block"}`}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}
