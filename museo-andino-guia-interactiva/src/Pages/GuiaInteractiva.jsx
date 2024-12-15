import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

const Panorama = ({ textureUrl }) => {
  const texture = useTexture(textureUrl);

  useEffect(() => {
    texture.encoding = THREE.sRGBEncoding;
    texture.mapping = THREE.EquirectangularReflectionMapping;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const Hotspot = ({ position, onClick, color, info }) => (
  <mesh position={position} onClick={() => onClick(info)}>
    <sphereGeometry args={[2, 32, 32]} />
    <meshBasicMaterial color={color} opacity={0.7} transparent />
  </mesh>
);

const InfoModal = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      zIndex: 1000,
      maxWidth: '80%',
      maxHeight: '80%',
      overflow: 'auto'
    }}>
      <h2>{info.title}</h2>
      <p>{info.description}</p>
      {info.image && <img src={info.image} alt={info.title} style={{maxWidth: '100%'}} />}
      {info.video && (
        <video controls style={{maxWidth: '100%'}}>
          <source src={info.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <button onClick={onClose} style={{marginTop: '10px'}}>Cerrar</button>
    </div>
  );
};



const Scene = ({ currentSala, handleHotspotClick, setModalInfo }) => {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const salas = [
    `${import.meta.env.BASE_URL}museo_360.jpg`,
    `${import.meta.env.BASE_URL}museo_360_2.jpg`,
    `${import.meta.env.BASE_URL}museo_360_3.png`,
    `${import.meta.env.BASE_URL}museo_360_4.jpg`,
  ];

  const animateCamera = (targetPosition) => {
    const startPosition = camera.position.clone();
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, startPosition)
      .normalize();
    const distance = startPosition.distanceTo(targetPosition);

    gsap.to(camera.position, {
      duration: 3, // Aumentamos la duración para dar sensación de mayor distancia
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
      position: [-50, 10, -100],
      color: "red",
      info: {
        title: "Objeto Rojo",
        description: "Este es un objeto interesante de color rojo.",
        image: `${import.meta.env.BASE_URL}imagen_roja.jpg`,
        video: `${import.meta.env.BASE_URL}video_rojo.mp4`
      }
    },
    {
      position: [0, -20, -150],
      color: "green",
      info: {
        title: "Objeto Verde",
        description: "Aquí tenemos un fascinante objeto verde.",
        image: `${import.meta.env.BASE_URL}imagen_verde.jpg`
      }
    },
    {
      position: [70, 15, -120],
      color: "blue",
      info: {
        title: "Objeto Azul",
        description: "Un misterioso objeto azul con mucha historia.",
        video: `${import.meta.env.BASE_URL}video_azul.mp4`
      }
    }
  ];

  const hotspotsInfo = [
    {
      position: [-40, 10, -100],
      color: "orange",
      info: {
        title: "Objeto Naranja",
        description: "Este es un objeto interesante de color rojo.",
        image: `${import.meta.env.BASE_URL}imagen_roja.jpg`,
        video: `${import.meta.env.BASE_URL}video_rojo.mp4`
      }
    },
    {
      position: [10, -20, -150],
      color: "orange",
      info: {
        title: "Objeto Naranja",
        description: "Aquí tenemos un fascinante objeto verde.",
        image: `${import.meta.env.BASE_URL}imagen_verde.jpg`
      }
    },
    {
      position: [60, 15, -120],
      color: "orange",
      info: {
        title: "Objeto Naranja",
        description: "Un misterioso objeto azul con mucha historia.",
        video: `${import.meta.env.BASE_URL}video_azul.mp4`
      }
    }
  ];

  return (
    <>
      <Panorama textureUrl={salas[currentSala]} />
      {hotspotsInfo.map((hotspot, index) => (
        <Hotspot
          key={index}
          position={hotspot.position}
          onClick={(info) => {
            setModalInfo(info);
            animateCamera(new THREE.Vector3(...hotspot.position));
          }}
          color={hotspot.color}
          info={hotspot.info}
        />
      ))}

{hotspots.map((hotspot, index) => (
        <Hotspot
          key={index}
          position={hotspot.position}
          onClick={() => {
            animateCamera(new THREE.Vector3(...hotspot.position));
          }}
          color={hotspot.color}
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
    `${import.meta.env.BASE_URL}museo_360.jpg`,
    `${import.meta.env.BASE_URL}museo_360_2.jpg`,
    `${import.meta.env.BASE_URL}museo_360_3.png`,
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
