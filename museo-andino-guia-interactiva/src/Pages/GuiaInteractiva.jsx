import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { Html } from "@react-three/drei";
import { transform } from "@chakra-ui/react";
import { InfoModal } from "../Components/InfoModal";

import {
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ExpandOutlined,
} from "@ant-design/icons";


const salas = [
  /*  `${import.meta.env.BASE_URL}prueba_360.jpeg`,
   `${import.meta.env.BASE_URL}prueba2360.jpeg`, */
   `${import.meta.env.BASE_URL}sala1_2.JPG`,
   `${import.meta.env.BASE_URL}sala1_3.JPG`,
   `${import.meta.env.BASE_URL}sala2_1.JPG`,
   `${import.meta.env.BASE_URL}sala2_2.JPG`,
   `${import.meta.env.BASE_URL}sala2_3.JPG`,
   `${import.meta.env.BASE_URL}sala3_1.JPG`,
   `${import.meta.env.BASE_URL}sala3_2.JPG`,
   `${import.meta.env.BASE_URL}sala3_3.JPG`,
   `${import.meta.env.BASE_URL}sala4_1.JPG`,
   `${import.meta.env.BASE_URL}sala4_2.JPG`,
   `${import.meta.env.BASE_URL}sala4_3.JPG`,
   `${import.meta.env.BASE_URL}museo_360_4.jpg`,
 ];

const Panorama = ({ textureUrl }) => {
  const texture = useTexture(textureUrl);

  useEffect(() => {
    texture.encoding = THREE.sRGBEncoding;
    texture.mapping = THREE.EquirectangularReflectionMapping;
  }, [texture]);

  return (
    <mesh scale={[-1, 1, 1]} rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const Hotspot = ({ position, onClick, type, info }) => (
  <mesh position={position}>
    {type === "modal" ? (
      <Html
        zIndexRange={[0, 999]} // Ajusta el rango del z-index
        style={{
          width: "40px",
          height: "auto",
          display: "block",
          borderRadius: "50%",
          border: "2px solid white",
        }}
      >
        <img
          onClick={() => onClick(info)}
          src={`${import.meta.env.BASE_URL}modal.png`}
          alt="Modal Hotspot"
          className="pulse-effect" // Añadimos la clase para el efecto de pulso
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
        />
      </Html>
    ) : (
      <Html
        zIndexRange={[0, 999]} // Ajusta el rango del z-index
        style={{
          width: "40px",
          height: "auto",
          display: "block",
          borderRadius: "50%",
          border: "2px solid white",
        }}
      >
        <img
          onClick={() => onClick(info)}
          src={`${import.meta.env.BASE_URL}avanzar.png`}
          className="pulse-effect" // Añadimos la clase para el efecto de pulso
          alt="Navigation Hotspot"
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
        />
      </Html>
    )}
  </mesh>
);

const Scene = ({ currentSala, handleHotspotClick, setModalInfo }) => {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  

  const animateCamera = (targetPosition) => {
    const startPosition = camera.position.clone();
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, startPosition)
      .normalize();
    const distance = startPosition.distanceTo(targetPosition);

    gsap.to(camera.position, {
      duration: 1, // Aumentamos la duración para dar sensación de mayor distancia
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: "power3.inOut", // Cambiamos la función de ease para un movimiento más dramático
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
      onComplete: () => {
        handleHotspotClick(currentSala + 1);
      },
    });
  };
  const hotspots = [
    {
      position: [-280, 20, -200],
      type: "navigate",
      info: {
        title: "Siguiente Sala",
      },
    },
    {
      position: [290, 30, -250],
      type: "modal",
      info: {
        title: "Objeto Histórico",
        description: `Descripción del objeto histórico.  
          lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum
        `,
        image: `${import.meta.env.BASE_URL}sala2_1.JPG`,
      },
    },
    {
      position: [-50, 15, -300],
      type: "modal",
      info: {
        title: "Muestra de Arte",
        description: `Descripción de la muestra.  
          lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum
        `,
        image: `${import.meta.env.BASE_URL}sala2_2.JPG`,
      },
    },
  ];

  return (
    <>
      <Panorama textureUrl={salas[currentSala]} />
      <group scale={[-1, 1, 1]} /> {/* Inversión horizontal */}
      {hotspots.map((hotspot, index) => (
        <Hotspot
          key={index}
          position={hotspot.position}
          className="hotspot"
          onClick={(info) => {
            if (hotspot.type === "modal") {
              console.log("modal");
              setModalInfo(info);
            } else {
              console.log("animate");
              animateCamera(new THREE.Vector3(...hotspot.position));
            }
          }}
          type={hotspot.type}
          info={hotspot.info}
        />
      ))}
      <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} />
    </>
  );
};

export const GuiaInteractiva = () => {
  const [currentSala, setCurrentSala] = useState(0);
  const [modalInfo, setModalInfo] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Posición del cursor
  const [showCircle, setShowCircle] = useState(false); // Controla si se muestra el círculo azul

  // Evento para seguir la posición del cursor
  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
    setShowCircle(e.clientY > window.innerHeight / 2); // Muestra el círculo solo en la mitad inferior
  };

  // Agrega y elimina el listener del mouse
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  /* const salas = [
    `${import.meta.env.BASE_URL}sala1_2.JPG`,
    `${import.meta.env.BASE_URL}sala1_3.JPG`,
    `${import.meta.env.BASE_URL}sala2_1.JPG`,
    `${import.meta.env.BASE_URL}sala2_2.JPG`,
    `${import.meta.env.BASE_URL}sala2_3.JPG`,
    `${import.meta.env.BASE_URL}sala3_1.JPG`,
    `${import.meta.env.BASE_URL}sala3_2.JPG`,
    `${import.meta.env.BASE_URL}sala3_3.JPG`,
    `${import.meta.env.BASE_URL}sala4_1.JPG`,
    `${import.meta.env.BASE_URL}sala4_2.JPG`,
    `${import.meta.env.BASE_URL}sala4_3.JPG`,
    `${import.meta.env.BASE_URL}museo_360_4.jpg`,
  ]; */

  const handleHotspotClick = (nextSala) => {
    setCurrentSala(nextSala);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{
          // Posición de la cámara en el espacio 3D
          position: [0, 0, 1],
          // Angulo de visión de la cámara en grados
          fov: 75,
          // Distancia mínima a la que se renderizarán objetos
          near: 0.1,
          // Distancia máxima a la que se renderizarán objetos
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <Scene
            currentSala={currentSala}
            handleHotspotClick={handleHotspotClick}
            setModalInfo={setModalInfo}
          />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "5px 15px",
          borderRadius: "20px",
        }}
      >
        Sala {currentSala + 1} de {salas.length}
      </div>

      {/* Logo del museo */}
      <img
        src={`${import.meta.env.BASE_URL}logo_museo_andino.jpg`}
        alt="Logo Museo"
        style={{
          position: "absolute",
          top: "30px",
          left: "120px",
          width: "150px",
        }}
      />

      {/* Círculo azul que sigue al cursor */}
      {showCircle && (
        <div
          style={{
            position: "absolute",
            top: cursorPosition.y - 25,
            left: cursorPosition.x - 25,
            width: "50px",
            height: "50px",
            backgroundColor: "rgba(0, 0, 255, 0.5)",
            borderRadius: "50%",
            pointerEvents: "none", // No interfiere con eventos del mouse
          }}
        />
      )}

      {/* Íconos en la parte inferior con animación de pulso */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <MenuUnfoldOutlined className="iconos_inferiores" />
        <AppstoreOutlined className="iconos_inferiores" />
        <ExpandOutlined className="iconos_inferiores" />
      </div>

      {/* Modal de información */}

      <InfoModal info={modalInfo} onClose={() => setModalInfo(null)} />
    </div>
  );
};
