import React from "react";
import {
  CloseSquareOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

export const Info = () => {
  const info = {
    title: "Historia del museo",
    description: ` Inaugurado en 2019, el Museo Regional Andino de San Antonio de los Cobres
    tiene como misión preservar y revalorizar el rico patrimonio cultural, histórico y
    natural de la región andina. San Antonio de los Cobres, situado en la provincia de
    Salta, ha sido un cruce de diversas culturas a lo largo de la historia, gracias a su
    ubicación estratégica en rutas históricas y su abundancia mineral.
    El museo ocupa un histórico edificio que fue la antigua sede de la Gobernación
    de Los Andes, el cual ha sido cuidadosamente restaurado según un proyecto
    arquitectónico realizado por DiPAUS. Este espacio se ha transformado en un punto
    de encuentro educativo y cultural, resultado de un esfuerzo conjunto entre el
    gobierno provincial y la comunidad local. Además de conservar el patrimonio, el
    museo busca educar a los visitantes sobre la historia de la minería, la biodiversidad
    y las tradiciones de los pueblos originarios.
    El diseño museográfico fue elaborado por un equipo interdisciplinario, permitiendo
    crear una muestra que revaloriza y explica la rica naturaleza y cultura de la región.
    El museo cuenta con nueve salas temáticas y un gabinete de curiosidades,
    donde se conservan y exhiben objetos donados por vecinos y comunidades
    aledañas.`,
    image: `${import.meta.env.BASE_URL}historia_museo.png`,
  };

  const handleReproducir = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${info.title}. ${info.description}`
      );
      utterance.lang = "es-ES"; // Configura el idioma según tus necesidades
      utterance.rate = 1; // Velocidad de lectura
      utterance.pitch = 1; // Tono de voz
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La síntesis de voz no es compatible con tu navegador.");
    }
  };

  return (
    <div>
      <main className="main_home">
        <img
          src={`${import.meta.env.BASE_URL}sala1_1.JPG`}
          className="img_fondo"
          alt=""
        />

        <div className="cont_modal cont_modal-guia">
          <div className="modal modal-guia">
            <div className="modal-multimedia modal-multimedia-guia">
              {info.image && (
                <img src={info.image} alt={info.title} className="img_modal" />
              )}
              {info.video && (
                <video controls style={{ maxWidth: "100%" }}>
                  <source src={info.video} type="video/mp4" />
                  {/* Your browser does not support the video tag. */}
                </video>
              )}
            </div>
            <div className="modal-info modal-info-guia">
              <h2>{info.title}</h2>
              <div style={{ height: "80%" , overflow: "auto" }}>
                <p>{info.description}</p>
              </div>
                <CustomerServiceOutlined
                  onClick={handleReproducir}
                  className="icono icono_reproducir"
                />
            </div>
          </div>
          {/* <button onClick={onClose}  className="btn_cerrar" >
          Cerrar
        </button> */}
        </div>
      </main>
    </div>
  );
};
