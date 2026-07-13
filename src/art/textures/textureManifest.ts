import type { TextureAssetId } from "../materials/materialTypes";

export type TextureKind = "tileable" | "atlas" | "decal" | "screen";

export type TextureManifestEntry = {
  id: TextureAssetId;
  kind: TextureKind;
  sourceMaster: string;
  ktx2: string;
  webpFallback: string;
  colorSpace: "srgb" | "linear";
  repeat?: [number, number];
  atlasRegion?: [number, number, number, number];
  lowQualityVariant?: string;
};

export const TEXTURE_RUNTIME_LIMITS = {
  categoryAtlas: 2048,
  kazamAlbedoAtlas: 1024,
  kazamDecalAtlas: 512,
  atlasGutter: 16,
} as const;

export const TEXTURE_MANIFEST: TextureManifestEntry[] = [
  {
    id: "shared.material-surfaces",
    kind: "atlas",
    sourceMaster: "/art-source/shared/material-surfaces.png",
    ktx2: "/textures/shared/material-surfaces.ktx2",
    webpFallback: "/textures/shared/material-surfaces.webp",
    colorSpace: "srgb",
    lowQualityVariant: "/textures/shared/material-surfaces-512.webp",
  },
  {
    id: "kazam.albedo",
    kind: "atlas",
    sourceMaster: "/art-source/kazam/kazam-albedo.png",
    ktx2: "/textures/kazam/kazam-albedo.ktx2",
    webpFallback: "/textures/kazam/kazam-albedo.webp",
    colorSpace: "srgb",
    lowQualityVariant: "/textures/kazam/kazam-albedo-512.webp",
  },
  {
    id: "kazam.decals",
    kind: "decal",
    sourceMaster: "/art-source/kazam/kazam-decals.png",
    ktx2: "/textures/kazam/kazam-decals-uastc.ktx2",
    webpFallback: "/textures/kazam/kazam-decals.webp",
    colorSpace: "srgb",
    lowQualityVariant: "/textures/kazam/kazam-decals-256.webp",
  },
];
