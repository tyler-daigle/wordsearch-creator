import { assert, describe, expect, test } from "vitest";
import { Point, checkDirectionUp, createGrid, findPoint, shufflePoints } from "../src/main";

describe("Test the wordsearch creator", () => {
    test("The grid should be created with the correct size", () => {
        const expectedSize = 100;
        const grid = createGrid(10);
        expect(grid.length).toEqual(expectedSize);
    });

    test("The shuffle function should actually work", () => {
        const grid = createGrid(4);
        const p1 = grid[0];
        // this test could fail if it doesn't actually shuffle the first point 
        // which is possible because of the randomly selected positions.
        shufflePoints(grid);
        const p2 = grid[0];
        expect(p1).not.toEqual(p2);
    });

    test("findPoint should return the correct point", () => {
        const x = 1;
        const y = 1;
        const grid = createGrid(4);

        const p = findPoint(grid, x, y);
        expect(p.x).toEqual(x);
        expect(p.y).toEqual(y);
    });

    test("Trying to fit a word in the up direction where it won't fit will fail", () => {
        const grid = createGrid(8);
        const word = "hello";
        const x = 0;
        const y = 2; //only spaces 0,1,2 in the up direction - 3 spaces
        expect(checkDirectionUp(grid, word, x, y)).toBeFalsy();
    });

    test("Fit a word in the up direction", () => {
        const grid = createGrid(8);
        const word = "hello";
        const x = 0;
        const y = 5; //6 spaces available in the up direction
        expect(checkDirectionUp(grid, word, x, y)).toBeTruthy();
    });

    test("If a point is occupied then the word should NOT fit", () => {
        const grid = createGrid(8);
        const p = findPoint(grid, 0, 3);
        p.occupied = "p";

        const word = "hello";
        const x = 0;
        const y = 5; //6 spaces available in the up direction
        expect(checkDirectionUp(grid, word, x, y)).toBeFalsy();
    });

    test("Points with the same letters can share", () => {
        const grid = createGrid(8);

        const word = "hello";
        const x = 0;
        const y = 5; //6 spaces available in the up direction
        const p = findPoint(grid, x, y);
        p.occupied = "h"; // first letter will already be set to h
        expect(checkDirectionUp(grid, word, x, y)).toBeTruthy();
    });
})