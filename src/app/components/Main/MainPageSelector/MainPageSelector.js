"use client"; // Indica que este es un componente del lado del cliente

import React, { useEffect, useState } from "react";
// Ya no necesitamos 'Link' de next/link si usamos botones para cambiar de categoría.
// import Link from "next/link"; 
import DataDisplayed from "@/app/components/Main/MainPageSelector/DataDisplayed";

const MainPageSelector = () => {
  const [loading, setLoading] = useState(true); // Estado para controlar si los datos están cargando
  const [data, setData] = useState({}); // Estado para almacenar los datos cargados de data.json
  const [activeData, setActiveData] = useState(0); // Índice de la categoría activa para mostrar

  // Efecto para cargar los datos desde '/data.json' cuando el componente se monta
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true); // Indica que la carga ha comenzado
        const res = await fetch("/data.json", { cache: "no-store" }); // Solicita el archivo JSON
        
        // Verifica si la respuesta HTTP fue exitosa (código 2xx)
        if (!res.ok) {
          throw new Error(`Error HTTP! Estado: ${res.status}`); // Lanza un error si la respuesta no es OK
        }
        
        const response = await res.json(); // Parsea la respuesta como JSON
        setData(response); // Almacena los datos en el estado
      } catch (error) {
        // Captura cualquier error durante la carga de datos
        console.error("Error al cargar los datos:", error);
        // Aquí podrías implementar una lógica para mostrar un mensaje de error al usuario
        // Por ejemplo, setear un estado de error: setError(true);
      } finally {
        setLoading(false); // Indica que la carga ha finalizado (con éxito o error)
      }
    };

    fetchImages(); // Llama a la función para cargar los datos
  }, []); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Obtiene los títulos de las categorías de los datos cargados.
  // Asegura que 'data' sea un objeto antes de intentar obtener sus claves.
  const titles = data && typeof data === "object" ? Object.keys(data) : [];

  return (
    <section className="flex flex-col h-screen"> {/* Contenedor principal de la página */}
      {/* Renderiza el contenido principal solo cuando los datos hayan cargado 
        y existan títulos de categorías para evitar errores de renderizado.
      */}
      {!loading && titles.length > 0 && (
        <>
          {/* Componente que muestra los datos de la categoría actualmente seleccionada.
            Se le pasan los datos correspondientes y el título de la categoría activa.
          */}
          <div className="flex-grow overflow-y-auto"> {/* Permite que el contenido principal sea scrollable */}
            <DataDisplayed
              data={data[titles[activeData]]} // Pasa los datos específicos de la categoría activa
              title={titles[activeData]}       // Pasa el título de la categoría activa
              active={activeData}              // Pasa el índice activo (puede ser útil en DataDisplayed)
            />
          </div>
          
          {/* Sección inferior para los botones de selección de categoría.
            Se fija en la parte inferior de la pantalla y permite desplazamiento horizontal.
          */}
          <section className="flex overflow-x-auto whitespace-nowrap fixed bottom-0 w-screen gap-5 z-100 px-4">
            {/* Mapea los títulos para crear un botón por cada categoría */}
            {titles.map((title, index) => (
              <button // Hemos cambiado <Link> a <button> ya que su propósito es solo cambiar el estado interno
                key={index} // Key única para cada botón, importante para la optimización de React
                type="button" // Especifica el tipo para un botón HTML (previene el comportamiento por defecto de submit en formularios)
                onClick={() => setActiveData(index)} // Al hacer clic, actualiza el estado para mostrar la categoría correspondiente
                className={`
                  bottomSection 
                  p-2 
                  rounded-lg 
                  transition-all 
                  duration-200 
                  flex-shrink-0 // Evita que los botones se encojan en pantallas pequeñas
                  min-w-[120px] // Ancho mínimo para los botones
                  text-center // Centra el texto
                  ${
                    activeData === index 
                      ? "activeBottom bg-blue-600 text-white shadow-md transform scale-105" // Estilo para el botón activo
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900" // Estilo para botones inactivos
                  }
                `}
              >
                <h1 className="font-bold text-xl whitespace-nowrap overflow-hidden text-ellipsis">
                  📚 {title} {/* Muestra el título de la categoría */}
                </h1>
              </button>
            ))}
          </section>
        </>
      )}

      {/* Opcional: Mostrar un mensaje de carga inicial mientras los datos están siendo fetched.
        Se muestra solo si 'loading' es verdadero.
      */}
      {loading && (
        <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">
          Cargando datos...
        </div>
      )}

      {/* Opcional: Mostrar un mensaje si no se encuentran datos después de cargar.
        Se muestra solo si 'loading' es falso y 'titles' está vacío.
      */}
      {!loading && titles.length === 0 && (
        <div className="flex justify-center items-center h-screen text-2xl font-semibold text-red-500">
          No se encontraron datos para mostrar.
          <br/>
          Por favor, verifica tu archivo `data.json`.
        </div>
      )}
    </section>
  );
};

export default MainPageSelector;
