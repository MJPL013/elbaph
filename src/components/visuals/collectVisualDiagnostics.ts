import type { Object3D } from "three";

export type VisualDiagnostics = {
  fantasyPathCount: number;
  ambientInstanceCount: number;
  orbitalCloudCount: number;
  atmosphereLayerCount: number;
  wispCount: number;
  visualPackage: string | null;
};

export function collectVisualDiagnostics(
  planet: Object3D,
  scene: Object3D,
): VisualDiagnostics {
  let fantasyPathCount = 0;
  let ambientInstanceCount = 0;
  let orbitalCloudCount = 0;
  let atmosphereLayerCount = 0;
  let wispCount = 0;
  let visualPackage: string | null = null;

  planet.traverse((object) => {
    if (object.userData.fantasyPath) fantasyPathCount += 1;
    ambientInstanceCount += Number(object.userData.ambientInstanceCount ?? 0);
    if (object.userData.orbitalClouds) {
      orbitalCloudCount += Number(object.parent?.userData.cloudCount ?? 0);
    }
    if (typeof object.userData.visualPackage === "string") {
      visualPackage = object.userData.visualPackage;
    }
  });

  scene.traverse((object) => {
    if (object.userData.atmosphereLayer) atmosphereLayerCount += 1;
    wispCount += Number(object.userData.wispCount ?? 0);
  });

  return {
    fantasyPathCount,
    ambientInstanceCount,
    orbitalCloudCount,
    atmosphereLayerCount,
    wispCount,
    visualPackage,
  };
}
