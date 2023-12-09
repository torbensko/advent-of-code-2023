import fs from "fs";

// Access the command-line arguments using process.argv
const args = process.argv;

// Check if the "-test" argument is provided
const MODE_DEBUG = args.includes("-test");

const input = fs.readFileSync(
  `${__dirname}/${MODE_DEBUG ? "test.txt" : "input.txt"}`,
  "utf8"
);
