"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function ParticleCore() {
    const pointsRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const count = 8000;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const radius = 0.8 + Math.random() * 0.4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }

        return positions;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.025}
                color="#d946ef"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    );
}

function WireframeCage() {
    const cageRef = useRef<THREE.Mesh>(null);
    const nodesRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (cageRef.current) {
            cageRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
        if (nodesRef.current) {
            nodesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <group>
            {/* Main Cage - Wireframe */}
            <mesh ref={cageRef}>
                <icosahedronGeometry args={[1.5, 2]} />
                <meshBasicMaterial
                    color="#a855f7"
                    wireframe
                    transparent
                    opacity={0.25}
                />
            </mesh>

            {/* Connection Nodes - Points */}
            <points ref={nodesRef}>
                <icosahedronGeometry args={[1.5, 2]} />
                <pointsMaterial
                    size={0.03}
                    color="#ffffff"
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Inner Glow Sphere */}
            <mesh>
                <sphereGeometry args={[1.4, 32, 32]} />
                <meshBasicMaterial
                    color="#d946ef"
                    transparent
                    opacity={0.08}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer Glow Halo - Layer 1 */}
            <mesh>
                <sphereGeometry args={[1.6, 32, 32]} />
                <meshBasicMaterial
                    color="#a855f7"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer Glow Halo - Layer 2 */}
            <mesh>
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshBasicMaterial
                    color="#7c3aed"
                    transparent
                    opacity={0.03}
                    side={THREE.BackSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

function FloatingUIPanel({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.0005;
        }
    });

    return (
        <mesh ref={meshRef} position={position} rotation={rotation}>
            <planeGeometry args={[0.6 * scale, 0.4 * scale]} />
            <meshBasicMaterial
                color="#a855f7"
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

function DataFlowArcs() {
    const arcGeometries = useMemo(() => {
        const arcs = [];
        for (let i = 0; i < 8; i++) {
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(
                    Math.cos(i * Math.PI / 4) * 1.2,
                    -0.5,
                    Math.sin(i * Math.PI / 4) * 1.2
                ),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(
                    Math.cos((i + 1) * Math.PI / 4) * 1.2,
                    -0.5,
                    Math.sin((i + 1) * Math.PI / 4) * 1.2
                )
            );
            arcs.push(curve.getPoints(50));
        }
        return arcs;
    }, []);

    return (
        <group>
            {arcGeometries.map((points, i) => (
                <line key={i}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={points.length}
                            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial
                        color="#c084fc"
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </line>
            ))}
        </group>
    );
}

function DigitalCore() {
    return (
        <group scale={[0.5, 0.5, 0.5]}>
            {/* Central Particle Core */}
            <ParticleCore />

            {/* Wireframe Network Cage */}
            <WireframeCage />


            {/* Data Flow Arcs */}
            <DataFlowArcs />

            {/* Central Core Light */}
            <pointLight position={[0, 0, 0]} intensity={3} color="#a855f7" distance={5} />
            <pointLight position={[0, 0, 0]} intensity={1.5} color="#d946ef" distance={8} />
        </group>
    );
}

export default function CelestialBody() {
    return (
        <div className="w-full h-full relative z-0">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true, antialias: true }}>
                <ambientLight intensity={0.1} />
                <pointLight position={[5, 5, 5]} intensity={0.5} color="#a855f7" />
                <Suspense fallback={null}>
                    <DigitalCore />
                </Suspense>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI}
                    minPolarAngle={0}
                />
            </Canvas>
        </div>
    );
}
