import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

export default function CarViewer() {
  return (
    <Canvas camera={{ position: [5, 2, 5], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <spotLight position={[10, 15, 10]} angle={0.3} intensity={2} castShadow />
      <Environment preset="city" /> 

      <Suspense fallback={null}>
        {/* Placeholder metallic block. We will replace this with your 3D car later! */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[4, 1.2, 1.8]} />
          <meshStandardMaterial color="#0044ff" metalness={0.9} roughness={0.1} />
        </mesh>
      </Suspense>

      <ContactShadows position={[0, 0, 0]} resolution={1024} scale={20} blur={2} opacity={0.6} far={10} />
      <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.1} autoRotate />
    </Canvas>
  );
}