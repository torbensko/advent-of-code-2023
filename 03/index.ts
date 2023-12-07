import fs from "fs";

const data = fs.readFileSync("./03/input.txt", "utf8");
const lines = data.split("\n");

const gameBoard = lines.map((line) => line.split(""));

const regionContainsSpecialCharacter = (
  row: number,
  start: number,
  end: number
) => {
  for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
    for (let column = start - 1; column < end + 1; column++) {
      if (
        row + rowOffset > 0 &&
        row + rowOffset < gameBoard.length &&
        column > 0 &&
        column < gameBoard[row].length &&
        gameBoard[row + rowOffset][column].match(/[^\d.]/)
      ) {
        return true;
      }
    }
  }
  return false;
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
      if (regionContainsSpecialCharacter(row, start, end)) {
        console.log(`Found engine ${engineNumber}`);
        totalEngineValue += Number(engineNumber);
      }
      column = end;
    } else {
      column++;
    }
  }
}

console.log(totalEngineValue);
