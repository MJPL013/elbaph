import { Outlines } from "@react-three/drei";

type InkOutlineProps = {
  thickness?: number;
};

export function InkOutline({ thickness = 0.03 }: InkOutlineProps) {
  return (
    <Outlines
      color="#241006"
      thickness={thickness}
      screenspace
      toneMapped={false}
      polygonOffset
      polygonOffsetFactor={-2}
    />
  );
}
