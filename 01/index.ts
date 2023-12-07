import fs from "fs";

const data = fs.readFileSync("./01/input.txt", "utf8");
const lines = data.split("\n"); // Splitting the text by new lines

function sumArray(numbers) {
  return numbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

const namedNumberToDigitMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function getFirstMatchingNamedNumber(number: string, fromBack: boolean) {
  for (let i = 0; i < number.length; i++) {
    const subword = fromBack
      ? number.substring(number.length, number.length - i)
      : number.substring(0, i);
    const numberWords = Object.keys(namedNumberToDigitMap);
    for (let w = 0; w < numberWords.length; w++) {
      if (subword.includes(numberWords[w])) return numberWords[w];
    }
  }
}

function replaceWordedNumber(number: string, fromBack = false) {
  const matchingNamedNumber = getFirstMatchingNamedNumber(number, fromBack);
  if (!matchingNamedNumber) {
    return number;
  }
  return number.replace(
    new RegExp(matchingNamedNumber, "g"),
    namedNumberToDigitMap[matchingNamedNumber]
  );
}

// without fix
const numbers = lines.map((line: string) => {
  // apply the fix
  const firstDigit = replaceWordedNumber(line).match(/^[^\d]*(\d)/);
  const lastDigit = replaceWordedNumber(line, true).match(/(\d)[^\d]*$/);
  if (!firstDigit || !lastDigit) {
    throw new Error("missing digits");
  }
  const number = parseInt(`${firstDigit[1]}${lastDigit[1]}`);
  return number;
});

console.log(sumArray(numbers));

// 25ksx49lrcroneightz 21 WRONG
// 8xplcnjxfthreeeightthree
// 5threenine 53
