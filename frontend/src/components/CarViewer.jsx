import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: "white", textAlign: "center", fontFamily: "Arial" }}>
        <div style={{ fontSize: 13, letterSpacing: 2, color: "#c0392b" }}>
          LOADING {Math.round(progress)}%
        </div>
        <div style={{ width: 120, height: 2, background: "#222", marginTop: 8, borderRadius: 2 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#c0392b", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>
    </Html>
  );
}

function BMWModel({ finish }) {
  const { scene } = useGLTF("/bmw.glb");
  const ref = useRef();

  // Auto-fit: compute bounding box and center + scale to fit
  useEffect(() => {
    if (!ref.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Center the model
    ref.current.position.x = -center.x;
    ref.current.position.z = -center.z;
    ref.current.position.y = -box.min.y; // sit on ground

    // Scale to fit in a ~3 unit wide box
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3 / maxDim;
    ref.current.scale.setScalar(scale);
  }, [scene]);

  const finishColors = {
    "Showroom Wash":  { color: "#1e2a3a", metalness: 0.4,  roughness: 0.45 },
    "Ceramic Coated": { color: "#0a1628", metalness: 0.95, roughness: 0.02 },
    "Paint Corrected":{ color: "#3a1208", metalness: 0.75, roughness: 0.12 },
    "Full Detail":    { color: "#080808", metalness: 0.92, roughness: 0.04 },
  };
  const mat = finishColors[finish];

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = (child.material.name || child.name || "").toLowerCase();
        const isGlass    = name.includes("glass") || name.includes("window") || name.includes("wind");
        const isTire     = name.includes("tire") || name.includes("rubber") || name.includes("tyre");
        const isChrome   = name.includes("chrome") || name.includes("trim") || name.includes("exhaust");
        const isInterior = name.includes("interior") || name.includes("seat") || name.includes("dash") || name.includes("cabin");

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

const FINISHES = ["Showroom Wash", "Ceramic Coated", "Paint Corrected", "Full Detail"];

export default function CarViewer() {
  const [finish, setFinish] = useState("Ceramic Coated");

  return (
    <section style={{
      background: "radial-gradient(ellipse at center, #1a0a0a 0%, #050505 100%)",
      padding: "5rem 0"
    }}>
      <div style={{ textAlign: "center", marginBottom: "2rem", padding: "0 4vw" }}>
        <div className="section-tag">Interactive 3D Preview</div>
        <h2 className="section-title">EXPLORE THE <span className="accent">FINISH</span></h2>
        <div className="gold-line" style={{ margin: "16px auto" }} />
        <p style={{ color: "#888", fontSize: 14 }}>Drag to rotate · Scroll to zoom · Switch finishes below.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap", padding: "0 1rem" }}>
        {FINISHES.map(f => (
          <button key={f} onClick={() => setFinish(f)} style={{
            padding: "8px 18px", borderRadius: 4,
            background: finish === f ? "#c0392b" : "transparent",
            border: `1px solid ${finish === f ? "#c0392b" : "rgba(255,255,255,0.15)"}`,
            color: finish === f ? "white" : "#888",
            cursor: "pointer", fontFamily: "inherit",
            fontSize: 12, fontWeight: 600, letterSpacing: 1, transition: "all 0.3s"
          }}>{f}</button>
        ))}
      </div>

      <div style={{ height: 500 }}>
        <Canvas camera={{ position: [4, 2, 5], fov: 35 }} shadows>
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
          />
        </Canvas>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <p style={{ color: "#444", fontSize: 11, letterSpacing: 2 }}>← DRAG TO ROTATE →</p>
      </div>
    </section>
  );
}

useGLTF.preload("/bmw.glb");