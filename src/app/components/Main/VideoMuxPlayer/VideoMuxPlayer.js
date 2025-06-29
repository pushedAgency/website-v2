"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react"; // Importa el componente MuxPlayer de React
import Image from "next/image"; // Importa el componente Image de Next.js para optimización de imágenes
import "@mux/mux-player/themes/classic"; // Importa el tema clásico de Mux Player para estilos por defecto

export default function VideoMuxPlayer({ id }) {
  // Estado para controlar si el video está cargando
  const [isLoading, setIsLoading] = useState(true);
  // Estado para almacenar y mostrar mensajes de error
  const [error, setError] = useState(null);

  // El playbackId se toma directamente del prop 'id'.
  // Se normaliza para asegurar que sea una cadena no vacía.
  const playbackId = id ? String(id).trim() : null;

  // useEffect para manejar la validación inicial del playbackId
  // Esto se ejecuta una vez al montar el componente.
  useEffect(() => {
    if (!playbackId) {
      // Si el playbackId no es válido o está vacío, establece un error
      setError("ID de video no válido.");
      setIsLoading(false); // Deja de mostrar el estado de carga
    } else {
      // Si el ID es válido, asegúrate de que no haya errores previos
      setError(null);
      setIsLoading(true); // Reinicia el estado de carga para el MuxPlayer (para que el spinner se muestre)
    }
  }, [playbackId]); // Se re-ejecuta si el playbackId cambia

  // Handler que se ejecuta cuando el video ha cargado sus metadatos (está listo para reproducir)
  const handleLoadedMetadata = () => {
    setIsLoading(false); // Oculta el spinner de carga
  };

  // Handler que se ejecuta si Mux Player encuentra un error
  const handleError = (event) => {
    console.error("Mux Player error:", event); // Loguea el error en la consola
    setError("No se pudo cargar el video. Intenta de nuevo más tarde."); // Muestra un mensaje de error al usuario
    setIsLoading(false); // Deja de mostrar el estado de carga
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="w-2/3 h-full">
        {isLoading && !error && (
          <div className="flex items-center justify-center h-48 animate-pulse">
            <Image
              src={`/images/loading.gif`} // Asegúrate de que esta ruta sea correcta y el gif exista
              alt="Cargando video, por favor espera" // Texto alternativo descriptivo para accesibilidad
              width={30}
              height={30}
              unoptimized
            />
          </div>
        )}

        {/* Muestra un mensaje de error si hay un error */}
        {error && (
          <div className="text-red-500 text-center mt-4">
            <p>{error}</p>
          </div>
        )}

        {/* Renderiza MuxPlayer solo si hay un playbackId válido y no hay un error inicial */}
        {playbackId && !error && (
          <MuxPlayer
            playbackId={playbackId}
            streamType="on-demand"
            autoPlay={false}
            accent-color="#17e6da"
            className={`mt-5 ${isLoading ? "hidden" : "block"}`} // Estilos y lógica de visibilidad originales
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}
