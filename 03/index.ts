import fs from "fs";

const data = fs.readFileSync("./03/input.txt", "utf8");
// const data = fs.readFileSync("./03/test.txt", "utf8");
const lines = data.split("\n");

interface Gear {
  row: number;
  column: number;
  count: number;
  value: number;
}

const gameBoard = lines.map((line) => line.split(""));
const gears: Gear[] = [];

const regionContainsSpecialCharacter = (
  line: number,
  start: number,
  end: number,
  engineValue: number
) => {
  let hasSpecialCharacter = false;
  for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
    const row = line + rowOffset;
    for (let column = start - 1; column < end + 1; column++) {
      if (
        row > 0 &&
        row < gameBoard.length &&
        column > 0 &&
        column < gameBoard[line].length &&
        gameBoard[row][column].match(/[^\d.]/)
      ) {
        hasSpecialCharacter = true;
        if (gameBoard[row][column] === "*") {
          const existingGear = gears.find(
            (g) => g.column === column && g.row === row
          );
          if (existingGear) {
            console.log(`Existing gear at ${row}, ${column}`);
            existingGear.count++;
            existingGear.value *= engineValue;
          } else {
            console.log(`Found gear at ${row}, ${column}`);
            gears.push({
              row: row,
              column,
              count: 1,
              value: engineValue,
            });
          }
        }
      }
    }
  }
  return hasSpecialCharacter;
};

let totalEngineValue = 0;

for (let row = 0; row < gameBoard.length; row++) {
  for (let column = 0; column < gameBoard[row].length; ) {
    if (gameBoard[row][column].match(/\d/)) {
      const start = column;
      let end = column;
      let engineNumber = "";
      // scan ahead to find the end of the region
      while (end < gameBoard[row].length && gameBoard[row][end].match(/\d/)) {
        engineNumber += gameBoard[row][end];
        end++;
      }
      if (
        regionContainsSpecialCharacter(row, start, end, Number(engineNumber))
      ) {
        console.log(`Found engine ${engineNumber}`);
        totalEngineValue += Number(engineNumber);
      }
      column = end;
    } else {
      column++;
    }
  }
}

let totalGearValue = 0;
gears.forEach((gear) => {
  if (gear.count === 2) {
    totalGearValue += gear.value;
  }
});

console.log(totalEngineValue);
console.log(totalGearValue);
