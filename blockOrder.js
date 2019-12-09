let blockOrder1 = ["F","C","S","C","F","C","S"];
let blockOrder2 = ["S","C","F","C","S","C","F"];
let blockIterator = 0;
let blockType = "N/A";
let iterators = {
  "F" : 0,
  "C" : 0,
  "S" : 0,
}

function displayFeedbackScreen(){
  setBlockType();

  // code for displaying feedback here
  showFeedback(iterators[blockType]);
  iterators[blockType]++;

  expType = 7;
}

function setBlockType(){
  blockType = blockOrder1[blockIterator];
  blockIterator++;
}

function showFeedback(iterator){
  let img = images[blockType][iterator];

  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // draw on canvas and add text
  ctx.drawImage(img,canvas.width/2 - img.width/2,210);
  ctx.fillText("Block Finished.",canvas.width/2,40);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,90);

  ctx.font = "italic bold 22px Arial";
  ctx.fillText("Remember, you need > " + taskAccCutoff+ "% accuracy to be paid.",canvas.width/2,140);

  ctx.font = "bold 25px Arial";
  ctx.fillText("Task Performance:",canvas.width/2,220);
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 300);
}

// // prep canvas
// ctx.clearRect(0, 0, canvas.width, canvas.height);
// ctx.fillStyle = "black";
// ctx.font = "25px Arial";
//
// // display miniblock text
// ctx.fillText("Control Block",canvas.width/2,canvas.height/2 - 50);
// ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2);
// ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
// ctx.font = "italic bold 22px Arial";
// ctx.fillText("Remember, you need >80% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);

// function proStabilityFeedback(){
//   let img = images["S"][flexIterator];
//
//   // prep canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "black";
//   ctx.font = "25px Arial";
//   ctx.drawImage(img,canvas.width/2 - img.width/2,20);
//
//   // display feedback
//   ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
//
//   // iterate stab images so next one is different image
//   stabIterator++;
// }
