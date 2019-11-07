function runPractice(){
  if (expStage == "prac1"){

    stimCount = 0;

    // create arrays for this practice block
    taskStimuliSet = createTaskStimuliSet(24);
    cuedTaskSet = createCuedTaskArray(24, "magnitude");
    actionSet = createActionArray(taskStimuliSet, cuedTaskSet);

    // start countdown into practice block
    countDown(3);

  } else if (expStage == "prac2"){
    stimCount = 0;

    // create arrays for this practice block
    taskStimuliSet = createTaskStimuliSet(24);
    cuedTaskSet = createCuedTaskArray(24, "parity");
    actionSet = createActionArray(taskStimuliSet, cuedTaskSet);

    // start countdown into practice block
    countDown(3);

  } else if (expStage == "prac3") {

    stimCount = 0;

    // create arrays for this practice block
    taskStimuliSet = createTaskStimuliSet(24);
    cuedTaskSet = createCuedTaskArray(24);
    actionSet = createActionArray(taskStimuliSet, cuedTaskSet);

    // start countdown into practice block
    countDown(3);
  }
}

function countDown(seconds){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (seconds > 0){
    ctx.fillText(seconds,canvas.width/2,canvas.height/2)
    setTimeout(function(){countDown(seconds - 1)},1000);
  } else {
    runTrial();
  }
}

function runTrial(){
  if (stimCount < taskStimuliSet.length){
    if (expType == 3){
      expType = 4;
      console.log(expType);
      promptLetGo();
    } else {
      fixationScreen();
    }
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (expStage == "prac1"){
      expStage = "prac2";
      runInstructions();
    } else if (expStage == "prac2") {
      expStage = "prac3";
      runInstructions();
    } else {
      ctx.fillStyle = "Black";
      ctx.fillText("Finished!",canvas.width/2,canvas.height/2)
    }
  }
}

function fixationScreen(){
  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  // display fixation
  ctx.fillText("+",canvas.width/2,canvas.height/2);

  // display stimulus
  setTimeout(stimScreen, fixInterval);
}

function stimScreen(){
  if (expType == 5) {

    expType = 6;
    promptLetGo();

  } else {

    // prepare canvas for stimulus
    ctx.fillStyle = (cuedTaskSet[stimCount] == "magnitude") ? "red" : "blue";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //await trial response
    expType = 1; acc = 99;

    // display stimulus
    ctx.fillText(taskStimuliSet[stimCount],canvas.width/2,canvas.height/2);

    // proceed to ITI screen
    stimTimeout = setTimeout(itiScreen,stimInterval);

  }
}

function itiScreen(){
  // if still awaiting keyup front response, change expType so that keyup function doesn't trigger another itiscreen() call.
  if (expType == 1) {
    expType = 0;
  } else if (expType == 2) {
    expType = 3;
  }

  // prepare ITI canvas
  ctx.fillStyle = accFeedbackColor();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display response feedback (correct/incorrect)
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);

  // trial iteration finished. iterate stimCount.
  stimCount++;

  // proceed to next trial or to next section
  setTimeout(runTrial, ITIInterval());
}

// functions for determining ITI feedback depending on accuracy
function accFeedback(){
  if (acc == 1){
    return "Correct";
  } else if (acc == 0) {
    return "Incorrect";
  } else {
    return "Too Slow";
  }
}

function accFeedbackColor(){
  if (acc == 1){
    return "green";
  } else if (acc == 0) {
    return "red";
  } else {
    return "black";
  }
}

// functions for edge cases (too fast, button mashing, pressing and not letting go)
function promptLetGo(){
  //prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial"

  // show warning
  ctx.fillText("Please release key",canvas.width/2,canvas.height/2);
  ctx.fillText("immediately after responding.",canvas.width/2,canvas.height/2 + 30);

  // reset font for next trials
  ctx.font = "bold 60px Arial";
}
