import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";

function BMWModel({ finish }) {
  const { scene } = useGLTF("/bmw.glb");

  const finishColors = {
    "Showroom Wash":  { color: "#2a2a3e", metalness: 0.3,  roughness: 0.5  },
    "Ceramic Coated": { color: "#0d1b2a", metalness: 0.95, roughness: 0.03 },
    "Paint Corrected":{ color: "#3a1810", metalness: 0.7,  roughness: 0.15 },
    "Full Detail":    { color: "#0a0a0a", metalness: 0.9,  roughness: 0.05 },
  };

  const mat = finishColors[finish];

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const name = (child.material.name || "").toLowerCase();
      const isGlass   = name.includes("glass") || name.includes("window") || name.includes("windshield");
      const isTire    = name.includes("tire") || name.includes("rubber") || name.includes("wheel");
      const isInterior= name.includes("interior") || name.includes("seat") || name.includes("dash");
      if (!isGlass && !isTire && !isInterior) {
        child.material.color?.set(mat.color);
        child.material.metalness = mat.metalness;
        child.material.roughness = mat.roughness;
        child.material.envMapIntensity = 2.5;
        child.material.needsUpdate = true;
      }
    }
  });

  return <primitive object={scene} scale={2} position={[0, -0.8, 0]} />;
}

const FINISHES = ["Showroom Wash", "Ceramic Coated", "Paint Corrected", "Full Detail"];

export default function CarViewer() {
  const [finish, setFinish] = useState("Ceramic Coated");

  return (
    <section style={{
      background: "radial-gradient(ellipse at center, #1a0a0a 0%, #050505 100%)",
      padding: "5rem 0", position: "relative"
    }}>
      <div style={{ textAlign: "center", marginBottom: "2rem", padding: "0 4vw" }}>
        <div className="section-tag">Interactive 3D Preview</div>
        <h2 className="section-title">EXPLORE THE <span className="accent">FINISH</span></h2>
        <div className="gold-line" style={{ margin: "16px auto" }} />
        <p style={{ color: "#888", fontSize: 14 }}>Drag to rotate · Scroll to zoom · Switch finishes to see the difference.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap", padding: "0 1rem" }}>
        {FINISHES.map(f => (
          <button key={f} onClick={() => setFinish(f)} style={{
            padding: "8px 18px", borderRadius: 4,
            background: finish === f ? "var(--crimson)" : "transparent",
            border: `1px solid ${finish === f ? "var(--crimson)" : "rgba(255,255,255,0.15)"}`,
            color: finish === f ? "white" : "#888", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
            letterSpacing: 1, transition: "all 0.3s"
          }}>{f}</button>
        ))}
      </div>

      <div style={{ height: 480 }}>
        <Canvas camera={{ position: [4, 2, 5], fov: 40 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <pointLight position={[-5, 5, 0]} intensity={0.8} color="#ff3333" />
          <pointLight position={[5, 3, -5]} intensity={0.4} color="#3344ff" />
          <Suspense fallback={null}>
            <BMWModel finish={finish} />
            <ContactShadows position={[0, -1.0, 0]} opacity={0.5} scale={10} blur={2.5} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </Canvas>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <p style={{ color: "#555", fontSize: 12, letterSpacing: 1 }}>← DRAG TO ROTATE →</p>
      </div>
    </section>
  );
}

useGLTF.preload("/bmw.glb");