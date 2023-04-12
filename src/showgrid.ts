import { checkDirectionUp, createGrid, placeWord, shufflePoints } from "./main";

const grid = createGrid(10);
const word = "hello";
const x = 0;
const y = 5;

shufflePoints(grid);
if (checkDirectionUp(grid, word, x, y)) {
    placeWord(grid, word, x, y)
}