import fs from "fs";
import { min, uniq } from "lodash";

interface MapEntry {
  destination: number;
  source: number;
  range: number;
}

interface MapObject {
  mapName: string;
  mappings: MapEntry[];
}

function parseInput(input: string): MapObject[] {
  const maps: MapObject[] = [];
  const sections = input.trim().split("\n\n");

  sections.forEach((section) => {
    const lines = section.trim().split("\n");
    const mapName = lines.shift();
    const mapEntries: MapEntry[] = [];

    lines.forEach((line) => {
      const values = line.split(" ").map(Number);
      if (values.length === 3) {
        mapEntries.push({
          destination: values[0],
          source: values[1],
          range: values[2],
        });
      }
    });

    if (mapName && mapEntries.length > 0) {
      const mapObject: MapObject = {
        mapName,
        mappings: mapEntries,
      };
      maps.push(mapObject);
    }
  });

  return maps;
}

// const data = fs.readFileSync("./05/test.txt", "utf8");
const data = fs.readFileSync("./05/input.txt", "utf8");

const parsedMaps = parseInput(data.replace(/.*?\n/, ""));

const processMap = (map: MapObject, seed: number) => {
  for (let i = 0; i < map.mappings.length; i++) {
    const range = map.mappings[i];
    if (seed >= range.source && seed <= range.source + range.range) {
      const diff = range.destination - range.source;
      return seed + diff;
    }
  }
  return seed;
};

const processSeed = (seed: number) => {
  parsedMaps.forEach((map: MapObject) => {
    seed = processMap(map, seed);
  });
  return seed;
};

// part 1
// const seeds = data
//   .split("\n", 2)[0]
//   .replace("seeds: ", "")
//   .split(" ")
//   .map(Number);

// const locations = seeds.map(processSeed);
// console.log(min(locations));

// part 2:
const seedPairs = data
  .split("\n", 2)[0]
  .replace("seeds: ", "")
  .split(" ")
  .map(Number);

const start = new Date().getTime();
console.log(start);

let lowestLocation = Infinity;
for (let i = 0; i < seedPairs.length; i += 2) {
  console.log(`${Math.round((i / seedPairs.length) * 100)}%`);
  for (let j = 0; j < seedPairs[i + 1]; j++) {
    lowestLocation = Math.min(lowestLocation, processSeed(seedPairs[i] + j));
  }
}
console.log(lowestLocation);
console.log(new Date().getTime() - start);
