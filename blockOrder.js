let blockOrder1 = ["F","C","S","C","F","C","S"];
let blockOrder2 = ["S","C","F","C","S","C","F"];
let blockIterator = 0;
let blockType = "N/A"

function displayFeedbackScreen(){
  setBlockType();
  // code for displaying feedback here
  if (blockType == "F") {
    proFlexibilityFeedback();
  } else if (blockType == "S") {
    proStabilityFeedback();
  } else {
    controlFeedback();
  }
  expType = 7;
}

function setBlockType(){
  blockType = blockOrder1[blockIterator];
  blockIterator++;
}

function proFlexibilityFeedback(){
  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // display feedback text
  ctx.fillText("Pro-Flexibility Block",canvas.width/2,canvas.height/2-50);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2);
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  ctx.font = "italic bold 22px Arial";
  ctx.fillText("Remember, you need >80% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);
}

function proStabilityFeedback(){
  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // display miniblock text
  ctx.fillText("Pro-Stability Block",canvas.width/2,canvas.height/2 - 50);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2);
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  ctx.font = "italic bold 22px Arial";
  ctx.fillText("Remember, you need >80% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);
}

function controlFeedback(){
  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // display miniblock text
  ctx.fillText("Control Block",canvas.width/2,canvas.height/2 - 50);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2);
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  ctx.font = "italic bold 22px Arial";
  ctx.fillText("Remember, you need >80% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);
}
