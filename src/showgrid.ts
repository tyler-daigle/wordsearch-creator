import { checkDirectionUp, createGrid, gridToString, placeWord, shufflePoints } from "./main";

const gridSize = 10;
const grid = createGrid(gridSize);
const word = "hello";
const x = 0;
const y = 5;
shufflePoints(grid);

placeWord(grid, word, "up");
placeWord(grid, "again", "up");
placeWord(grid, "again", "up");
placeWord(grid, "again", "up");
placeWord(grid, "again", "up");
placeWord(grid, "again", "up");

placeWord(grid, "again", "up");

const gridString = gridToString(grid, gridSize);
console.log(gridString);