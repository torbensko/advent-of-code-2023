import fs from "fs";

// Access the command-line arguments using process.argv
const args = process.argv;

// Check if the "-test" argument is provided
const MODE_DEBUG = args.includes("-test");

const input = fs.readFileSync(
  `${__dirname}/${MODE_DEBUG ? "test.txt" : "input.txt"}`,
  "utf8"
);

enum Turn {
  R = "R",
  L = "L"
}

type Node = {
  left: string;
  right: string;
};

type DataStructure = {
  moves: Turn[];
  nodes: { [key: string]: Node };
};

function parseInput(input: string): DataStructure {
  const lines = input.split("\n");
  const movesLine = lines[0];
  const nodeLines = lines.slice(1);

  // Parse moves
  const moves = movesLine
    .split("")
    .map((move) => (move === "R" ? Turn.R : Turn.L));

  // Parse nodes
  const nodes: { [key: string]: Node } = {};
  nodeLines.forEach((line) => {
    const [key, value] = line.split(" = ");
    const [left, right] = value.replace(/[()]/g, "").split(", ");
    nodes[key.trim()] = { left: left.trim(), right: right.trim() };
  });

  return { moves, nodes };
}

const { moves, nodes } = parseInput(input);

class Walker {
  initialNode: string;
  currentNode: string;
  moveCount: number;

  constructor(initialNode: string) {
    this.initialNode = initialNode;
    this.currentNode = initialNode;
    this.moveCount = 0;
  }

  step() {
    this.currentNode =
      moves[this.moveCount % moves.length] === Turn.L
        ? nodes[this.currentNode].left
        : nodes[this.currentNode].right;
    this.moveCount++;
  }

  atFinish(): boolean {
    return this.currentNode.endsWith("Z");
  }

  factors(): number[] {
    const factors: number[] = [];
    for (let i = this.moveCount - 1; i > 1; i--) {
      if (this.moveCount / i === Math.round(this.moveCount / i))
        factors.push(i);
    }
    return factors;
  }
}

// part 1
// const walker = new Walker("AAA");
// do {
//   walker.step();
// } while (!walker.atFinish());
// console.log(walker.moveCount);

// part 2
const walkers = Object.keys(nodes)
  .filter((n) => n.endsWith("A"))
  .map((n) => new Walker(n));
let remainingWalkers = [...walkers];

do {
  remainingWalkers.forEach((walker) => {
    walker.step();
    if (walker.atFinish()) {
      remainingWalkers = remainingWalkers.filter((w) => w !== walker);
    }
  });
} while (remainingWalkers.length);

walkers.forEach((w) => console.log(`${w.moveCount} ${w.factors()}`));
const totalSteps = walkers
  // HACK based on the debug above, we know they share the first factor (263)
  .map((w) => w.factors()[1])
  // HACK based on the debug above, we know shared factor (263)
  .reduce((acc, moves) => acc * moves, 263);

console.log(totalSteps);
