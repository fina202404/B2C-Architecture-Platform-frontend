'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows } from '@react-three/drei';

function House() {
  // Compact window helper (horizontal strip)
  const HWindow = ({ position = [0, 0, 0] as [number, number, number] }) => (
    <group position={position}>
      <mesh position={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[1.35, 0.08, 0.02]} />
        <meshStandardMaterial color="#2a3544" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.3, 0.24, 0.05]} />
        <meshStandardMaterial color="#9fd6ff" emissive="#102c49" emissiveIntensity={0.25} roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );

  // Small simple tree
  const Tree = ({ position = [0, 0, 0] as [number, number, number] }) => (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.9, 12]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshStandardMaterial color="#6ba96f" roughness={0.85} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Small plot / patio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#f5f7fa" />
      </mesh>

      {/* Two minimal steps */}
      {[0, 1].map((i) => (
        <mesh key={`st-${i}`} position={[0.0 + i * 0.25, 0.06 + i * 0.06, 1.5 - i * 0.04]} castShadow receiveShadow>
          <boxGeometry args={[1.0 + i * 0.5, 0.06, 0.6]} />
          <meshStandardMaterial color="#e9edf3" roughness={0.9} />
        </mesh>
      ))}

      {/* Main little block */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.4, 2.2]} />
        <meshStandardMaterial color="#eef1f5" roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Tiny side volume */}
      <mesh position={[2.2, 0.55, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.1, 1.6]} />
        <meshStandardMaterial color="#dce2ea" roughness={0.75} />
      </mesh>

      {/* Slim roof slab */}
      <mesh position={[0.1, 1.5, 0]} castShadow>
        <boxGeometry args={[4.2, 0.08, 2.6]} />
        <meshStandardMaterial color="#1a1f2a" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Wood accent near door */}
      <mesh position={[-1.2, 0.72, 1.12]} castShadow>
        <boxGeometry args={[0.35, 1.1, 0.04]} />
        <meshStandardMaterial color="#8b5e34" roughness={0.85} />
      </mesh>

      {/* Door */}
      <mesh position={[-0.9, 0.45, 1.12]} castShadow>
        <boxGeometry args={[0.66, 1.2, 0.05]} />
        <meshStandardMaterial color="#5a4633" roughness={0.7} />
      </mesh>

      {/* Front horizontal windows */}
      <HWindow position={[0.4, 0.9, 1.12]} />
      <HWindow position={[1.4, 0.9, 1.12]} />

      {/* Side windows */}
      <group rotation={[0, Math.PI / 2, 0]} position={[2.0, 0, -1.1]}>
        <HWindow position={[-0.5, 0.9, 0]} />
      </group>

      {/* One small tree */}
      <Tree position={[-3.0, 0, -1.6]} />
    </group>
  );
}

export default function ThreeHeroImpl() {
  return (
    <div className="w-full h-[320px] md:h-[400px] bg-white border border-borderSoft shadow-card rounded-xl2 relative overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [5, 3.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <color attach="background" args={["#ffffff"]} />
        <hemisphereLight args={[0xffffff, 0x9aa3a7, 0.6]} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={0.95}
          color={0xfff1e0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight position={[-5, 7, -4]} angle={0.35} penumbra={0.6} intensity={0.38} color="#97b7f5" />

        {/* Scene */}
        <House />

        {/* Ground helpers */}
        <Grid
          args={[20, 20]}
          cellSize={0.4}
          cellThickness={0.5}
          sectionSize={2}
          sectionThickness={0.8}
          sectionColor="#d1d5db"
          cellColor="#eceff3"
          fadeDistance={12}
          fadeStrength={1}
          infiniteGrid
        />
        <ContactShadows position={[0, 0, 0]} opacity={0.25} scale={8} blur={1.3} far={8} />

        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={0.95}
          maxPolarAngle={1.35}
        />
      </Canvas>
    </div>
  );
}
