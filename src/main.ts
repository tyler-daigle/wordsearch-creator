/*
 Algorithm to use:

 - Create an array of all possible points
 - Shuffle the points array
 - Get the first element in the array of points as the starting point for a word
 - Determine the direction of the word - left, right, up, down
 - Check if the word will fit and if the points that the word will take up are still in the array (actually it should be a map indexed by (x,y) values)
 - If not just goto the next element in the list
 - If the point is used, remove each point from the list - or mark it used
 - A used point can contain the actual letter, that way letters can be reused for words that have the same letter


 TODO: Can optimize by having a separate array that holds the starting points, each time a 
       point is used just remove it from the array.

 point = {
    x,
    y,
    occupied
 }

*/

// - Choose a random starting position for the word in the grid.
// - Choose a random direction (horizontal, vertical, or diagonal) for the word.
// - Check if the word can fit in the chosen direction without overlapping with existing words 
//   or going out of bounds of the grid.
// - If the word fits, add it to the grid and move on to the next word. If it doesn't fit, 
//   choose a new starting position and direction and repeat the process.
// To speed up the process, you can use a hash table to keep track of the occupied cells in the 
// grid and check if the new word overlaps with any of the occupied cells before adding it to the 
// grid. You can also use a trie data structure to quickly check if a partial word can be completed 
// into a valid word.

export type Direction = "up" | "down" | "left" | "right";

export type Point = {
    x: number;
    y: number;
    occupied: string;
};

function createEmptyPoint(x: number, y: number): Point {
    return { x, y, occupied: "" };
}


// assume all the grids are square, so size is the height and width
export function createGrid(size: number): Point[] {
    const points: Point[] = [];
    let y = 0;
    let x = 0;
    const numPoints = size * size;

    for (let i = 0; i < numPoints; i++) {
        points.push(createEmptyPoint(x, y));
        x++;
        if (x === size) {
            x = 0;
            y++;
        }
    }
    return points;
}

export function shufflePoints(points: Point[]): Point[] {
    let currentLength = points.length;

    while (currentLength > 0) {
        const chosen = Math.floor(Math.random() * currentLength);
        const temp = points[chosen];
        points[chosen] = points[currentLength - 1];
        points[currentLength - 1] = temp;
        currentLength--;
    }
    return points;
}

export function findPoint(grid: Point[], x: number, y: number): Point {
    for (let i = 0; i < grid.length; i++) {
        const currPoint = grid[i];
        if (currPoint.x === x && currPoint.y === y) {
            return currPoint;
        }
    }

    throw new Error("The point wasn't found in findPoint() - this shouldn't happen");
    // return {x:0, y:0, occupied: ""};
}

export function checkDirectionDown(grid: Point[], word: string, x: number, y: number): boolean {
    // going down, x will stay the same and the y value will increase
    // just calculate the ending y position and reverse the string and use the up functions
    let startingY = y + word.length - 1;
    const reversedWord = word.split("").reverse().join("");
    return checkDirectionUp(grid, reversedWord, x, startingY);
}

export function checkDirectionUp(grid: Point[], word: string, x: number, y: number): boolean {

    // if the word is going up, x is going to stay the same and y will decrease
    let currY = y;
    let charCount = 0;
    const sharingOk = true; // changing this will cause tests to fail

    while (currY >= 0) {
        try {

            const p = findPoint(grid, x, currY);
            
            // letters can be shared between words
            if (p.occupied && p.occupied !== word[charCount]) {
                return false;
            }
            
            // no sharing
            if (p.occupied && !sharingOk) {
                return false;
            }
            
            currY--;
            charCount++; // keep track of num of chars that will fit
            if (charCount === word.length) {
                return true;
            }
        }catch(e) {
            // point wasn't found
            // have to catch here because there is no check for going out of bounds
            // of the grid other than at the top - 
            // TODO: Change the grid to be an object that has a height and width to make 
            // checking easier.
            return false;
        }

    }

    return false;
}
export function placeWordDown(grid: Point[], word: string, x: number, y: number): void {
    const reversedWord = word.split("").reverse().join("");
    const startingY = y + word.length - 1;
    return placeWordUp(grid, reversedWord, x, startingY);
}

export function placeWordUp(grid: Point[], word: string, x: number, y: number): void {
    // place a word in the up direction - which means that the y coordinate is going 
    // to be decreasing. X will stay the same

    // There are no checks to see if the position is occupied already - it is assumed that
    // checkPositionUp() was called and returned true.

    let currY = y;

    for (let i = 0; i < word.length; i++) {
        const p = findPoint(grid, x, currY);
        // findPoint() will throw an error if the point doesn't exist (out of bounds)
        p.occupied = word.charAt(i);
        currY--;
    }
    return;
}

// placeWord() will insert the word into the grid at a random position in the passed direction
// it returns a 2 element array for the starting x and y coordinates of where the word was
// placed in the grid. 
export function placeWord(grid: Point[], word: string, direction: Direction): [number, number] {

    let spotFound = false;
    // choose a starting spot, start at the first point
    let pointIndex = 0;
    let foundX: number = 0;
    let foundY: number = 0;

    while (!spotFound) {
        if (pointIndex === grid.length) {
            throw new Error("The grid has gone out of bounds.");
        }

        const currentSpot = grid[pointIndex];
        if (currentSpot.occupied) {
            pointIndex++;
            continue;
        }

        const startingX = currentSpot.x;
        const startingY = currentSpot.y;

        switch (direction) {
            case "up":
                if (checkDirectionUp(grid, word, startingX, startingY)) {
                    spotFound = true;
                    placeWordUp(grid, word, startingX, startingY);
                    foundX = startingX;
                    foundY = startingY;
                } else {
                    pointIndex++; //try next point
                }
                break;

            case "down":
                if(checkDirectionDown(grid, word, startingX, startingY)) {
                    spotFound = true;
                    placeWordDown(grid, word, startingX, startingY);
                    foundX = startingX;
                    foundY = startingY;
                } else {
                    pointIndex++;
                }
                break;
            case "left":
            case "right":
                throw new Error("Direction not implemented yet");
        }
    }
    // the starting position of the string is returned. Mostly for testing. The 
    // coordinates for a string going down will actually point to the end of the
    // string though.
    return [foundX, foundY]; 
}

export function gridToString(grid: Point[], size: number): string {

    let x = 0;
    let y = 0;
    let gridString: string[] = [];

    for (let i = 0; i < size * size; i++) {
        const p = findPoint(grid, x, y);
        gridString.push(p.occupied === "" ? "+" : p.occupied);
        x++;
        if (x === size) {
            y++;
            x = 0;
            gridString.push("\n");
        }
    }
    return gridString.join("");

}

// const points = createGrid(20);
// shufflePoints(points);

// console.log(checkDirectionUp(points, "hello", 0, 3));
// placeWord(points, "Hello", "up");
// console.log(points);

// const p = findPoint(points, 1,2);
// console.log(p);