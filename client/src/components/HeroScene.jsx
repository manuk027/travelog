import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ───── Low-poly Mountain Terrain ───── */
function Mountains() {
    const meshRef = useRef();

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(16, 10, 60, 40);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            // Create mountain peaks with noise-like function
            let z = 0;
            z += Math.sin(x * 0.5) * Math.cos(y * 0.3) * 1.5;
            z += Math.sin(x * 0.8 + 1) * Math.cos(y * 0.6 + 2) * 0.8;
            z += Math.sin(x * 1.5 + 3) * Math.cos(y * 1.2) * 0.4;
            z += Math.sin(x * 2.5) * Math.cos(y * 2) * 0.2;
            // Fade out towards edges
            const edgeFade = Math.max(0, 1 - Math.pow(x / 8, 4)) * Math.max(0, 1 - Math.pow((y + 2) / 6, 4));
            pos.setZ(i, z * edgeFade);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            rotation={[-Math.PI / 2.5, 0, 0]}
            position={[0, -2, -2]}
        >
            <meshStandardMaterial
                color="#0a4a2e"
                flatShading
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/* ───── Procedural Low-poly Trees ───── */
function Tree({ position, scale = 1 }) {
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            // Gentle swaying
            groupRef.current.rotation.z = Math.sin(Date.now() * 0.001 + position[0] * 10) * 0.02;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 0.6, 5]} />
                <meshStandardMaterial color="#4a3728" flatShading />
            </mesh>
            {/* Foliage layers */}
            <mesh position={[0, 0.8, 0]}>
                <coneGeometry args={[0.35, 0.6, 6]} />
                <meshStandardMaterial color="#166534" flatShading transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
                <coneGeometry args={[0.28, 0.5, 6]} />
                <meshStandardMaterial color="#15803d" flatShading transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
                <coneGeometry args={[0.18, 0.4, 6]} />
                <meshStandardMaterial color="#22c55e" flatShading transparent opacity={0.85} />
            </mesh>
        </group>
    );
}

function TreeField() {
    const trees = useMemo(() => {
        const t = [];
        for (let i = 0; i < 25; i++) {
            const x = (Math.random() - 0.5) * 12;
            const z = (Math.random() - 0.5) * 6 - 1;
            const s = 0.4 + Math.random() * 0.6;
            // Place on terrain — approximate y from terrain function
            const terrainY = Math.sin(x * 0.5) * Math.cos(z * 0.3) * 0.8 +
                Math.sin(x * 0.8 + 1) * Math.cos(z * 0.6 + 2) * 0.4;
            t.push({ pos: [x, -1.5 + terrainY * 0.3, z], scale: s });
        }
        return t;
    }, []);

    return (
        <group>
            {trees.map((tree, i) => (
                <Tree key={i} position={tree.pos} scale={tree.scale} />
            ))}
        </group>
    );
}

/* ───── Floating Leaves ───── */
function FloatingLeaves({ count = 30 }) {
    const meshRef = useRef();
    const leavesData = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 14,
                    Math.random() * 6 - 1,
                    (Math.random() - 0.5) * 8
                ),
                speed: 0.2 + Math.random() * 0.5,
                rotSpeed: 0.5 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2,
                drift: 0.3 + Math.random() * 0.5,
            });
        }
        return data;
    }, [count]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.children.forEach((leaf, i) => {
                const d = leavesData[i];
                leaf.position.y = d.position.y + Math.sin(t * d.speed + d.phase) * 0.5;
                leaf.position.x = d.position.x + Math.sin(t * d.drift + d.phase) * 0.3;
                leaf.rotation.x = t * d.rotSpeed;
                leaf.rotation.z = Math.sin(t * d.speed) * 0.5;
            });
        }
    });

    return (
        <group ref={meshRef}>
            {leavesData.map((leaf, i) => (
                <mesh key={i} position={leaf.position}>
                    <planeGeometry args={[0.06, 0.08]} />
                    <meshBasicMaterial
                        color={i % 3 === 0 ? '#4ade80' : i % 3 === 1 ? '#22c55e' : '#16a34a'}
                        transparent
                        opacity={0.7}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

/* ───── Fireflies / Glowing Particles ───── */
function Fireflies({ count = 60 }) {
    const meshRef = useRef();

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 1] = Math.random() * 5 - 1;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
        return positions;
    }, [count]);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const t = clock.getElapsedTime();
            meshRef.current.rotation.y = t * 0.01;
            // Pulse the opacity
            meshRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.2;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color="#86efac"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

/* ───── Ambient Fog Particles ───── */
function FogParticles({ count = 100 }) {
    const meshRef = useRef();

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = Math.random() * 3 - 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, [count]);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.005;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#d1fae5"
                transparent
                opacity={0.15}
                sizeAttenuation
            />
        </points>
    );
}

/* ───── Main exported scene ───── */
const HeroScene = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 1, 7], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                {/* Nature lighting */}
                <ambientLight intensity={0.3} color="#d1fae5" />
                <directionalLight position={[5, 8, 5]} intensity={0.8} color="#bbf7d0" />
                <directionalLight position={[-3, 4, -2]} intensity={0.3} color="#6ee7b7" />

                <Mountains />
                <TreeField />
                <FloatingLeaves count={35} />
                <Fireflies count={70} />
                <FogParticles count={120} />

                <Stars
                    radius={30}
                    depth={50}
                    count={800}
                    factor={2}
                    saturation={0}
                    fade
                    speed={0.3}
                />
            </Canvas>
        </div>
    );
};

export default HeroScene;
