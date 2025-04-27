import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Physics, RigidBody, vec3 } from '@react-three/rapier';

// Constants
const G = 6.67430e-11; // Gravitational constant
const c = 299792458; // Speed of light
const SOLAR_MASS = 1.989e30; // kg

// Enhanced visualization component
function CosmicObjectVisualization({ 
  type, 
  mass, 
  isSpaghettifying, 
  showMetrics,
  objectDistance
}) {
  const meshRef = useRef();
  const testObjRef = useRef();
  const [tidalForce, setTidalForce] = useState(0);
  const [physicsData, setPhysicsData] = useState({});

  // Calculate properties based on type
  const properties = useMemo(() => {
    if (type === 'blackHole') {
      const schwarzschildRadius = (2 * G * mass * SOLAR_MASS) / (c * c) / 1000; // in km
      return {
        radius: schwarzschildRadius,
        color: '#9d00ff',
        name: 'Black Hole',
        unit: 'M☉'
      };
    } else { // neutron star
      const radius = 12; // Typical neutron star radius in km
      return {
        radius,
        color: '#00a2ff',
        name: 'Neutron Star',
        unit: 'Mʘ' // Solar mass symbol
      };
    }
  }, [type, mass]);

  // Physics calculations
  useFrame((state, delta) => {
    if (!testObjRef.current || !meshRef.current) return;

    // Calculate distance in simulation units (1 unit = 1000km)
    const distance = vec3(testObjRef.current.translation()).distanceTo(
      vec3(meshRef.current.position)
    ) * 1000; // convert to km

    // Calculate tidal force (simplified)
    const R = type === 'blackHole' ? properties.radius : properties.radius;
    const calcTidalForce = (2 * G * mass * SOLAR_MASS * 1.8) / (Math.pow(distance * 1000, 3)); // Assuming 1.8m tall person
    
    if (isSpaghettifying) {
      // Animate spaghettification
      const newForce = Math.min(1, tidalForce + delta * 0.3);
      setTidalForce(newForce);
      
      // Apply deformation
      testObjRef.current.setLinvel({ x: 0, y: 0, z: -10 }, true);
      testObjRef.current.setScale({
        x: 1 - newForce * 0.5,
        y: 1 + newForce * 10,
        z: 1 - newForce * 0.5
      });
      
      // Update physics data
      setPhysicsData({
        surfaceGravity: (G * mass * SOLAR_MASS) / Math.pow(R * 1000, 2),
        tidalForce: calcTidalForce,
        breakupDistance: Math.cbrt((2 * mass * SOLAR_MASS * 1.8) / 1000) // Roche limit in km
      });
    }
  });

  return (
    <group>
      <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade />
      
      {/* Central Object */}
      <mesh ref={meshRef} position={[0, 0, -objectDistance]}>
        <sphereGeometry args={[properties.radius / 1000, 64, 64]} />
        <meshStandardMaterial 
          color={properties.color} 
          emissive={properties.color} 
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
        {type === 'neutronStar' && (
          <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <ringGeometry args={[properties.radius/1000 + 0.1, properties.radius/1000 + 0.5, 64]} />
            <meshBasicMaterial color="cyan" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}
      </mesh>

      {/* Test Object */}
      <RigidBody 
        ref={testObjRef} 
        position={[0, 0, 5]} 
        colliders="cuboid"
        restitution={0.1}
      >
        <mesh castShadow>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial 
            color="orange" 
            emissive="yellow" 
            emissiveIntensity={0.5}
          />
        </mesh>
      </RigidBody>

      {/* Physics Metrics */}
      {showMetrics && (
        <group position={[0, -5, 0]}>
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.5}
            position={[0, 1.5, 0]}
          >
            {`${properties.name} (${mass}${properties.unit})`}
          </Text>
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.4}
          >
            {`Surface Gravity: ${(physicsData.surfaceGravity / 9.8).toFixed(0)} g`}
          </Text>
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.4}
            position={[0, -0.8, 0]}
          >
            {`Tidal Force: ${(physicsData.tidalForce / 1e9).toFixed(2)} × 10⁹ N/m²`}
          </Text>
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.4}
            position={[0, -1.6, 0]}
          >
            {`Breakup Distance: ${physicsData.breakupDistance?.toFixed(2) || '--'} km`}
          </Text>
        </group>
      )}
    </group>
  );
}

// New quiz questions comparing black holes and neutron stars
const neutronStarQuizQuestions = [
  {
    id: 6,
    question: "How do tidal forces compare between a 1.4M☉ neutron star and 10M☉ black hole at same distance?",
    options: [
      "Neutron star's are stronger due to smaller radius",
      "Black hole's are always stronger regardless of mass",
      "They're identical if masses are equal",
      "Depends on the black hole's spin"
    ],
    answer: 0,
    explanation: "At equal distances, neutron stars produce stronger tidal forces due to their extremely compact size (~10km vs ~30km Schwarzschild radius for 1.4M☉ NS vs 10M☉ BH)."
  },
  {
    id: 7,
    question: "Why can you get closer to a black hole before spaghettification compared to a neutron star?",
    options: [
      "Black holes have no solid surface",
      "Event horizon protects you from tidal forces",
      "Neutron stars have stronger magnetic fields",
      "General relativistic effects soften the tidal forces"
    ],
    answer: 3,
    explanation: "GR's non-linear effects cause tidal forces to diverge more slowly near black holes. For a 10M☉ BH, spaghettification occurs at ~300km vs ~50km for a 1.4M☉ NS."
  },
  {
    id: 8,
    question: "What's the maximum survivable approach to a 1.4M☉ neutron star?",
    options: [
      "~1000 km (outside magnetosphere)",
      "~100 km (outside x-ray emission zone)",
      "~50 km (Roche limit for human body)",
      "~10 km (nearly touching surface)"
    ],
    answer: 2,
    explanation: "At ~50km, tidal forces reach 10⁸ N/m² (human body limit). The exact Roche limit is R = d(2M/m)^(1/3) ≈ 48km for standard parameters."
  }
];

export default function EnhancedSpaghettification() {
  const [activeTab, setActiveTab] = useState('blackHole');
  const [mass, setMass] = useState(10);
  const [isSpaghettifying, setIsSpaghettifying] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const demonstratePhysics = () => {
    setIsSpaghettifying(true);
    setTimeout(() => setIsSpaghettifying(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Relativistic Tidal Forces
        </h1>
        
        {/* Comparison Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-900 p-1">
            <button
              onClick={() => setActiveTab('blackHole')}
              className={`px-6 py-2 rounded-md ${activeTab === 'blackHole' ? 'bg-purple-600' : 'hover:bg-gray-800'}`}
            >
              Black Hole
            </button>
            <button
              onClick={() => setActiveTab('neutronStar')}
              className={`px-6 py-2 rounded-md ${activeTab === 'neutronStar' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              Neutron Star
            </button>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-6 py-2 rounded-md hover:bg-gray-800 border-l border-r border-gray-700"
            >
              {showComparison ? 'Hide Comparison' : 'Show Comparison'}
            </button>
          </div>
        </div>

        {/* Mass Controls */}
        <div className="mb-6 flex justify-center items-center gap-4">
          <span className="text-lg">
            Mass: {mass}{activeTab === 'blackHole' ? ' M☉' : ' Mʘ'}
          </span>
          <input
            type="range"
            min={activeTab === 'blackHole' ? 3 : 1}
            max={activeTab === 'blackHole' ? 100 : 2.5}
            step={0.1}
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            className="w-64"
          />
          <button 
            onClick={demonstratePhysics}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
          >
            Demonstrate Tidal Forces
          </button>
        </div>

        {/* Visualization Area */}
        <div className="relative h-[500px] bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
          <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            <Physics gravity={[0, 0, 0]}>
              {showComparison ? (
                <>
                  <CosmicObjectVisualization
                    type="blackHole"
                    mass={mass}
                    isSpaghettifying={isSpaghettifying}
                    showMetrics={true}
                    objectDistance={10}
                  />
                  <CosmicObjectVisualization
                    type="neutronStar"
                    mass={1.4}
                    isSpaghettifying={isSpaghettifying}
                    showMetrics={true}
                    objectDistance={-10}
                  />
                </>
              ) : (
                <CosmicObjectVisualization
                  type={activeTab}
                  mass={mass}
                  isSpaghettifying={isSpaghettifying}
                  showMetrics={true}
                  objectDistance={0}
                />
              )}
              <OrbitControls enableZoom={true} enablePan={false} />
            </Physics>
          </Canvas>
        </div>

        {/* Physics Comparison Table */}
        <div className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Tidal Force Comparison</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-2">Property</th>
                <th className="pb-2">1.4M☉ Neutron Star</th>
                <th className="pb-2">10M☉ Black Hole</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="py-3">Radius</td>
                <td>~12 km</td>
                <td>~30 km (Schwarzschild)</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3">Surface Gravity</td>
                <td>~2×10¹¹ m/s² (2×10¹⁰ g)</td>
                <td>Infinite at singularity</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3">Tidal Force at 100km</td>
                <td>~3×10⁹ N/m²</td>
                <td>~1×10⁸ N/m²</td>
              </tr>
              <tr>
                <td className="py-3">Human Survival Distance</td>
                <td>~50 km</td>
                <td>~300 km</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Enhanced Quiz Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Tidal Forces Quiz</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[...quizQuestions, ...neutronStarQuizQuestions].map((q) => (
              <div key={q.id} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-3">{q.id}. {q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer">
                      <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                        {i === q.answer && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                      </div>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-800/30 rounded-lg text-sm">
                  <strong>Physics:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}