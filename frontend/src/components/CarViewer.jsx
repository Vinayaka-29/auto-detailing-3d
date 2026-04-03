import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function CarMesh({ finish }) {
  const bodyRef = useRef();
  const roofRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bodyRef.current) { bodyRef.current.rotation.y = Math.sin(t * 0.3) * 0.15; }
  });

  const finishMap = {
    "Showroom Wash": { color: "#1a1a2e", metalness: 0.3, roughness: 0.5 },
    "Ceramic Coated": { color: "#0d1b2a", metalness: 0.9, roughness: 0.05 },
    "Paint Corrected": { color: "#2c1810", metalness: 0.7, roughness: 0.15 },
    "Full Detail": { color: "#111827", metalness: 0.85, roughness: 0.08 },
  };
  const mat = finishMap[finish] || finishMap["Ceramic Coated"];

  return (
    <group ref={bodyRef} position={[0, -0.3, 0]}>
      {/* Car Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.7, 1.7]} />
        <meshStandardMaterial color={mat.color} metalness={mat.metalness} roughness={mat.roughness} envMapIntensity={1.5} />
      </mesh>
      {/* Roof */}
      <mesh ref={roofRef} position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.2, 0.55, 1.5]} />
        <meshStandardMaterial color={mat.color} metalness={mat.metalness} roughness={mat.roughness} envMapIntensity={1.5} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0.9, 0.45, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.05, 0.6, 1.4]} />
        <meshStandardMaterial color="#88ccff" metalness={0.1} roughness={0} transparent opacity={0.3} />
      </mesh>
      {/* Wheels */}
      {[[-1.3,-0.35,0.9],[1.3,-0.35,0.9],[-1.3,-0.35,-0.9],[1.3,-0.35,-0.9]].map(([x,y,z],i)=>(
        <group key={i} position={[x,y,z]} rotation={[Math.PI/2,0,0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35,0.35,0.2,32]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
          </mesh>
          <mesh position={[0,0,0.01]}>
            <cylinderGeometry args={[0.22,0.22,0.21,8]} />
            <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      {/* Headlights */}
      {[[1.9,0,0.65],[1.9,0,-0.65]].map(([x,y,z],i)=>(
        <mesh key={i} position={[x,y,z]}>
          <boxGeometry args={[0.1,0.15,0.25]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffff88" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

const FINISHES = ["Showroom Wash","Ceramic Coated","Paint Corrected","Full Detail"];

export default function CarViewer() {
  const [finish, setFinish] = useState("Ceramic Coated");

  return (
    <section style={{ background:"radial-gradient(ellipse at center, #1a0a0a 0%, #050505 100%)", padding:"5rem 0", position:"relative" }}>
      <div style={{ textAlign:"center", marginBottom:"2rem", padding:"0 4vw" }}>
        <div className="section-tag">Interactive 3D Preview</div>
        <h2 className="section-title">EXPLORE THE <span className="accent">FINISH</span></h2>
        <div className="gold-line" style={{ margin:"16px auto" }} />
        <p style={{ color:"#888", fontSize:14 }}>Drag to rotate. Switch finishes to see the difference.</p>
      </div>

      {/* Finish switcher */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:"1.5rem", flexWrap:"wrap", padding:"0 1rem" }}>
        {FINISHES.map(f=>(
          <button key={f} onClick={()=>setFinish(f)} style={{
            padding:"8px 18px", borderRadius:4,
            background:finish===f?"var(--crimson)":"transparent",
            border:`1px solid ${finish===f?"var(--crimson)":"rgba(255,255,255,0.15)"}`,
            color:finish===f?"white":"#888", cursor:"pointer",
            fontFamily:"var(--font-body)", fontSize:12, fontWeight:600, letterSpacing:1, transition:"all 0.3s"
          }}>{f}</button>
        ))}
      </div>

      <div style={{ height:420 }}>
        <Canvas camera={{ position:[5,3,5], fov:40 }} shadows>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10,10,5]} intensity={1} castShadow />
          <pointLight position={[-5,3,0]} intensity={0.5} color="#ff4444" />
          <pointLight position={[5,3,0]} intensity={0.3} color="#4444ff" />
          <Suspense fallback={null}>
            <CarMesh finish={finish} />
            <ContactShadows position={[0,-0.65,0]} opacity={0.4} scale={8} blur={2} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enablePan={false} minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2.2} minDistance={4} maxDistance={10} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
      </div>

      <div style={{ textAlign:"center", marginTop:"1.5rem" }}>
        <p style={{ color:"#555", fontSize:12, letterSpacing:1 }}>← DRAG TO ROTATE →</p>
      </div>
    </section>
  );
}
