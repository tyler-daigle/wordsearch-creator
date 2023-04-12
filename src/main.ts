/*
 Algorithm to use:

 - Create an array of all possible points
 - Shuffle the points array
 - Get the first element in the array of points as the starting point for a word
 - Determine the direction of the word - left, right, up, down
 - Check if the word will fit and if the points that the word will take up are still in the array (actually it should be a map indexed by (x,y) values)
 - If not just goto the next element in the list
 - If the point is used, remove each point from the list - or mark it used
 - A used point can contain the acutal letter, that way letters can be reused for words that have the same letter

 point = {
    x,
    y,
    occupied
 }

*/

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

export function findPoint(grid: Point[], x: number, y: number) : Point  {
    for(let i = 0; i < grid.length; i++) {
        const currPoint = grid[i];
        if(currPoint.x === x && currPoint.y === y) {
            return currPoint;
        }
    }

    throw new Error("The point wasn't found in findPoint() - this shouldn't happen");
    // return {x:0, y:0, occupied: ""};
}

export type Direction = "up" | "down" | "left" | "right";

export function checkDirectionUp(grid: Point[], word: string, x: number, y: number) : boolean {
    
    // if the word is going up, x is going to stay the same and y will decrease
    let currY = y;

    while(currY >= 0) {
        const p = findPoint(grid, x, currY);
        if(p.occupied) {
            return false;
        }
        currY--;
    }
    if(currY < 0) {
        return false;
    }
    return true;
}

export function placeWordUp(grid: Point[], word: string, x: number, y: number): void {
    return;
}   

export function placeWord(grid: Point[], word: string, direction: Direction): Point[] {

    let spotFound = false;
    // choose a starting spot, start at the first point
    let pointIndex = 0;

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
                if(checkDirectionUp(grid, word, startingX, startingY)) {
                    spotFound = true;
                    placeWordUp(grid, word, startingX, startingY);
                } else {
                    pointIndex++; //try next point
                }
                break;

            case "down":
            case "left":
            case "right":
                throw new Error("Direction not implemented yet");
        }
    }
    return grid;
}


// const points = createGrid(20);
// shufflePoints(points);

// console.log(checkDirectionUp(points, "hello", 0, 3));
// placeWord(points, "Hello", "up");
// console.log(points);

// const p = findPoint(points, 1,2);
// console.log(p);