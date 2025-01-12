/**
 * Cells workshop starter for IS51030B Graphics
 * Create a 3D sphere-shaped container of virtual "cells"
 * 
 * by Aman Butt 2023 <abutt004campus.goldsmiths.ac.uk>
 */


// add a color property to the cell
// add a texture to the cell

// Global arrays to store cells and repel cells objects
let cells = []; // array of cells objects
let repelCells = []; // array of cells which repell eachother 


/**
 * Initialise the cells array with a number of new Cell objects
 * 
 * @param {Integer} maxCells Number of cells for the new array
 * @returns {Array} array of new Cells objects 
 */
function createcellsOutput(maxCells)
{
  // 1. create new variable for empty array (to return at end)
  let babyCellsOutput = [];

  // 2. add a new Cell to the array *maxCells* times (for loop?)
  for (let i = 0; i < maxCells; i++) {
    // 2b. maybe use random vectors for position and velocity
    let randShape = i % 1 === 0 ? 'sphere' : 'concave'; // creating spherical cells and triangular shaped cells
    let randCell = new Cell({
      position: p5.Vector.random3D().mult(2),
      velocity: p5.Vector.random3D(),
      life: 600,
      diameter: random(20, 40),
      shape: randShape
    });
      
      


    // Add the random cell to the babyCellsOutput
    babyCellsOutput.push(randCell);
  }

  // 3. return the array variable
  return babyCellsOutput;
}

function createRepelcellsOutput(maxCells) {
  let babyCellsOutput = [];

  for (let i = 0; i < maxCells; i++) {
    let randCell = new Cell({
      position: p5.Vector.random3D().mult(200),
      velocity: p5.Vector.random3D(),
      life: 1000,
      diameter: random(50, 70)
    });

    babyCellsOutput.push(randCell);
  }

  return babyCellsOutput;
}

// Create a function that applies a repelling force from repel cells to cells
function applyRepelForce(cellsOutput, repelcellsOutput) {
  for (let cell of cellsOutput) {
    for (let repelCell of repelcellsOutput) {
      let repelDirection = p5.Vector.sub(cell.getPosition(), repelCell.getPosition()).normalize();
      let distance = cell.getPosition().dist(repelCell.getPosition());
      let repelForce = repelDirection.mult(1000 / (distance * distance));
      cell.applyForce(repelForce);
    }
  }
}



/**
 * Exercise: draw each of the cells to the screen
 * @param {Array} cellsOutput Array of Cell objects to draw 
 */
function drawCells3D(cellsOutput){
  // Loop through the cells array, for each cell:
  for (let cell of cellsOutput) {
    // 1. update the cell (call the update function)
    cell.update();

    // 2. draw the cell (first push the drawing matrix)
    push(); // Save the current drawing matrix

    // 2.1. translate to cell's position
    translate(cell.getPosition().x, cell.getPosition().y, cell.getPosition().z);

    // 2.2 draw a sphere with the cell diameter or a custom shape
    if (cell.getShape() === 'sphere') {
      sphere(cell.getDiameter());
    } else if (cell.getShape() === 'concave') {
      let radius = cell.getDiameter() / 2;
      beginShape();
      vertex(0, -radius, 0);
      vertex(-radius, radius, -radius);
      vertex(radius, radius, -radius);
      vertex(0, radius, radius);
      endShape(CLOSE);
    }
      


    // 2.3 pop the drawing matrix
    pop(); // Restore the previous drawing matrix
  }
}



/**
 * Check collision between two cells (overlapping positions)
 * @param {Cell} cell1 
 * @param {Cell} cell2 
 * @returns {Boolean} true if collided otherwise false
 */
function checkCollision(cell1, cell2)
{
 // 1. find the distance between the two cells using p5.Vector's dist() function
  let distance = cell1.getPosition().dist(cell2.getPosition());

  // 2. if it is less than the sum of their radii, they are colliding
  let radiiSum = (cell1.getDiameter() / 2) + (cell2.getDiameter() / 2);

  // 3. return whether they are colliding, or not
  return distance < radiiSum;
 
}


/**
 * Collide two cells together
 * @param {Array} cellsOutput Array of Cell objects to draw 
 */
function collideCells(cellsOutput) 
{
  // 1. go through the array
  for (let cell1 of cellsOutput)
  {
    for (let cell2 of cellsOutput)
    {
      if (cell1 !== cell2) // don't collide with itself or *all* cells will bounce!
      {
        if (checkCollision(cell1,cell2)) {
          // get direction of collision, from cell2 to cell1
          let collisionDirection = p5.Vector.sub(cell1.getPosition(), cell2.getPosition()).normalize();
          cell2.applyForce(collisionDirection.mult(-0.5)); // we calculated the direction as from 2-1 so this is backwards
          cell1.applyForce(collisionDirection.mult(0.5)); 
        }
      }
    }
  }
}

/**
 * Constrain cells to sphere world boundaries.
 * @param {Array} cellsOutput Array of Cell objects to draw 
 */
function constrainCells(cellsOutput, worldCenterPos, worldDiameter) 
{
  // 1. go through the array
  for (let cell of cellsOutput)
  {
    cell.constrainToSphere(worldCenterPos,worldDiameter);
  }
}



/**
 * Setup functions
 */

function setup() {
  createCanvas(800, 600, WEBGL);

  
  // Exercise 1: test out the constructor function.
  // What should you see printed in teh console if successful?

  let testCell = new Cell({
    position: createVector(1,2,3),
    velocity: createVector(-1,-2,-3),
    life: 600,
    diameter: 35
  });
  
  console.log("Testing cell:");
  console.log(testCell);

  // This is for part 2: creating a list of cells
   cells = createcellsOutput(15);
   console.log(cells)
    
  // Create repel cells
  repelCells = createRepelcellsOutput(10);
  console.log(repelCells);

}

/////

const maxCells = 50; // Set the maximum number of cells allowed

function mitosis(cellsOutput) {
  let babyCells = [];
  let cellsAlive = [];

  for (let cell of cellsOutput) {
    if (cell.getLife() < 4 && random() < 0.05) {
      // Check if the total number of cells (including new ones) is less than maxCells
      if (cellsOutput.length + babyCells.length + 1 < maxCells) {
        // The cell undergoes mitosis
        let babyCell1 = new Cell({
          position: cell.getPosition().copy(),
          velocity: p5.Vector.random3D(),
          life: 600,
          diameter: cell.getDiameter() * 0.5
        });

        let babyCell2 = new Cell({
          position: cell.getPosition().copy(),
          velocity: p5.Vector.random3D(),
          life: 600,
          diameter: cell.getDiameter() * 0.5
        });

        babyCells.push(babyCell1);
        babyCells.push(babyCell2);
      }
      // If maxCells limit is reached, add the current cell to the cellsAlive array
      cellsAlive.push(cell);
    } else {
      // The cell survives and is added to the cellsAlive array
      cellsAlive.push(cell);
    }
  }

  // Combine the surviving cells and new cells arrays
  return cellsAlive.concat(babyCells);
}

///----------------------------------------------------------------------------
/// p5js draw function 
///---------------------------------------------------------------------------
function draw() {

  
  orbitControl(); // camera control using mouse

  //lights(); // we're using custom lights here
  directionalLight(180,180,180, 0,0,-width/2);
  directionalLight(255,255,255, 0,0,width/2);
  
  ambientLight(100);
  pointLight(150,200,200, 0,0,0, 50);
  noStroke();
  background(60); // clear screen
  fill(230);
  ambientMaterial(80, 202, 94); // magenta material
  
  
  collideCells(cells); // handle collisions
  constrainCells(cells, createVector(0,0,0), width); // keep cells within the world
  applyRepelForce(cells, repelCells); // Apply repel force
  drawCells3D(cells); // draw the cells
    
  // Draw repel cells with a different color
  push();
  ambientMaterial(10, 255, 255); // red material for repel cells
  drawCells3D(repelCells);
  pop();

  // draw world boundaries
  ambientMaterial(255, 70, 94); // magenta material for subsequent objects
  sphere(width); // this is the border of the world, a little like a "skybox" in video games
  
  cells = mitosis(cells);
}