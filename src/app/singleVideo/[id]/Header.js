"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

const Header = ({ id }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState(null); // resultado starts as null

  // Fetch de datos desde /data.json
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await fetch("/data.json", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const response = await res.json();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Opcional: Podrías querer mostrar un mensaje de error al usuario aquí
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []); // El array vacío asegura que esto se ejecuta solo una vez al montar el componente

  // Búsqueda del signedId una vez que data se carga y id está disponible
  useEffect(() => {
    // Asegurarse de que 'id' es válido y que los datos están cargados
    if (!id) {
      // Si no hay 'id' (ej. en una URL mal formada), no hay nada que buscar.
      // Podrías establecer un estado de error o mensaje diferente si lo deseas.
      setResultado(null);
      // Establece loading a false si no hay ID para buscar, para que el UI no se quede "cargando" indefinidamente
      if (loading) setLoading(false); 
      return; 
    }

    if (!loading && Object.keys(data).length > 0) {
      function findSignedId(data, signedIdBuscado) {
        for (const categoria in data) {
          const elementos = data[categoria];
          // Asegúrate de que 'elementos' sea un array antes de usar .find
          if (Array.isArray(elementos)) { 
            const encontrado = elementos.find(
              (item) => item.playbackId === signedIdBuscado
            );
            if (encontrado) {
              return { categoria, ...encontrado };
            }
          }
        }
        return null;
      }

      const resultadoEncontrado = findSignedId(data, id);
      setResultado(resultadoEncontrado);
    }
  }, [data, id, loading]); // Dependencias: se ejecuta cuando 'data', 'id' o 'loading' cambian

  // Determinar los valores a mostrar en el H1 para evitar problemas de hidratación
  // y asegurar un fallback adecuado durante la carga y si no se encuentra el resultado.
  const displayCategoria = resultado?.categoria || (loading ? "Cargando..." : "Categoría no encontrada");
  const displayFilename = resultado?.filename || (loading ? "Cargando..." : "Archivo no encontrado");

  return (
    <div>
      <section className="headerSection paddingSection flex items-center gap-2">
        <Link href={"/"}>
          <IoMdArrowRoundBack className="text-2xl" />
        </Link>
        <h1 className="font-extrabold text-2xl">
          📚 {displayCategoria} / {displayFilename}
        </h1>
      </section>
    </div>
  );
};

export default Header;