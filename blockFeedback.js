let blockOrder1 = ["F","C","S","C","F","C","S"];
let blockOrder2 = ["S","C","F","C","S","C","F"];
let blockIterator = 0;
let blockType = NaN;
let iterators = {
  "F" : 0,
  "C" : 0,
  "S" : 0,
}
// randomly pick one of the two block orders
let blockOrder = (Math.round(Math.random()) == 0) ? blockOrder1 : blockOrder2;

function displayFeedbackScreen(){
  sectionType = "taskFeedback";
  sectionStart = new Date().getTime() - runStart;

  // get feedback type
  getBlockType();

  // code for displaying feedback here
  showFeedback(iterators[blockType]);
  iterators[blockType]++;

  // prepare button press
  expType = 7;
}

function getBlockType(){
  blockType = blockOrder[blockIterator];
  blockIterator++;
}

function showFeedback(iterator){
  let img = images[blockType][iterator];

  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";

  // draw feedback image
  ctx.drawImage(img,canvas.width/2 - img.width/2,90);

  // add text
  ctx.fillText("You finished block " + block + "/" + numBlocks + "!",canvas.width/2,30);

  ctx.font = "bold 18px Arial";
  ctx.fillText("Below is your performance on the previous block. Your score",canvas.width/2,60);
  ctx.fillText("is based on both your accuracy and your response speed.",canvas.width/2,80);

  ctx.font = "20px Arial";
  ctx.fillText("Your accuracy is " + Math.round((accCount/trialCount)*100) + "%. Remember, you need >"+ taskAccCutoff+ "% accuracy to be paid.",canvas.width/2, canvas.height/2 + 245);

  ctx.font = "bold 20px Arial";
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 290);
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
