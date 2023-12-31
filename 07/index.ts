import fs from "fs";
import { groupBy, orderBy } from "lodash";

// Access the command-line arguments using process.argv
const args = process.argv;

// Check if the "-test" argument is provided
const MODE_DEBUG = args.includes("-test");

const input = fs.readFileSync(
  `${__dirname}/${MODE_DEBUG ? "test2.txt" : "input.txt"}`,
  "utf8"
);

// score of each card - could be a map, but this is easier to read
// const cardScores = {
//   2: 1,
//   3: 2,
//   4: 3,
//   5: 4,
//   6: 5,
//   7: 6,
//   8: 7,
//   9: 8,
//   T: 9,
//   J: 10,
//   Q: 11,
//   K: 12,
//   A: 13,
// };

// part two scores
const cardScores = {
  J: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  Q: 11,
  K: 12,
  A: 13
};

const TYPE_SCORES_TIERS = Math.pow(13, 5) * 13;

type Hand = {
  cards: string[];
  scores: number[];
  bid: number;
  jackCount: number;
  fiveOfAKind?: number;
  fourOfAKind?: number;
  threeOfAKind?: number;
  twoOfAKind?: number;
  type: number;
  // score of the hand, allowing it to be compared to another hand of the same type
  typeScore: number;
  // total power of the hand, allowing it to be absolutely compared to another hand
  power: number;
};

function parseHands(input: string): Hand[] {
  const lines = input.trim().split("\n");
  const hands: Hand[] = [];

  for (const line of lines) {
    const [cardStr, bidStr] = line.split(" ");
    const cards = cardStr.split("");
    const scores = cards.map((card) => cardScores[card]);
    const bid = parseInt(bidStr, 10);

    const hand = {
      cards,
      scores,
      bid,
      fiveOfAKind: 0,
      fourOfAKind: 0,
      threeOfAKind: 0,
      twoOfAKind: 0,
      typeScore: 0,
      jackCount: scores.filter((s) => s === cardScores.J).length,
      type: 0,
      power: 0
    };

    const grouped = groupBy(scores);
    let availableJacks = hand.jackCount;

    const orderedGroups = orderBy(
      Object.values(grouped),
      "length",
      "desc"
    ).filter((grp) => grp[0] !== cardScores.J);

    if (orderedGroups.length === 0) {
      // edge case when all cards are jokers
      hand.fiveOfAKind++;
    } else {
      orderedGroups.forEach((group, key) => {
        if (
          group.length === 5 ||
          (group.length === 4 && availableJacks >= 1) ||
          (group.length === 3 && availableJacks >= 2) ||
          (group.length === 2 && availableJacks >= 3) ||
          (group.length === 1 && availableJacks >= 4) ||
          availableJacks >= 5
        ) {
          hand.fiveOfAKind++;
          availableJacks -= 5 - group.length;
        } else if (
          group.length === 4 ||
          (group.length === 3 && availableJacks >= 1) ||
          (group.length === 2 && availableJacks >= 2) ||
          (group.length === 1 && availableJacks >= 3) ||
          availableJacks >= 4
        ) {
          hand.fourOfAKind++;
          availableJacks -= 4 - group.length;
        } else if (
          group.length === 3 ||
          (group.length === 2 && availableJacks >= 1) ||
          (group.length === 1 && availableJacks >= 2) ||
          availableJacks >= 3
        ) {
          hand.threeOfAKind++;
          availableJacks -= 3 - group.length;
        } else if (
          group.length === 2 ||
          (group.length === 1 && availableJacks >= 1) ||
          availableJacks >= 2
        ) {
          hand.twoOfAKind++;
          availableJacks -= 2 - group.length;
        }
      });
    }

    if (hand.fiveOfAKind === 1) {
      hand.type = 7;
    } else if (hand.fourOfAKind === 1) {
      hand.type = 6;
    } else if (hand.threeOfAKind === 1 && hand.twoOfAKind === 1) {
      // full house
      hand.type = 5;
    } else if (hand.threeOfAKind === 1) {
      hand.type = 4;
    } else if (hand.twoOfAKind === 2) {
      hand.type = 3;
    } else if (hand.twoOfAKind === 1) {
      hand.type = 2;
    } else {
      // high card
      hand.type = 1;
    }

    console.log(line, hand.jackCount, hand.type, orderedGroups);

    hand.typeScore = scores.reduce((acc, score, i) => {
      // earlier cards are more important
      const position = 5 - i;
      const positionScore = Math.pow(13, position) * score;
      return acc + positionScore;
    }, 0);

    // the type score is the most important, then the type score
    hand.power = hand.type * TYPE_SCORES_TIERS + hand.typeScore;

    hands.push(hand);
  }

  return hands;
}

const hands: Hand[] = parseHands(input);
const rankedCards = orderBy(hands, "power", "desc");

console.log(rankedCards);

const winnings = rankedCards.reduce((acc, hand, i) => {
  const rank = rankedCards.length - i;
  const handWinnings = rank * hand.bid;
  return acc + handWinnings;
}, 0);

console.log(winnings);
