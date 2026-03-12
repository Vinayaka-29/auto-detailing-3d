import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

function BMWModel() {
  const { scene } = useGLTF("/bmw.glb");

  scene.position.set(0, -1, 0);
  scene.scale.set(1.6, 1.6, 1.6);

  useFrame((state) => {
    scene.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return <primitive object={scene} />;
}

export default function CarViewer() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [6, 3, 10], fov: 40 }}>
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={1} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#111" />
        </mesh>

        {/* BMW Model */}
        <BMWModel />

        {/* Controls */}
        <OrbitControls />
        <Environment preset="city" />

      </Canvas>
    </div>
  );
}