import fs from "fs";

// const data = fs.readFileSync("./06/input.txt", "utf8");
const data = fs.readFileSync("./06/part2.txt", "utf8");
// const data = fs.readFileSync("./06/test.txt", "utf8");

interface Race {
  duration: number;
  distance: number;
}

function multiplyArrayElements(arr: number[]): number {
  // Check if the array is empty
  if (arr.length === 0) {
    return 0; // Return 0 if the array is empty or handle it as needed
  }

  // Use the reduce method to multiply all elements in the array
  const result = arr.reduce(
    (accumulator, currentValue) => accumulator * currentValue
  );

  return result;
}

function parseText(input: string): Race[] {
  const lines = input.split("\n");
  const durations = lines[0].match(/\d+/g) || [];
  const distances = lines[1].match(/\d+/g) || [];
  const result: Race[] = [];

  for (let i = 0; i < Math.max(durations.length, distances.length); i++) {
    const duration = parseInt(durations[i], 10) || 0;
    const distance = parseInt(distances[i], 10) || 0;

    result.push({ duration, distance });
  }

  return result;
}

const races = parseText(data);
console.log(races);

const raceSolutions = races.map((race) => {
  let solutions = 0;
  for (let i = 0; i < race.duration; i++) {
    if (i * (race.duration - i) > race.distance) {
      solutions++;
    }
  }
  return solutions;
});

console.log(raceSolutions);
console.log(multiplyArrayElements(raceSolutions));
