import { BackSide, Color } from "three";

const VERTEX_SHADER = [
  "varying vec3 vPosition;",
  "void main() {",
  "  vPosition = position;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const FRAGMENT_SHADER = [
  "uniform vec3 topColor;",
  "uniform vec3 horizonColor;",
  "uniform vec3 bottomColor;",
  "varying vec3 vPosition;",
  "void main() {",
  "  float height = normalize(vPosition).y;",
  "  float upper = smoothstep(-0.05, 0.8, height);",
  "  float lower = smoothstep(-0.9, 0.0, height);",
  "  vec3 lowMix = mix(bottomColor, horizonColor, lower);",
  "  gl_FragColor = vec4(mix(lowMix, topColor, upper), 1.0);",
  "}",
].join("\n");

export function SkyGradient() {
  return (
    <mesh scale={18} renderOrder={-1000} userData={{ atmosphereLayer: "sky" }}>
      <sphereGeometry args={[1, 24, 16]} />
      <shaderMaterial
        side={BackSide}
        depthWrite={false}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{
          topColor: { value: new Color("#6f7fc8") },
          horizonColor: { value: new Color("#f5b8aa") },
          bottomColor: { value: new Color("#4b3d72") },
        }}
      />
    </mesh>
  );
}
