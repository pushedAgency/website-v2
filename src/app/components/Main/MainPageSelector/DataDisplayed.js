"use client"; // Indica que este es un componente del lado del cliente

import React, { useState } from "react";
import ButtonComponentLine from "@/app/components/Main/ButtonComponentLine/ButtonComponentLine";
import Link from "next/link";
import Image from "next/image";

const DataDisplayed = ({ data, title }) => {
  // Inicializa currentPlaybackId. Si 'data' es null/undefined o data[0] no existe,
  // el valor inicial será undefined, lo cual es manejable.
  const [currentPlaybackId, setCurrentPlaybackId] = useState(
    data?.[0]?.playbackId
  );

  // Función auxiliar para obtener la descripción del título
  const getDescriptionForTitle = (currentTitle) => {
    switch (currentTitle) {
      case "COMO ENCONTRAR EL PRODUCTO QUE TE CAMBIE LA VIDA":
        return "En este módulo te enseño cómo buscar productos ganadores, cómo analizarlos, y te doy estrategias concretas para encontrar ese producto que puede marcar un antes y un después.";
      case "COMO SACAR COSTOS DE PRODUCTO":
        return "Aprendé a sacar costos de productos con este módulo, que incluye información vital sobre requisitos fiscales para mejorar las ventas y una clase completa sobre el cálculo de costos.";
      case "COMO HACER VIDEOS 100% CONVERTIDORES":
        return "Las claves para crear contenido de video de alta conversión. Este módulo proporciona orientación sobre la elaboración de guiones ganadores y la edición de creativos que captan la atención.";
      case "COMO LANZAR UN TESTEO":
        return "Una guía paso a paso para lanzar pruebas de marketing exitosas. Desde la configuración de tu Business Manager de Meta hasta la ejecución de campañas de calentamiento y la comprensión de la teoría ABO, este módulo cubre toda la rutina de testeo.";
      case "COMO HACERTE UN EXPERTO EN LAS METRICAS":
        return "Convertite en un experto en métricas aprendiendo a personalizar tus columnas de Meta y comprendiendo las métricas clave esenciales para un testeo efectivo.";
      case "TEORIA/PRACTICA ESCALADO":
        return "Este módulo profundiza en los aspectos teóricos y prácticos de escalar tu negocio, aunque no se especifica el contenido de video. (En proceso)";
      case "OPTIMIZACION DE CAMPAÑAS/TESTEO":
        return "Enfocate en perfeccionar tus esfuerzos de marketing. Este módulo cubre estrategias para optimizar tanto campañas como pruebas. (En proceso)";
      case "CREANDO TU EMPRESA":
        return "Un paso a paso para armar tu negocio desde cero: desde crear tu cuenta de Gmail, redes sociales y tienda online, hasta dejarla lista para vender con banners, productos y testimonios.";
      case "MI HISTORIA ¿QUIEN SOY Y COMO LLEGUE A DONDE ESTOY?":
        return "Una introducción personal donde cuento mi historia, cómo empecé y el camino que recorrí hasta construir mi negocio actual.";
      case "SI VES ESTO TE VA A IR BIEN":
        return "Una serie de videos con consejos clave para avanzar rápido en tu negocio, entender los desafíos que vas a enfrentar y cómo prepararte mentalmente para el camino emprendedor.";
      default:
        return ""; // Retorna una cadena vacía si no hay descripción para el título
    }
  };

  const description = getDescriptionForTitle(title);

  return (
    <section>
      <section className="headerSection paddingSection">
        <h1 className="font-extrabold text-2xl accent w-fit">📚 {title}</h1>
      </section>

      <section className="flex">
        <div className="moduleContent paddingSection">
          <p className="font-bold text-2xl accent w-fit">Contenidos</p>

          {/* Renderiza la descripción solo si existe */}
          {description && (
            <p className="w-fit">
              {description}
            </p>
          )}

          <div className="">
            {/* Mapea los datos para crear botones de selección de video */}
            {data?.map((videoData, index) =>
              // Asegura que playbackId exista y no esté vacío para crear el botón
              videoData?.playbackId && videoData.playbackId.trim() !== "" ? (
                <div key={index}>
                  <ButtonComponentLine
                    title={videoData.filename}
                    src={videoData.playbackId} // src aquí es el playbackId para ButtonComponentLine
                    onClick={() => setCurrentPlaybackId(videoData.playbackId)}
                  />
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="videoParagrapgh gap-2">
          <div className="">
            {/* Mapea los datos para crear enlaces a la página de video individual */}
            {data?.map((videoData, index) => {
              // Verifica que playbackId exista y no esté vacío antes de renderizar la miniatura y el enlace
              if (videoData?.playbackId && videoData.playbackId.trim() !== "") {
                const thumbnailUrl = `https://image.mux.com/${videoData.playbackId}/thumbnail.webp?`;
                return (
                  <Link
                    key={index}
                    href={`/singleVideo/${videoData.playbackId}`}
                    className="videoComponentLineDiv"
                  >
                    <div className="videoComponentLine flex items-center gap-5">
                      <Image
                        src={thumbnailUrl} // URL de la miniatura de Mux
                        alt="Icon Play Button" // Mantengo tu alt original
                        width={1080}
                        height={1080}
                        className="borderImg videoThumbnail"
                        priority
                      />
                      <h3 className="text-xl">{videoData.filename}</h3>
                    </div>
                  </Link>
                );
              }
              return null; // No renderiza nada si playbackId es inválido
            })}
          </div>
        </div>
      </section>
    </section>
  );
};

export default DataDisplayed;
