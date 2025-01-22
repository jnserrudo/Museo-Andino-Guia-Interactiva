import React from "react";
import { CloseSquareOutlined,CustomerServiceOutlined } from "@ant-design/icons";

import "../modal.css";
export const InfoModal = ({ info, onClose }) => {
  if (!info) return null;


  const handleReproducir = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${info.title}. ${info.description}`);
      utterance.lang = "es-ES"; // Configura el idioma según tus necesidades
      utterance.rate = 1; // Velocidad de lectura
      utterance.pitch = 1; // Tono de voz
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La síntesis de voz no es compatible con tu navegador.");
    }
  };

  return (
    <div className="cont_modal">
      <div className="modal">
        <div className="modal-multimedia">
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
        <div className="modal-info">
          <CloseSquareOutlined className="icono icono_cerrar" onClick={onClose} />

          <h2>{info.title}</h2>
          <p>{info.description}</p>
          <CustomerServiceOutlined   onClick={handleReproducir} className="icono icono_reproducir" />
        </div>
      </div>
      {/* <button onClick={onClose}  className="btn_cerrar" >
          Cerrar
        </button> */}
    </div>
  );
};
