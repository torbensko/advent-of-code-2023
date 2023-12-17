import fs from "fs";
import { flatten } from "lodash";

// Access the command-line arguments using process.argv
const args = process.argv;

// Check if the "-test" argument is provided
const MODE_DEBUG = args.includes("-test");

const input = fs.readFileSync(
  `${__dirname}/${MODE_DEBUG ? "test.txt" : "input.txt"}`,
  "utf8"
);

const lines = input.split("\n");

const blankColumnIndicies: number[] = [];
const blankRowIndicies: number[] = [];

interface Coord {
  x: number;
  y: number;
  distances: number[];
}

// const SCALE = 10; // 1030
// const SCALE = 100; // 8410
const SCALE = 1000000;

const points: Coord[] = [];

// determine which rows are blank
lines.map((line, i) => {
  if (line.match(/^\.+$/)) {
    blankRowIndicies.push(i);
  }
});

for (let col = 0; col < lines[0].length; col++) {
  let blank = true;
  for (let row = 0; row < lines.length; row++) {
    if (lines[row][col] !== ".") {
      blank = false;
      break;
    }
  }
  if (blank) {
    blankColumnIndicies.push(col);
  }
}

// build a list of coordinates
for (let col = 0; col < lines[0].length; col++) {
  for (let row = 0; row < lines.length; row++) {
    if (lines[row][col] === "#") {
      const preceedingBlankColumns = blankColumnIndicies.filter(
        (n) => n < col
      ).length;
      const preceedingBlankRows = blankRowIndicies.filter(
        (n) => n < row
      ).length;
      points.push({
        x: col + preceedingBlankColumns * (SCALE - 1),
        y: row + preceedingBlankRows * (SCALE - 1),
        distances: [],
      });
    }
  }
}

const distances: { [key: string]: number } = {};

// determine the shortest distance between each point
points.map((point, i) => {
  points.map((otherPoint, j) => {
    if (i !== j) {
      const distance =
        Math.abs(point.x - otherPoint.x) + Math.abs(point.y - otherPoint.y);

      // old logic, might be useful
      point.distances.push(distance);

      // keep track of the distances between each point - two points should
      // use the same index regardless of which is checked first
      const key = i < j ? `${i},${j}` : `${j},${i}`;
      distances[key] = distance;
    }
  });
});

const score = Object.values(distances).reduce((a, b) => a + b, 0);

console.log(blankColumnIndicies, blankRowIndicies, points);
console.log(score);
