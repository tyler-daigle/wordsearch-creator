import { assert, describe, expect, test } from "vitest";
import { createGrid } from "../src/main";

describe("Test the wordsearch creator", () => {
    test("The grid should be created with the correct size", () => {
        const expectedSize = 100;
        const grid = createGrid(10);
        expect(grid.length).toEqual(expectedSize);
    });
})