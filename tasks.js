let trialFunc;
function runTasks(){

  //clear any instructions and show canvas
  hideInstructions();
  canvas.style.display = "block";

  if (expStage.indexOf("prac1") != -1){

    // reset values, only if this is first practice iteration
    if (repeatNecessary != true){
      trialCount = 0; accCount = 0, block = 1;

      // create new arrays for this practice block
      createTaskArrays(12, getFirstPracticeTask());

    } else {

      //add to old task arrays
      addToTaskArrays(12, getFirstPracticeTask());
    }

    // start countdown into practice blockm
    countDown(3);

  } else if (expStage.indexOf("prac2") != -1){

    // reset values, only if this is first practice iteration
    if (repeatNecessary != true){
      trialCount = 0; accCount = 0, block = 1;

      // create new arrays for this practice block
      createTaskArrays(12, getSecondPracticeTask());
    } else {

      //add to old task arrays
      addToTaskArrays(12, getSecondPracticeTask());
    }

    // start countdown into practice block
    countDown(3);

  } else if (expStage.indexOf("prac3") != -1) {

    // reset values, only if this is first practice iteration
    if (repeatNecessary != true){
      trialCount = 0; accCount = 0, block = 1;

      // create new arrays for this practice block
      createTaskArrays(24);
    } else {

      //add to old task arrays
      addToTaskArrays(24);
    }

    // start countdown into practice block
    countDown(3);

  } else if (expStage.indexOf("main") != -1) {

    // reset values, only if this is first practice iteration
    if (repeatNecessary != true){
      trialCount = 0; accCount = 0, block = 1;
    }

    // create task arrays
    createTaskArrays(numBlocks * trialsPerBlock);

    // start countdown into main task
    countDown(3);
  }
}

function createTaskArrays(numTrials, taskSpecification = ""){
  taskStimuliPairs = createStimuliAndTaskSets(numTrials, taskSpecification);
  taskStimuliSet = getStimSet(taskStimuliPairs);
  cuedTaskSet = getTaskSet(taskStimuliPairs);
  actionSet = createActionArray();
}

function addToTaskArrays(numTrials, taskSpecification = ""){
  taskStimuliPairs = taskStimuliPairs.concat( createStimuliAndTaskSets(numTrials, taskSpecification));
  taskStimuliSet = getStimSet(taskStimuliPairs);
  cuedTaskSet = getTaskSet(taskStimuliPairs);
  actionSet = createActionArray();
}

function countDown(seconds){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "bold 60px Arial";
  if (seconds > 0){
    ctx.fillText(seconds,canvas.width/2,canvas.height/2)
    setTimeout(function(){countDown(seconds - 1)},1000);
  } else {
    if (expStage.indexOf("main") != -1){
      trialFunc = runTrial;
    } else {
      trialFunc = runPracticeTrial;
    }
    trialFunc();
  }
}

function runPracticeTrial(){
  if (trialCount < taskStimuliSet.length){
    if (expType == 3){
      expType = 4;
      promptLetGo();
    } else {
      fixationScreen();
    }
  } else {
    practiceAccuracyFeedback( Math.round( accCount / (trialCount) * 100 ) );
  }
}

function runTrial(){
  if (trialCount < numBlocks * trialsPerBlock) {

    if (trialCount % trialsPerBlock == 0 && !breakOn && trialCount != 0) {

      breakOn = true; displayFeedbackScreen();
      block++;

    } else if (trialCount % miniBlockLength == 0 && !breakOn && trialCount != 0) {

      breakOn = true; miniBlockScreen();

    } else {

      breakOn = false;
      if (expType == 3){
        expType = 4;
        promptLetGo();
      } else {
        // start trial cycle
        fixationScreen();
      }
    }

  } else {
    // end of experiment stuff
    console.log("Finished Experiment!");
  }
}

function practiceAccuracyFeedback(accuracy){
  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  expType = 9;

  // display feedback
  if (accuracy < practiceAccCutoff) {

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",canvas.width/2,canvas.height/2);
    ctx.fillText("Press any button to go back ",canvas.width/2,canvas.height/2 + 80);
    ctx.fillText("to the instructions and try again.",canvas.width/2,canvas.height/2 + 110);

    // prep key press/instruction logic
    block++;
    repeatNecessary = true;

  } else {

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Press any button to go on to the next section.",canvas.width/2,canvas.height/2 + 100);

    // prep key press/instruction logic
    repeatNecessary = false;

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
    stimOnset = new Date().getTime() - runStart;

    // prepare canvas for stimulus
    ctx.fillStyle = (cuedTaskSet[trialCount] == "m") ? magColor() : parColor();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //await trial response
    expType = 1; acc = 99;

    // display stimulus
    ctx.fillText(taskStimuliSet[trialCount],canvas.width/2,canvas.height/2);

    // proceed to ITI screen
    stimTimeout = setTimeout(itiScreen,stimInterval);

  }
}

function itiScreen(){
  if (expType == 1) { // participant didn't respond
    expType = 0;
    respTime = null;
  } else if (expType == 2) { //participant still holding down response key
    expType = 3;
  }

  // -- store data in logger -- //

  // temp variables for readability
  let stim = taskStimuliSet[trialCount];

  // log data
  data.push([expStage, block, trialCount, acc, respTime,
    stim, expStimDict["target"][stim], expStimDict["distractor"][stim],
    expStimDict["congruency"][stim], partResp, actionSet[trialCount], stimOnset, respOnset ]);

  // prepare ITI canvas
  ctx.fillStyle = accFeedbackColor();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display response feedback (correct/incorrect)
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);

  // trial iteration finished. iterate trialCount
  trialCount++;

  // proceed to next trial or to next section
  setTimeout(trialFunc, ITIInterval());
}

function miniBlockScreen(){
  expType = 7;

  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // display miniblock text
  ctx.fillText("You are "+ Math.round((trialCount/trialsPerBlock)*100)+"% through this block.",canvas.width/2,canvas.height/2 - 50);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2);
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  ctx.font = "italic bold 22px Arial";
  ctx.fillText("Remember, you need >80% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);
}

function blockFeedback(){
  expType = 7;
  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  // display feedback
  // display miniblock text
  ctx.fillText("You are "+ Math.round((trialCount / (trialsPerBlock * numBlocks) ) * 100)+"% through this experiment.",canvas.width/2,canvas.height/2 - 50);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount / trialCount) * 100) + "%.",canvas.width/2,canvas.height/2);
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  ctx.font = "italic bold 22px Arial";
  ctx.fillText("Remember, you need >80% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);
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
  ctx.font = "30px Arial";

  // show warning
  ctx.fillText("Please release key",canvas.width/2,canvas.height/2);
  ctx.fillText("immediately after responding.",canvas.width/2,canvas.height/2 + 30);
}
