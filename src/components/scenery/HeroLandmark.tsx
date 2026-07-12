import type { LandmarkDefinition } from "../../game/landmarkData";
import {
  ChallengePodiumBuilding,
  PersonalStudioBuilding,
  ResearchObservatoryBuilding,
  SolarHouseBuilding,
} from "./buildings/CreativeBuildings";
import {
  ContactBeaconBuilding,
  SkillsTowerBuilding,
  SpawnPavilionBuilding,
} from "./buildings/ContactBuildings";
import {
  KazamBuilding,
  NaxxatraBuilding,
  SatelliteLabBuilding,
} from "./buildings/ExperienceBuildings";
import {
  PersonaBuilding,
  RajneetiBuilding,
  VakyaSaarBuilding,
} from "./buildings/ProjectBuildings";
import { WorldBillboardLabel } from "./WorldBillboardLabel";

const DEFAULT_LABEL_OFFSET: [number, number, number] = [0, 0.76, -0.08];

type HeroLandmarkProps = {
  landmark: LandmarkDefinition;
  label: string;
};

export function HeroLandmark({ landmark, label }: HeroLandmarkProps) {
  return (
    <group userData={{ sceneryMesh: true, portfolioLandmark: true }}>
      <BuildingForLandmark landmark={landmark} />
      <WorldBillboardLabel label={label} position={landmark.labelOffset ?? DEFAULT_LABEL_OFFSET} />
    </group>
  );
}

function BuildingForLandmark({ landmark }: { landmark: LandmarkDefinition }) {
  const props = { color: landmark.color, decalTheme: landmark.decalTheme };

  if (landmark.buildingArchetype === "ev-charger") return <KazamBuilding {...props} />;
  if (landmark.buildingArchetype === "satellite-lab") return <SatelliteLabBuilding {...props} />;
  if (landmark.buildingArchetype === "learning-clubhouse") return <NaxxatraBuilding {...props} />;
  if (landmark.buildingArchetype === "civic-terminal") return <RajneetiBuilding {...props} />;
  if (landmark.buildingArchetype === "archive-library") return <VakyaSaarBuilding {...props} />;
  if (landmark.buildingArchetype === "agent-lab") return <PersonaBuilding {...props} />;
  if (landmark.buildingArchetype === "solar-house") return <SolarHouseBuilding {...props} />;
  if (landmark.buildingArchetype === "challenge-podium") return <ChallengePodiumBuilding {...props} />;
  if (landmark.buildingArchetype === "research-observatory") return <ResearchObservatoryBuilding {...props} />;
  if (landmark.buildingArchetype === "personal-studio") return <PersonalStudioBuilding {...props} />;
  if (landmark.buildingArchetype === "spawn-pavilion") return <SpawnPavilionBuilding {...props} />;
  if (landmark.buildingArchetype === "skills-tower") return <SkillsTowerBuilding {...props} />;
  return <ContactBeaconBuilding {...props} />;
}
