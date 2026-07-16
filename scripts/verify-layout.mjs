import { readFileSync } from "node:fs";

const source = readFileSync("src/world/landmarkData.ts", "utf8");
const itemPattern = /id:\s*"([^"]+)"[\s\S]*?latitude:\s*(-?\d+)[\s\S]*?longitude:\s*(-?\d+)/g;
const points = [...source.matchAll(itemPattern)].map((match) => ({
  id: match[1],
  latitude: Number(match[2]),
  longitude: Number(match[3]),
}));

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function angularDistance(a, b) {
  const latA = toRadians(a.latitude);
  const latB = toRadians(b.latitude);
  const lonDelta = toRadians(a.longitude - b.longitude);
  const cosine =
    Math.sin(latA) * Math.sin(latB) +
    Math.cos(latA) * Math.cos(latB) * Math.cos(lonDelta);

  return (Math.acos(Math.min(1, Math.max(-1, cosine))) * 180) / Math.PI;
}

let closest = { pair: "", degrees: Infinity };

for (let i = 0; i < points.length; i += 1) {
  for (let j = i + 1; j < points.length; j += 1) {
    const degrees = angularDistance(points[i], points[j]);
    if (degrees < closest.degrees) {
      closest = { pair: `${points[i].id}/${points[j].id}`, degrees };
    }
  }
}

const north = points.filter((point) => point.latitude > 20).length;
const equator = points.filter(
  (point) => point.latitude >= -20 && point.latitude <= 20,
).length;
const south = points.filter((point) => point.latitude < -20).length;
const east = points.filter((point) => point.longitude > 0).length;
const west = points.filter((point) => point.longitude < 0).length;

if (points.length < 20) throw new Error(`Expected >= 20 buildings, got ${points.length}`);
if (north < 5 || equator < 5 || south < 5) {
  throw new Error(`Poor latitude spread: north=${north}, equator=${equator}, south=${south}`);
}
if (east < 8 || west < 8) throw new Error(`Poor longitude spread: east=${east}, west=${west}`);
if (closest.degrees < 22) {
  throw new Error(`Buildings too close: ${closest.pair} at ${closest.degrees.toFixed(1)} deg`);
}

console.log(
  JSON.stringify(
    { ok: true, total: points.length, north, equator, south, east, west, closest },
    null,
    2,
  ),
);
