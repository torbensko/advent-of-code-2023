import fs from "fs";
import { writeFile } from "fs";
import { flatten, max, times } from "lodash";

// Access the command-line arguments using process.argv
const args = process.argv;

// Check if the "-test" argument is provided
const MODE_DEBUG = args.includes("-test");

const input = fs.readFileSync(
  `${__dirname}/${MODE_DEBUG ? "test2.txt" : "input.txt"}`,
  "utf8"
);

const land = input.split("\n").map((line) => line.split(""));
const distance = times(land.length, () => times(land[0].length, () => 0));

enum Direction {
  Up,
  Right,
  Down,
  Left
}

const pipes = {
  Vertical: "|",
  Horizontal: "-",
  RightDown: "7",
  DownLeft: "J",
  LeftUp: "L",
  UpRight: "F",
  Nothing: "."
};

const directionStr = (direction: Direction) => {
  switch (direction) {
    case Direction.Up:
      return "up";
    case Direction.Down:
      return "down";
    case Direction.Right:
      return "right";
    case Direction.Left:
      return "left";
  }
};

class Walker {
  // determine if we're not allowed to move the way just attempted
  isFinished = false;

  constructor(
    public x: number,
    public y: number,
    public direction: Direction,
    public score = 1
  ) {}

  move() {
    const pipe = land[this.y][this.x];
    this.score++;

    switch (pipe) {
      case pipes.Nothing:
        this.isFinished = true;
        break;
      case pipes.Vertical:
        switch (this.direction) {
          case Direction.Up:
            this.y--;
            break;
          case Direction.Right:
            this.isFinished = true;
            break;
          case Direction.Down:
            this.y++;
            break;
          case Direction.Left:
            this.isFinished = true;
            break;
        }
        break;
      case pipes.Horizontal:
        switch (this.direction) {
          case Direction.Up:
            this.isFinished = true;
            break;
          case Direction.Right:
            this.x++;
            break;
          case Direction.Down:
            this.isFinished = true;
            break;
          case Direction.Left:
            this.x--;
            break;
        }
        break;
      case pipes.RightDown: // UpLeft
        switch (this.direction) {
          case Direction.Up:
            this.x--;
            this.direction = Direction.Left;
            break;
          case Direction.Right:
            this.y++;
            this.direction = Direction.Down;
            break;
          case Direction.Down:
            this.isFinished = true;
            break;
          case Direction.Left:
            this.isFinished = true;
            break;
        }
        break;
      case pipes.DownLeft: // RightUp
        switch (this.direction) {
          case Direction.Up:
            this.isFinished = true;
            break;
          case Direction.Right:
            this.y--;
            this.direction = Direction.Up;
            break;
          case Direction.Down:
            this.x--;
            this.direction = Direction.Left;
            break;
          case Direction.Left:
            this.isFinished = true;
            break;
        }
        break;
      case pipes.LeftUp: // DownRight
        switch (this.direction) {
          case Direction.Up:
            this.isFinished = true;
            break;
          case Direction.Right:
            this.isFinished = true;
            break;
          case Direction.Down:
            this.x++;
            this.direction = Direction.Right;
            break;
          case Direction.Left:
            this.y--;
            this.direction = Direction.Up;
            break;
        }
        break;
      case pipes.UpRight: // LeftDown
        switch (this.direction) {
          case Direction.Up:
            this.x++;
            this.direction = Direction.Right;
            break;
          case Direction.Right:
            this.isFinished = true;
            break;
          case Direction.Down:
            this.isFinished = true;
            break;
          case Direction.Left:
            this.y++;
            this.direction = Direction.Down;
            break;
        }
        break;
    }

    if (distance[this.y][this.x] !== 0) {
      // hit a square that has previously been visited
      this.isFinished = true;
    } else {
      distance[this.y][this.x] = this.score;
    }
  }
}

function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, "0");
}

let walkers: Walker[] = [];

land.forEach((l, y) =>
  l.forEach((c, x) => {
    if (c === "S") {
      if (y - 1 >= 0) {
        walkers.push(new Walker(x, y, Direction.Up));
      }
      if (x + 1 < land[0].length) {
        walkers.push(new Walker(x, y, Direction.Right));
      }
      if (y + 1 < land.length) {
        walkers.push(new Walker(x, y, Direction.Down));
      }
      if (x - 1 >= 0) {
        walkers.push(new Walker(x, y, Direction.Left));
      }
    }
  })
);

do {
  walkers.forEach((walker) => {
    walker.move();
    // remove once they have finished exploring the map
    if (walker.isFinished) walkers = walkers.filter((w) => w !== walker);
  });
} while (walkers.length > 0);

// land.forEach((d) => console.log(d));
let output = "";
distance.forEach(
  (line) => (output += line.map((n) => padNumber(n, 3)).join("|") + "\n")
);
writeFile("./10/output.txt", output, "utf8", (err) => {});
console.log(max(flatten(distance)));
