import type { InstancedMesh, Material, Mesh, Object3D } from "three";

export type SceneDiagnostics = {
  sceneMaterialCount: number;
  usedElbaphMaterialCount: number;
  duplicateElbaphMaterialCount: number;
  kazamHeroCount: number;
  kazamMeshCount: number;
  kazamTriangles: number;
  kazamDrawCalls: number;
  kazamMaterialSlots: string[];
};

export function collectSceneDiagnostics(root: Object3D): SceneDiagnostics {
  const sceneMaterials = new Set<string>();
  const elbaphMaterials = new Map<string, Set<string>>();
  const kazamSlots = new Set<string>();
  let kazamHeroCount = 0;
  let kazamMeshCount = 0;
  let kazamTriangles = 0;
  let kazamDrawCalls = 0;

  root.traverse((object) => {
    if (object.userData.kazamHero) {
      kazamHeroCount += 1;
      for (const slot of object.userData.materialSlots ?? []) kazamSlots.add(String(slot));
      object.traverse((child) => {
        if (!isMesh(child)) return;
        kazamMeshCount += 1;
        kazamDrawCalls += 1;
        kazamTriangles += triangleCount(child);
      });
    }

    if (!isMesh(object)) return;
    for (const material of asMaterials(object.material)) {
      sceneMaterials.add(material.uuid);
      const id = material.userData.elbaphMaterialId;
      if (typeof id !== "string") continue;
      const uuids = elbaphMaterials.get(id) ?? new Set<string>();
      uuids.add(material.uuid);
      elbaphMaterials.set(id, uuids);
    }
  });

  let duplicateElbaphMaterialCount = 0;
  for (const uuids of elbaphMaterials.values()) {
    if (uuids.size > 1) duplicateElbaphMaterialCount += uuids.size - 1;
  }

  return {
    sceneMaterialCount: sceneMaterials.size,
    usedElbaphMaterialCount: elbaphMaterials.size,
    duplicateElbaphMaterialCount,
    kazamHeroCount,
    kazamMeshCount,
    kazamTriangles,
    kazamDrawCalls,
    kazamMaterialSlots: Array.from(kazamSlots),
  };
}

function isMesh(object: Object3D): object is Mesh {
  return "isMesh" in object && Boolean((object as Mesh).isMesh);
}

function asMaterials(material: Material | Material[]) {
  return Array.isArray(material) ? material : [material];
}

function triangleCount(mesh: Mesh) {
  const geometry = mesh.geometry;
  const baseCount = geometry.index?.count ?? geometry.attributes.position?.count ?? 0;
  const instances = "isInstancedMesh" in mesh && (mesh as InstancedMesh).isInstancedMesh
    ? (mesh as InstancedMesh).count
    : 1;
  return Math.round((baseCount / 3) * instances);
}
