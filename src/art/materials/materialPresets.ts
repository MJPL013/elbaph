import type { ElbaphMaterialId, MaterialPreset } from "./materialTypes";

export const ELBAPH_MATERIAL_PRESETS: Record<ElbaphMaterialId, MaterialPreset> = {
  "concrete.warm": preset("concrete.warm", "painted-concrete", "#E8DDC8"),
  "concrete.sage": preset("concrete.sage", "painted-concrete", "#9FB7A1"),
  "concrete.coral": preset("concrete.coral", "painted-concrete", "#D98B72"),
  "wood.honey": preset("wood.honey", "painted-wood", "#C98B57"),
  "wood.cedar": preset("wood.cedar", "painted-wood", "#76523B"),
  "roof.terracotta": preset("roof.terracotta", "roof-tiles", "#C96E55"),
  "roof.teal": preset("roof.teal", "roof-tiles", "#547E78"),
  "glass.sky": {
    ...preset("glass.sky", "stylized-glass", "#81B7C4"),
    transparent: true,
    opacity: 0.68,
  },
  "metal.graphite": preset("metal.graphite", "matte-metal", "#3F464B"),
  "metal.warm": preset("metal.warm", "matte-metal", "#7B7770"),
  "metal.energy": preset("metal.energy", "matte-metal", "#E6B94F"),
  "stone.warm": preset("stone.warm", "painted-stone", "#9F9A88"),
  "road.asphalt": preset("road.asphalt", "road", "#596260"),
  "road.marking": preset("road.marking", "road", "#E9DFC7"),
  "vegetation.leaf": preset("vegetation.leaf", "vegetation", "#6F9B63"),
  "vegetation.deep": preset("vegetation.deep", "vegetation", "#3F6F56"),
};

function preset(id: ElbaphMaterialId, family: string, baseColor: string): MaterialPreset {
  return { id, family, baseColor };
}
