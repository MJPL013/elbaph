import { useGLTF } from "@react-three/drei";

export const AVATAR_MODEL_URL = new URL(
  "../../../../3d_models/son_goku_and_kintoun_nimbus.glb",
  import.meta.url,
).href;

export function preloadAvatarModel() {
  useGLTF.preload(AVATAR_MODEL_URL);
}

export function clearAvatarModelCache() {
  useGLTF.clear(AVATAR_MODEL_URL);
}
