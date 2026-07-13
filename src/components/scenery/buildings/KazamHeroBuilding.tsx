import { useLayoutEffect, useMemo, useRef } from "react";
import type { InstancedMesh } from "three";
import { CatmullRomCurve3, Object3D, Vector3 } from "three";
import { useElbaphMaterial } from "../../../art/materials/ElbaphMaterialProvider";
import { SharedToonMaterial, ToonBlock, ToonRoundedBlock } from "./BuildingKit";

const CHARGER_POSITIONS: Array<[number, number, number]> = [
  [-0.24, -0.05, -0.29],
  [0.04, -0.05, -0.29],
];
const BOLLARD_POSITIONS: Array<[number, number, number]> = [
  [-0.36, -0.24, -0.32],
  [-0.12, -0.24, -0.32],
  [0.16, -0.24, -0.32],
];
const MARKING_TRANSFORMS = [
  { position: [-0.27, 0, 0] as const, scale: [0.025, 0.014, 0.46] as const },
  { position: [0.14, 0, 0] as const, scale: [0.025, 0.014, 0.46] as const },
  { position: [-0.065, 0, -0.22] as const, scale: [0.43, 0.014, 0.025] as const },
];const TEMP_OBJECT = new Object3D();

export function KazamHeroBuilding({ lowQuality = false }: { lowQuality?: boolean }) {
  const cableCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-0.24, 0.02, -0.35),
        new Vector3(-0.38, 0.06, -0.34),
        new Vector3(-0.38, -0.13, -0.34),
        new Vector3(-0.28, -0.17, -0.34),
      ]),
    [],
  );

  return (
    <group
      userData={{
        portfolioBuilding: true,
        buildingArchetype: "ev-charger",
        kazamHero: true,
        materialSlots: [
          "concrete.warm",
          "roof.teal",
          "metal.graphite",
          "metal.energy",
          "road.asphalt",
          "road.marking",
          "glass.sky",
        ],
        atlasSlots: ["kazam.albedo", "kazam.decals"],
      }}
    >
      <ToonBlock
        position={[0, -0.32, 0]}
        scale={[0.86, 0.07, 0.7]}
        material="road.asphalt"
        uvScale={[2, 2]}
        lowOutline={lowQuality}
      />
      <ParkingMarks />
      <ToonRoundedBlock
        position={[0.19, -0.06, 0.11]}
        scale={[0.46, 0.47, 0.38]}
        material="concrete.warm"
        uvScale={[1, 1]}
        lowOutline={lowQuality}
      />
      <ToonBlock position={[0.19, 0.03, -0.09]} scale={[0.18, 0.16, 0.018]} material="glass.sky" />
      <Canopy lowQuality={lowQuality} />
      <InstancedChargers />
      <InstancedBollards />
      <ToonRoundedBlock position={[0.36, -0.19, 0.31]} scale={[0.2, 0.24, 0.16]} material="metal.graphite" />
      <ToonRoundedBlock position={[-0.34, -0.2, 0.2]} scale={[0.16, 0.2, 0.15]} material="metal.warm" />
      <mesh castShadow>
        <tubeGeometry args={[cableCurve, 12, 0.012, 6, false]} />
        <SharedToonMaterial material="metal.graphite" />
      </mesh>
      <SignageMast />
    </group>
  );
}

function Canopy({ lowQuality }: { lowQuality: boolean }) {
  return (
    <group rotation={[0.02, 0, -0.09]}>
      <ToonRoundedBlock
        position={[-0.12, 0.32, -0.02]}
        scale={[0.92, 0.08, 0.58]}
        material="roof.teal"
        uvScale={[2, 1]}
        lowOutline={lowQuality}
      />
      <ToonRoundedBlock position={[-0.38, 0.02, 0.17]} scale={[0.055, 0.58, 0.055]} material="metal.warm" />
      <ToonRoundedBlock position={[0.14, 0.02, 0.17]} scale={[0.055, 0.58, 0.055]} material="metal.warm" />
      <ToonBlock position={[-0.12, 0.365, -0.02]} scale={[0.82, 0.018, 0.48]} material="metal.graphite" />
    </group>
  );
}

function ParkingMarks() {
  const ref = useRef<InstancedMesh>(null);
  const material = useElbaphMaterial("road.marking");

  useLayoutEffect(() => {
    if (!ref.current) return;
    MARKING_TRANSFORMS.forEach((transform, index) => {
      TEMP_OBJECT.position.set(transform.position[0], transform.position[1], transform.position[2]);
      TEMP_OBJECT.scale.set(transform.scale[0], transform.scale[1], transform.scale[2]);
      TEMP_OBJECT.updateMatrix();
      ref.current?.setMatrixAt(index, TEMP_OBJECT.matrix);
    });
    TEMP_OBJECT.scale.set(1, 1, 1);
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={ref}
      position={[0, -0.278, -0.09]}
      args={[undefined, material, MARKING_TRANSFORMS.length]}
      userData={{ decalSlot: "energy", atlasSlot: "kazam.decals" }}
    >
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function InstancedChargers() {
  const ref = useRef<InstancedMesh>(null);
  const material = useElbaphMaterial("metal.graphite");
  useInstanceTransforms(ref, CHARGER_POSITIONS);

  return (
    <instancedMesh ref={ref} args={[undefined, material, CHARGER_POSITIONS.length]} castShadow>
      <boxGeometry args={[0.12, 0.34, 0.1]} />
    </instancedMesh>
  );
}

function InstancedBollards() {
  const ref = useRef<InstancedMesh>(null);
  const material = useElbaphMaterial("metal.energy");
  useInstanceTransforms(ref, BOLLARD_POSITIONS);

  return (
    <instancedMesh ref={ref} args={[undefined, material, BOLLARD_POSITIONS.length]} castShadow>
      <cylinderGeometry args={[0.025, 0.03, 0.18, 8]} />
    </instancedMesh>
  );
}

function SignageMast() {
  return (
    <group position={[0.39, -0.05, -0.27]} userData={{ decalSlot: "energy", atlasSlot: "kazam.decals" }}>
      <ToonBlock scale={[0.035, 0.5, 0.035]} material="metal.warm" />
      <ToonRoundedBlock position={[0, 0.23, 0]} scale={[0.22, 0.14, 0.035]} material="metal.energy" />
    </group>
  );
}

function useInstanceTransforms(
  ref: React.RefObject<InstancedMesh | null>,
  positions: Array<[number, number, number]>,
) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    positions.forEach((position, index) => {
      TEMP_OBJECT.position.set(...position);
      TEMP_OBJECT.updateMatrix();
      ref.current?.setMatrixAt(index, TEMP_OBJECT.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions, ref]);
}
