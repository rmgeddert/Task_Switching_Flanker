// some tasks.js specific variables
let trialFunc;
let screenSizePromptCount = 0, numScreenSizeWarnings = 2;
let capsLockPrompted = false;

// main task function
function runTasks(){
  //clear any instructions and show canvas
  hideInstructions();
  canvas.style.display = "block";

  // clear any instruction button press listeners
  $(document).off("click","#nextInstrButton");
  $(document).off("click","#startExpButton");
  $(document).off("click","#nextSectionButton");

  //reset accuracy and block trial count
  accCount = 0; blockTrialCount = 0;

  // --- PRACTICE 1 --- //
  if (expStage.indexOf("prac1") != -1){

    runPractice(getFirstPracticeTask);

  // --- PRACTICE 2 --- //
  } else if (expStage.indexOf("prac2") != -1){

    runPractice(getSecondPracticeTask);

  // --- PRACTICE 3 --- //
  } else if (expStage.indexOf("prac3") != -1) {

    runPractice();

  // --- MAIN TASK --- //
  } else if (expStage.indexOf("main") != -1) {
    // set blockType for first block of real task (see blockFeedback.js)
    blockType = "N";

    // reset values
    trialCount = 0; block = 1;

    // create task arrays
    createTaskArrays(numBlocks * trialsPerBlock);

    // start countdown into main task
    countDown(3);
  }
}

function runPractice(getTaskFunc = undefined){
  // reset values and create practice block arrays if first
  // iteration, add to existing practice array.
  if (repeatNecessary != true){
    trialCount = 0; block = 1;
    if (getTaskFunc != undefined) {
      createTaskArrays(numPracticeTrials, getTaskFunc());
    } else {
      createTaskArrays(numPracticeTrials);
    }
  } else {
    if (getTaskFunc != undefined) {
      addToTaskArrays(numPracticeTrials, getTaskFunc());
    } else {
      addToTaskArrays(numPracticeTrials);
    }
  }
  // start countdown into practice block
  countDown(3);
}

function createTaskArrays(numTrials, taskSpecification = ""){
  taskStimuliPairs = createStimuliAndTaskSets(numTrials, taskSpecification);
  taskStimuliSet = getStimSet(taskStimuliPairs);
  cuedTaskSet = getTaskSet(taskStimuliPairs);
  actionSet = createActionArray();
  switchRepeatList = getSwitchRepeatList(cuedTaskSet, numTrials); //list of switches and repeats
}

function addToTaskArrays(numTrials, taskSpecification = ""){
  taskStimuliPairs = taskStimuliPairs.concat( createStimuliAndTaskSets(numTrials, taskSpecification));
  taskStimuliSet = getStimSet(taskStimuliPairs);
  cuedTaskSet = getTaskSet(taskStimuliPairs);
  switchRepeatList = getSwitchRepeatList(cuedTaskSet, numTrials);
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
    trialFunc = (expStage.indexOf("main") != -1) ? runTrial : runPracticeTrial;
    trialFunc();
  }
}

function runPracticeTrial(){
  if (openerNeeded == false || opener != null) {
    sectionType = "pracTask";
    if (trialCount < taskStimuliSet.length){
      if (expType == 3){ //check fi key is being held down
        expType = 4;
        promptLetGo();
      } else {
        // check if screen size is big enough
        if (screenSizeIsOk()){
          // start next trial cycle
          fixationScreen();
        } else {
          promptScreenSize();
        }
      }
    } else { //if practice block is over, go to feedback screen
      practiceAccuracyFeedback( Math.round( accCount / (blockTrialCount) * 100 ) );
    }

  } else {
    // if menu is closed, hide other elements and show menu closed prompt
    hideInstructions();
    canvas.style.display = "none";
    promptMenuClosed();
  }
}

function runTrial(){
  // make sure opener (menu.html) is still open
  if (openerNeeded == false || opener != null) {
    sectionType = "mainTask";
    if (trialCount < numBlocks * trialsPerBlock) { //if exp isn't over yet

      if (trialCount % trialsPerBlock == 0 && !breakOn && trialCount != 0) {

        //if arrived at big block break
        breakOn = true; bigBlockScreen();
        block++;
        blockTrialCount = 0;

      } else if (trialCount % miniBlockLength == 0 && !breakOn && trialCount != 0) {

        //if arrived at miniblock break
        breakOn = true; miniBlockScreen();

      } else {

        breakOn = false;
        if (expType == 3){ //if key is being held down still
          expType = 4;
          promptLetGo();
        } else {

          // check if screen size is big enough
          if (screenSizeIsOk()){

            // start next trial cycle
            fixationScreen();

          } else {

            promptScreenSize();

          }
        }
      }

    } else {
      endOfExperiment();
    }

  } else {
    // if menu is closed, hide other elements and show menu closed prompt
    hideInstructions();
    canvas.style.display = "none";
    promptMenuClosed();
  }
}

function endOfExperiment(){
  // end of experiment stuff
  try {
    // upload data to menu.html's DOM element
    $("#RTs", opener.window.document).val(data.join(";"));

    // call menu debriefing script
    opener.updateMainMenu(2);

    // close the experiment window
    JavaScript:window.close();
  } catch (e) {
    alert("Data upload failed. Did you close the previous window?");
  }
}

function practiceAccuracyFeedback(accuracy){
  sectionStart = new Date().getTime() - runStart;
  sectionType = "pracFeedback";

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  expType = 9;

  // display feedback
  if (accuracy < practiceAccCutoff) { //if accuracy is too low

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",canvas.width/2,canvas.height/2);
    ctx.fillText("Press any button to go back ",canvas.width/2,canvas.height/2 + 80);
    ctx.fillText("to the instructions and try again.",canvas.width/2,canvas.height/2 + 110);

    // prep key press/instruction logic
    block++;
    repeatNecessary = true;

  } else { //otherwise proceed to next section

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

  // determine which function is next
  let nextScreenFunc;
  if (earlyFlankerInterval > 0 | earlyCueInterval > 0){
    nextScreenFunc = (earlyCueInterval > earlyFlankerInterval) ? earlyTaskCue : earlyFlanker;
  } else {
    nextScreenFunc = stimScreen();
  }

  // go to next after appropriate time
  setTimeout(nextScreenFunc, fixInterval);
}

function stimScreen(){
  if (expType == 5) {

    expType = 6;
    promptLetGo();

  } else {
    stimOnset = new Date().getTime() - runStart;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // set color, unless rectangular cue is needed.
    if (rectangleCue == false) {
      ctx.fillStyle = (cuedTaskSet[trialCount] == "m") ? magColor() : parColor();
    } else {
      // if so, set fillstyle to black and draw rectangular cue
      ctx.fillStyle = "black";
      drawRect();
    }

    //reset all response variables and await response (expType = 1)
    expType = 1; acc = NaN, respTime = NaN, partResp = NaN, respOnset = NaN;

    // display stimulus
    ctx.fillText(taskStimuliSet[trialCount],canvas.width/2,canvas.height/2);

    // proceed to ITI screen after timeout
    stimTimeout = setTimeout(itiScreen,stimInterval);
  }
}

function earlyFlanker(){
  if (expType == 5) {

    expType = 6;
    promptLetGo();

  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // if flankers are informative and there is no rectangle cue
    if (informativeEarlyFlankers == true && rectangleCue == false) {
        ctx.fillStyle = (cuedTaskSet[trialCount] == "m") ? magColor() : parColor();
    } else { //if not, fillStyle = "black"
      ctx.fillStyle = "black";
    }

    // draw flanker
    drawFlankers();

    // if rectangle cue is needed and cue precedes stimulus
    if (rectangleCue == true && earlyCueInterval > 0) {
      // if rectangle cue should be there right now
      if (earlyCueInterval >= earlyFlankerInterval) {
        drawRect();
      } else { //proceed to task cue
        setTimeout(stimScreen, earlyFlankerInterval)
      }
    } else {
      setTimeout(stimScreen, earlyFlankerInterval);
    }

    // if flanker precedes early cue (and early cue is needed)
    if (earlyCueInterval > 0 && earlyFlankerInterval > earlyCueInterval) {
      setTimeout(earlyTaskCue, earlyFlankerInterval - earlyCueInterval);
    } else {
      if (earlyCueInterval > 0) {
        drawRect();
      }
      setTimeout(stimScreen, earlyFlankerInterval);
    }
  }
}

function earlyTaskCue(){
  if (expType == 5) {

    expType = 6;
    promptLetGo();

  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // if cue precedes early flanker (and  early flanker is needed)
    if (earlyFlankerInterval > 0 && earlyCueInterval > earlyFlankerInterval) {
      setTimeout(earlyFlanker, earlyCueInterval - earlyFlankerInterval);
    } else {
      if (earlyFlankerInterval > 0) {
        // necessarily any flanker is drawn in black
        ctx.fillStyle = "black";
        drawFlankers();
      }
      setTimeout(stimScreen, earlyCueInterval);
    }

    // if preceded by early flanker
    drawRect();
  }
}

function drawFlankers(){
  // display flankers
  let flanker = expStimDict['distractor'][taskStimuliSet[trialCount]];
  let target = expStimDict['target'][taskStimuliSet[trialCount]];
  let targetSpace = (target == 1) ? " " : "  "; // one space for 1, two spaces for 2-9
  let justFlankers = flanker + flanker + targetSpace + flanker + flanker;
  ctx.fillText(justFlankers,canvas.width/2,canvas.height/2);
}

function drawRect(){
  // text margin
  let borderMargin = 40;

  // measure text
  let stimWidth = ctx.measureText(taskStimuliSet[trialCount]).width;
  let frameWidth = stimWidth + borderMargin;
  let frameHeight = 100; //unmeasurable, https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas

  // draw box
  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.strokeStyle = (cuedTaskSet[trialCount] == "m") ? magColor() : parColor();
  ctx.rect((canvas.width/2) - (frameWidth/2), (canvas.height/2) - (frameHeight/2) - 5, frameWidth, frameHeight);
  ctx.stroke();
}

function itiScreen(){
  if (expType == 1) { // participant didn't respond
    expType = 0;
  } else if (expType == 2) { //participant still holding down response key
    expType = 3;
  }

  // variable for readability below
  let stim = taskStimuliSet[trialCount];

  // log data
  data.push(["task", sectionType, block, blockType, trialCount + 1, blockTrialCount + 1,
    getAccuracy(acc), respTime, stim, expStimDict["target"][stim], expStimDict["distractor"][stim],
    expStimDict["congruency"][stim], cuedTaskSet[trialCount], switchRepeatList[trialCount],
    partResp, actionSet[trialCount], stimOnset, respOnset, NaN, NaN, NaN]);
  console.log(data);

  // prepare ITI canvas
  ctx.fillStyle = accFeedbackColor();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display response feedback (correct/incorrect/too slow)
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);

  // trial finished. iterate trial counters
  trialCount++; blockTrialCount++;

  // proceed to next trial or to next section after delay, unless capslock is on
  if (capslockOn){
    setTimeout(promptCapsLock, ITIInterval());
  } else {
    setTimeout(trialFunc, ITIInterval());
  }
}

function miniBlockScreen(){
  sectionType = "miniblock";
  sectionStart = new Date().getTime() - runStart;
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
  ctx.fillText("Remember, you need >" + taskAccCutoff + "% accuracy to be paid.",canvas.width/2,canvas.height/2 + 50);
}

function bigBlockScreen(){
  sectionType = "bigBlock";
  sectionStart = new Date().getTime() - runStart;
  expType = 7;

  // prep canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  // display big  block text
  ctx.font = "25px Arial";
  ctx.fillText("You finished block " + block + "/" + numBlocks + "!",canvas.width/2,canvas.height/2 - 100);
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount / trialCount) * 100) + "%.",canvas.width/2,canvas.height/2 - 50);

  // display accuracy reminder based on current accuracy
  ctx.font = "italic bold 22px Arial";
  if (Math.round((accCount / trialCount) * 100) < taskAccCutoff) {
    ctx.fillStyle = "red";
    ctx.fillText("You need >" + taskAccCutoff + "% accuracy in the task.",canvas.width/2,canvas.height/2);
  } else {
    ctx.fillStyle = "black";
    ctx.fillText("You need >" + taskAccCutoff + "% accuracy in the task.",canvas.width/2,canvas.height/2);
  }
  ctx.fillStyle = "black";

  ctx.font = "25px Arial";
  ctx.fillText("Always respond as quickly and as accurately as possible.",canvas.width/2,canvas.height/2 + 50);

  ctx.font = "bold 25px Arial";
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 150);
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

function getAccuracy(accValue){
  //normalizes accuracy values into 0 or 1 (NaN becomes 0)
  return accValue == 1 ? 1 : 0;
}

// --- misc functions for edge cases (pressing and not letting go, caps lock, screensize) ---
function promptLetGo(){
  //prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  // show warning
  ctx.fillText("Please release key",canvas.width/2,canvas.height/2);
  ctx.fillText("immediately after responding.",canvas.width/2,canvas.height/2 + 30);
}

function promptCapsLock(){
  //prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  // show warning
  ctx.fillText("Caps lock appears to be on.",canvas.width/2,canvas.height/2);
  ctx.fillText("Turn off caps lock and then",canvas.width/2,canvas.height/2 + 40);
  ctx.fillText("press any button to continue.",canvas.width/2,canvas.height/2 + 80);

  if (capsLockPrompted == false){ //prevents multiple listeners
    capsLockPrompted = true;

    // check for button response where capslock is off
    CapsLock.addListener(function(isOn){
      console.log("listener ran");
      if (!isOn){
        callAfterDelay(3,trialFunc);
      }
    });
  }
}

function callAfterDelay(delay, func){
  // generic function for calling a function func after a given time period delay
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "bold 60px Arial";
  if (delay > 0){
    ctx.fillText(delay,canvas.width/2,canvas.height/2)
    setTimeout(function(){callAfterDelay(delay - 1, func)},1000);
  } else {
    func();
  }
}

function screenSizeIsOk(){
  // attempts to check window width and height, using first base JS then jquery.
  // if both fail, returns TRUE
  let w, h, minWidth = 800, midHeight = 600;
  try {
    // base javascript
    w = window.innerWidth;
    h = window.innerHeight;
    if (w == null | h == null) {throw "window.innerWidth/innerHeight failed.";}
  } catch (err) {
    try{
      // jquery
      w = $(window).width();
      h = $(window).height();
      if (w == null | h == null) {throw "$(window).width/height failed.";}
    } catch (err2) {
      // failure mode, returns true if both screen checks failed
      return true;
    }
  }
  // return dimension check if values are defined
  return w >= minWidth && h >= midHeight;
};

function promptScreenSize(){
  // set key press experiment type
  expType = 10;

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // allows up to two warnings before terminating experiment
  if (screenSizePromptCount < numScreenSizeWarnings) {
    screenSizePromptCount++;

    // display screen size prompt
    ctx.font = "25px Arial";
    ctx.fillText("Your screen is not full screen or the",myCanvas.width/2,myCanvas.height/2);
    ctx.fillText("screen size on your device is too small.",myCanvas.width/2,(myCanvas.height/2) + 40);
    ctx.fillText("If this issue persists, you will need",myCanvas.width/2,(myCanvas.height/2)+160);
    ctx.fillText("to restart the experiment and will ",myCanvas.width/2,(myCanvas.height/2)+200);
    ctx.fillText("not be paid for your previous time.",myCanvas.width/2,(myCanvas.height/2)+240);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please correct this and press any button to continue.",myCanvas.width/2,(myCanvas.height/2)+100);

  } else {

    // display screen size prompt
    ctx.fillText("Your screen is not full screen",myCanvas.width/2,myCanvas.height/2);
    ctx.fillText("or the screen size on your device is too small.",myCanvas.width/2,(myCanvas.height/2)+50);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please refresh the page to restart the experiment.",myCanvas.width/2,(myCanvas.height/2)+100);

  }
}
