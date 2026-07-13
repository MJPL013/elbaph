import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import {
  DataTexture,
  MeshToonMaterial,
  NearestFilter,
  RGBAFormat,
  SRGBColorSpace,
  UnsignedByteType,
} from "three";
import { ELBAPH_MATERIAL_PRESETS } from "./materialPresets";
import { ELBAPH_MATERIAL_IDS } from "./materialTypes";
import type { ElbaphMaterialId } from "./materialTypes";

type MaterialLibrary = Map<ElbaphMaterialId, MeshToonMaterial>;

const MaterialContext = createContext<MaterialLibrary | null>(null);

export function ElbaphMaterialProvider({ children }: { children: ReactNode }) {
  const resources = useMemo(() => createMaterialLibrary(), []);

  useEffect(() => {
    return () => {
      resources.materials.forEach((material) => material.dispose());
      resources.gradient.dispose();
    };
  }, [resources]);

  return (
    <MaterialContext.Provider value={resources.materials}>
      {children}
    </MaterialContext.Provider>
  );
}

export function useElbaphMaterial(id: ElbaphMaterialId) {
  const library = useContext(MaterialContext);
  if (!library) throw new Error("useElbaphMaterial must be used inside ElbaphMaterialProvider.");
  const material = library.get(id);
  if (!material) throw new Error(`Unknown Elbaph material: ${id}`);
  return material;
}

export function useElbaphMaterialLibrary() {
  const library = useContext(MaterialContext);
  if (!library) throw new Error("Material library is unavailable outside ElbaphMaterialProvider.");
  return library;
}

function createMaterialLibrary() {
  const gradient = createGradientMap();
  const materials: MaterialLibrary = new Map();

  for (const id of ELBAPH_MATERIAL_IDS) {
    const preset = ELBAPH_MATERIAL_PRESETS[id];
    const material = new MeshToonMaterial({
      color: preset.baseColor,
      gradientMap: gradient,
      transparent: preset.transparent ?? false,
      opacity: preset.opacity ?? 1,
      depthWrite: !(preset.transparent ?? false),
    });
    material.name = `elbaph:${id}`;
    material.userData.elbaphMaterialId = id;
    materials.set(id, material);
  }

  return { gradient, materials };
}

function createGradientMap() {
  const colors = new Uint8Array([
    92, 84, 76, 255,
    182, 168, 148, 255,
    255, 246, 226, 255,
  ]);
  const texture = new DataTexture(colors, 3, 1, RGBAFormat, UnsignedByteType);
  texture.name = "elbaph:three-band-toon-ramp";
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}
