export const ELBAPH_MATERIAL_IDS = [
  "concrete.warm",
  "concrete.sage",
  "concrete.coral",
  "wood.honey",
  "wood.cedar",
  "roof.terracotta",
  "roof.teal",
  "glass.sky",
  "metal.graphite",
  "metal.warm",
  "metal.energy",
  "stone.warm",
  "road.asphalt",
  "road.marking",
  "vegetation.leaf",
  "vegetation.deep",
] as const;

export type ElbaphMaterialId = (typeof ELBAPH_MATERIAL_IDS)[number];
export type TextureAssetId = string;

export type MaterialPreset = {
  id: ElbaphMaterialId;
  family: string;
  baseColor: string;
  map?: TextureAssetId;
  transparent?: boolean;
  opacity?: number;
};

export type BuildingPrimitiveProps = {
  material: ElbaphMaterialId;
  uvScale?: [number, number];
};
