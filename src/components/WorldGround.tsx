"use client";
import { Grid } from '@react-three/drei';

export default function WorldGround() {
    return (
        <>
            {/* Ground Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial
                    color="#14112b"
                    emissive="#0d0a21"
                    emissiveIntensity={0.5}
                    roughness={0.4}
                />
            </mesh>

            {/* Glowing Grid Floor Overlay */}
            <Grid
                args={[20, 20]}
                position={[0, 0.01, 0]}
                cellColor="#a855f7"
                sectionColor="#c084fc"
                cellSize={1}
                sectionSize={5}
                fadeDistance={30}
                fadeStrength={1.5}
            />
        </>
    );
}