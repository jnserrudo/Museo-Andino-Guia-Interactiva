import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { Html } from "@react-three/drei";
import { transform } from "@chakra-ui/react";

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
          style={{ width: "32px", cursor: "pointer" }}
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
          alt="Navigation Hotspot"
          style={{ width: "320px", cursor: "pointer" }}
        />
      </Html>
    )}
  </mesh>
);

const InfoModal = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
        maxWidth: "80%",
        maxHeight: "80%",
        overflow: "auto",
      }}
    >
      <h2>{info.title}</h2>
      <p>{info.description}</p>
      {info.image && (
        <img src={info.image} alt={info.title} style={{ maxWidth: "100%" }} />
      )}
      {info.video && (
        <video controls style={{ maxWidth: "100%" }}>
          <source src={info.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <button onClick={onClose} style={{ marginTop: "10px" }}>
        Cerrar
      </button>
    </div>
  );
};

const Scene = ({ currentSala, handleHotspotClick, setModalInfo }) => {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const salas = [
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
        description: "Descripción del objeto histórico.",
        image: `${import.meta.env.BASE_URL}sala2_1.JPG`,
      },
    },
    {
      position: [-50, 15, -300],
      type: "modal",
      info: {
        title: "Muestra de Arte",
        description: "Descripción de la muestra.",
        image: `${import.meta.env.BASE_URL}sala2_2.JPG`,
      },
    },
  ];

  return (
    <>
      <Panorama  textureUrl={salas[currentSala]} />
      <group scale={[-1, 1, 1]} /> {/* Inversión horizontal */}
      {hotspots.map((hotspot, index) => (
        <Hotspot
          key={index}
          position={hotspot.position}
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

  const salas = [
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

      {/* Modal de información */}
      <InfoModal info={modalInfo} onClose={() => setModalInfo(null)} />
    </div>
  );
};
