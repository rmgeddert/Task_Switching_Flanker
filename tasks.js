function runPractice(){
  if (pracBlockNum == "1"){

    stimCount = 0;

    // create arrays for this practice block
    taskStimuliSet = createTaskStimuliSet(24);
    cuedTaskSet = createCuedTaskArray(24, "magnitude");
    actionSet = createActionArray(taskStimuliSet, cuedTaskSet);
    // console.log(taskStimuliSet);
    // console.log(cuedTaskSet);
    // console.log(actionSet);

    // go into block, including stimulus presentation and ITI's
    runTrial();

  } else if (pracBlockNum == "2"){
    stimCount = 0;

    // create arrays for this practice block
    taskStimuliSet = createTaskStimuliSet(24);
    cuedTaskSet = createCuedTaskArray(24, "parity");
    actionSet = createActionArray(taskStimuliSet, cuedTaskSet);

    // go into block, including stimulus presentation and ITI's
    runTrial();

  } else if (pracBlockNum == "3") {

    stimCount = 0;

    // create arrays for this practice block
    taskStimuliSet = createTaskStimuliSet(24);
    cuedTaskSet = createCuedTaskArray(24);
    actionSet = createActionArray(taskStimuliSet, cuedTaskSet);

    // go into block, including stimulus presentation and ITI's
    runTrial();
  }
}

function runTrial(){
  if (stimCount < taskStimuliSet.length){
    fixationScreen();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pracBlockNum == "1"){
      pracBlockNum = "2";
      runInstructions();
    } else if (pracBlockNum == "2") {
      pracBlockNum = "3";
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
  // prepare canvas for stimulus
  ctx.fillStyle = (cuedTaskSet[stimCount] == "magnitude") ? "red" : "blue";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //allow button response
  expType = 1; acc = 0;

  // display stimulus
  ctx.fillText(taskStimuliSet[stimCount],canvas.width/2,canvas.height/2);

  // proceed to ITI screen
  stimTimeout = setTimeout(itiScreen,stimInterval);
}

function itiScreen(){
  // prepare ITI canvas
  ctx.fillStyle = (acc == 1) ? "green" : "red"
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display response feedback (correct/incorrect)
  ctx.fillText((acc == 1) ? "Correct" : "Incorrect",canvas.width/2,canvas.height/2);

  // trial iteration finished. iterate stimCount.
  stimCount++;

  // proceed to next trial or to next section
  setTimeout(runTrial, itiInterval);
}
