'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'white', textAlign: 'center', fontFamily: 'Arial' }}>
        <div style={{ fontSize: 13, letterSpacing: 2, color: '#c0392b' }}>
          LOADING {Math.round(progress)}%
        </div>
        <div style={{ width: 120, height: 2, background: '#222', marginTop: 8, borderRadius: 2 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#c0392b', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>
    </Html>
  );
}

function BMWModel({ finish }) {
  const { scene } = useGLTF('/bmw.glb');
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    ref.current.position.x = -center.x;
    ref.current.position.z = -center.z;
    ref.current.position.y = -box.min.y;

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3 / maxDim;
    ref.current.scale.setScalar(scale);
  }, [scene]);

  const finishColors = {
    'Showroom Wash':   { color: '#1e2a3a', metalness: 0.4,  roughness: 0.45 },
    'Ceramic Coated':  { color: '#0a1628', metalness: 0.95, roughness: 0.02 },
    'Paint Corrected': { color: '#3a1208', metalness: 0.75, roughness: 0.12 },
    'Full Detail':     { color: '#080808', metalness: 0.92, roughness: 0.04 },
  };
  const mat = finishColors[finish];

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = (child.material.name || child.name || '').toLowerCase();
        const isGlass    = name.includes('glass') || name.includes('window') || name.includes('wind');
        const isTire     = name.includes('tire') || name.includes('rubber') || name.includes('tyre');
        const isChrome   = name.includes('chrome') || name.includes('trim') || name.includes('exhaust');
        const isInterior = name.includes('interior') || name.includes('seat') || name.includes('dash') || name.includes('cabin');

        if (!isGlass && !isTire && !isInterior && !isChrome) {
          if (child.material.color) child.material.color.set(mat.color);
          child.material.metalness = mat.metalness;
          child.material.roughness = mat.roughness;
          child.material.envMapIntensity = 3;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [finish, scene, mat]);

  return <primitive ref={ref} object={scene} />;
}

export default function CarCanvas({ finish }) {
  return (
    <Canvas
      camera={{ position: [4, 2, 5], fov: 35 }}
      shadows
      style={{ touchAction: 'none' }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = 'auto';
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow
        shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-4, 4, 0]} intensity={1} color="#ff2222" />
      <pointLight position={[4, 2, -4]} intensity={0.5} color="#2244ff" />

      <Suspense fallback={<Loader />}>
        <BMWModel finish={finish} />
        <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={12} blur={3} />
        <Environment preset="city" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.3}
        minDistance={3}
        maxDistance={9}
        autoRotate
        autoRotateSpeed={0.5}
        touches={{ ONE: 2, TWO: 1 }}
        enableZoom={false}
      />
    </Canvas>
  );
}

useGLTF.preload('/bmw.glb');
