import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group, Object3D } from "three";
import { Box3, Vector3 } from "three";
import { AVATAR_MODEL_URL, preloadAvatarModel } from "../game/avatarAsset";
import { CHARACTER_HEIGHT, CHARACTER_MODEL_YAW_OFFSET } from "../game/constants";

const MODEL_BOX = new Box3();
const MODEL_SIZE = new Vector3();
const MODEL_CENTER = new Vector3();

type AvatarProps = {
  onReady: (modelScale: number) => void;
};

export default function Avatar({ onReady }: AvatarProps) {
  const modelRef = useRef<Group>(null);
  const { scene } = useGLTF(AVATAR_MODEL_URL);
  const modelScene = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const model = modelRef.current;
    if (!model) return;

    model.position.set(0, 0, 0);
    model.scale.setScalar(1);
    model.updateMatrixWorld(true);

    model.traverse((object: Object3D) => {
      if (!("isMesh" in object)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      object.raycast = () => undefined;
    });

    MODEL_BOX.setFromObject(model);
    MODEL_BOX.getSize(MODEL_SIZE);
    MODEL_BOX.getCenter(MODEL_CENTER);

    const scale = CHARACTER_HEIGHT / Math.max(MODEL_SIZE.y, 0.001);
    model.scale.setScalar(scale);
    model.updateMatrixWorld(true);

    MODEL_BOX.setFromObject(model);
    MODEL_BOX.getSize(MODEL_SIZE);
    MODEL_BOX.getCenter(MODEL_CENTER);
    model.position.set(
      -MODEL_CENTER.x,
      -MODEL_BOX.min.y - CHARACTER_HEIGHT / 2,
      -MODEL_CENTER.z,
    );

    onReady(scale);
  }, [modelScene, onReady]);

  return (
    <group ref={modelRef} rotation={[0, CHARACTER_MODEL_YAW_OFFSET, 0]}>
      <primitive object={modelScene} />
    </group>
  );
}

preloadAvatarModel();